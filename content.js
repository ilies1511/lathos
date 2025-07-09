async function moderateText(text) {
  try {
    const response = await fetch('http://127.0.0.1:5000/moderate/text', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text })
    });
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    const data = await response.json();
    // Assuming data.hasIssue or similar boolean property indicates whether to blur
    return data || false;
  } catch (error) {
    console.error('Error moderating text:', error);
    return false;
  }
}

async function checkTextElement(element) {
  const text = element.innerText || '';
  return await moderateText(text);
}


async function checkImageElement(element) {
  try {
    const imageUrl = element.src || element.getAttribute('src');
    const alttext = element.alt || '';
    if (alttext && alttext.length > 0) {
      // console.log('Image alt text:', alttext);
      if (moderateText(alttext)) {
        // console.log('Image alt text flagged:', alttext);
        return true;
      }
    }
    
    if (imageUrl.contains('.svg')) {
      return false; // Skip SVG images  
    }
    // console.log('Checking image URL:', imageUrl);
    if (imageUrl.startsWith('data:image/png;base64')) {
      return false; // Skip data URLs
    }
    const response = await fetch('http://127.0.0.1:5000/moderate/image', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ image_url: imageUrl })
    });
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    const data = await response.json();
    console.log('Moderation response:', data);
    return data || false;
  } catch (error) {
    console.error('Error moderating image:', error);
    return false;
  }
}

async function blurIncorrectParts(root) {
  const blockTags = ['P', 'DIV', 'LI', 'SECTION', 'ARTICLE', 'H1', 'H2', 'H3', 'H4', 'H5', 'H6'];
  const allElements = root.querySelectorAll('*');

  let checkedCount = 0;
  for (let i = 0; i < allElements.length && checkedCount < 40; i++) {
    const el = allElements[i];
    let shouldBlur = false;

    if (el.tagName === 'IMG') {
      shouldBlur = await checkImageElement(el);
      // console.log(`Element: ${el.tagName}, shouldBlur: ${shouldBlur}`);
      // if (true) {
      //   el.classList.add('blur-content');
      // }
      checkedCount++;
    }
    // } else if (blockTags.includes(el.tagName)) {
    //   shouldBlur = await checkTextElement(el);
    //   checkedCount++;
    // }

    if (shouldBlur) {
      el.classList.add('blur-content');
    }
  }
}

// Call it
blurIncorrectParts(document.body);
