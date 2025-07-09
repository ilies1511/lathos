const API_KEY = ''; // Insert your real OpenAI key here

function blurWordsInNode(node, wordIndicesToBlur) {
  const originalText = node.textContent.trim();
  const words = originalText.split(/\s+/);
  const fragment = document.createDocumentFragment();

  words.forEach((word, i , dx) => {
    const span = document.createElement('span');
    span.textContent = word + ' ';
    if (wordIndicesToBlur.has(idx)) {
      span.className = 'blur-word';
    }
    fragment.appendChild(span);
  });

  const parent = node.parentNode;
  if (parent) {
    parent.replaceChild(fragment, node);
  }
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

async function moderateChunks(chunks) {
  const flaggedChunks = new Set();

  for (let i = 0; i < chunks.length; i++) {
    const { words } = chunks[i];
    const input = words.join(' ');

    try {
      const res = await fetch('https://api.openai.com/v1/moderations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${API_KEY}`,
        },
        body: JSON.stringify({
          model: 'omni-moderation-latest',
          input,
        }),
      });

      const json = await res.json();
      if (json.results?.[0]?.flagged) {
        flaggedChunks.add(i);
      }
    } catch (err) {
      console.error(`❌ Error moderating chunk ${i + 1}:`, err);
    }
  }

  return flaggedChunks;
}

async function moderateAndBlurChunks() {
  // 1. Temporary blur entire page
  document.body.style.filter = 'blur(12px)';
  document.body.style.pointerEvents = 'none';

  const textNodes = collectTextNodes(document.body);
  const chunks = [];
  const nodeInfo = [];

  textNodes.forEach((node, nodeIndex) => {
    const words = node.textContent.trim().split(/\s+/);
    for (let i = 0; i < words.length; i += 6) {
      const chunk = words.slice(i, i + 6);
      chunks.push({ words: chunk, nodeIndex, offset: i });
    }
    nodeInfo.push({ node, wordCount: words.length });
  });

  const flaggedChunks = await moderateChunks(chunks);

  const blurMap = new Map();

  flaggedChunks.forEach(chunkIndex => {
    const { nodeIndex, offset } = chunks[chunkIndex];
    if (!blurMap.has(nodeIndex)) {
      blurMap.set(nodeIndex, new Set());
    }

    const indices = Array.from({ length: 6 }, (_, i) => offset + i);
    indices.forEach(i => blurMap.get(nodeIndex).add(i));
  });

  blurMap.forEach((wordIndices, nodeIndex) => {
    const { node } = nodeInfo[nodeIndex];
    blurWordsInNode(node, wordIndices);
  });

  // 2. Remove full blur after completion
  document.body.style.filter = '';
  document.body.style.pointerEvents = '';
}

// Run
moderateAndBlurChunks();

