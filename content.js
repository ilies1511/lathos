const blurWord = (node) => {
  if (
    node.nodeType === Node.ELEMENT_NODE &&
    ['SCRIPT', 'STYLE', 'NOSCRIPT'].includes(node.tagName)
  ) {
    return;
  }

  if (node.nodeType === Node.TEXT_NODE) {
    // console.log(node.textContent);
    const regex = /\b(fuck)\b/gi;
    if (regex.test(node.textContent)) {
      const span = document.createElement('span');
      // Escape HTML to avoid innerHTML issues
      const parts = node.textContent.split(regex);
      parts.forEach((part) => {
        if (regex.test(part)) {
          const innerSpan = document.createElement('span');
          innerSpan.className = 'blur-word';
          innerSpan.textContent = part;
          span.appendChild(innerSpan);
        } else {
          span.appendChild(document.createTextNode(part));
        }
      });
      node.parentNode.replaceChild(span, node);
    }
  } else if (node.nodeType === Node.ELEMENT_NODE && node.childNodes) {
    Array.from(node.childNodes).forEach(blurWord);
  }
};


blurWord(document.body);
