(async () => {
  const { openaiApiKey: API_KEY } = await chrome.storage.local.get('openaiApiKey');
  if (!API_KEY) {
    console.warn('OpenAI API key not found in storage.');
    return;
  }

  function collectTextNodes(node, nodes = []) {
    if (
      node.nodeType === Node.ELEMENT_NODE &&
      ['SCRIPT', 'STYLE', 'NOSCRIPT', 'IFRAME'].includes(node.tagName)
    ) return nodes;

    if (node.nodeType === Node.TEXT_NODE && node.textContent.trim()) {
      nodes.push(node);
    } else if (node.childNodes) {
      Array.from(node.childNodes).forEach(child => collectTextNodes(child, nodes));
    }

    return nodes;
  }

  function blurSentencesInNode(node, sentencesToBlur) {
    const originalText = node.textContent;
    const fragment = document.createDocumentFragment();

    const sentences = originalText.match(/[^.!?]+[.!?]*/g) || [originalText];

    sentences.forEach((sentence) => {
      const span = document.createElement('span');
      span.textContent = sentence + ' ';
      if (sentencesToBlur.includes(sentence.trim())) {
        span.className = 'blur-sentence';
      }
      fragment.appendChild(span);
    });

    if (node.parentNode) {
      node.parentNode.replaceChild(fragment, node);
    }
  }

  async function batchModerate(inputs, batchSize = 50) {
    const flaggedIndices = new Set();

    for (let i = 0; i < inputs.length; i += batchSize) {
      const chunk = inputs.slice(i, i + batchSize);
      try {
        const res = await fetch('https://api.openai.com/v1/moderations', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${API_KEY}`,
          },
          body: JSON.stringify({ model: 'omni-moderation-latest', input: chunk }),
        });

        if (!res.ok) {
          console.error('Moderation API error:', res.status, await res.text());
          continue;
        }

        const json = await res.json();
        json.results.forEach((r, idx) => {
          if (r.flagged) flaggedIndices.add(i + idx);
        });
      } catch (err) {
        console.error(`❌ Error in moderation batch ${i}-${i + batchSize}:`, err);
      }
    }

    return flaggedIndices;
  }

  async function moderateAndBlur() {
    document.body.style.filter = 'blur(12px)';
    document.body.style.pointerEvents = 'none';

    const textNodes = collectTextNodes(document.body);
    const chunks = [];
    const chunkMap = [];

    textNodes.forEach((node, nodeIndex) => {
      const words = node.textContent.trim().split(/\s+/);
      for (let i = 0; i < words.length; i += 50) {
        const chunkWords = words.slice(i, i + 50);
        const chunkText = chunkWords.join(' ');
        chunks.push(chunkText);
        chunkMap.push({ nodeIndex, text: chunkText });
      }
    });

    const flaggedChunkIndices = await batchModerate(chunks);

    const flaggedSentencesPerNode = new Map();

    for (const index of flaggedChunkIndices) {
      const { nodeIndex, text } = chunkMap[index];
      const sentences = text.match(/[^.!?]+[.!?]*/g) || [text];

      const flaggedSentences = [];

      const flaggedSentenceIndices = await batchModerate(sentences);

      flaggedSentenceIndices.forEach(i => {
        flaggedSentences.push(sentences[i].trim());
      });

      if (!flaggedSentencesPerNode.has(nodeIndex)) {
        flaggedSentencesPerNode.set(nodeIndex, []);
      }
      flaggedSentencesPerNode.get(nodeIndex).push(...flaggedSentences);
    }

    flaggedSentencesPerNode.forEach((sentences, nodeIndex) => {
      const node = textNodes[nodeIndex];
      blurSentencesInNode(node, sentences);
    });

    document.body.style.filter = '';
    document.body.style.pointerEvents = '';

    console.log('✅ Selective sentence blur complete.');
  }

  // Inject CSS for blur class
  const style = document.createElement('style');
  style.textContent = `.blur-sentence { filter: blur(6px); background: rgba(0,0,0,0.1); cursor: help; }`;
  document.head.appendChild(style);

  moderateAndBlur();

})();

