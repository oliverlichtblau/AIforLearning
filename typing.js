document.addEventListener("DOMContentLoaded", function() {
  const desc = document.querySelector('.about-desc');
  if (!desc) return;
  const html = desc.innerHTML;
  desc.innerHTML = '';
  desc.style.whiteSpace = 'pre-line';
  let i = 0;

  function typeLetter() {
    // HTML-Tag-Parsing: Wir geben immer ein valides HTML-Snippet aus
    let openTags = [];
    let out = '';
    let inTag = false;
    for (let j = 0; j < i; j++) {
      const char = html[j];
      out += char;
      if (char === '<') inTag = true;
      if (char === '>' && inTag) inTag = false;
    }
    desc.innerHTML = out;
    if (i < html.length) {
      i++;
      setTimeout(typeLetter, html[i-1] === '\n' ? 250 : 22);
    }
  }
  typeLetter();
});
