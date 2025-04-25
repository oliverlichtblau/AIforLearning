document.addEventListener("DOMContentLoaded", function() {
  const desc = document.querySelector('.about-desc');
  if (!desc) return;
  const text = desc.textContent;
  desc.textContent = '';
  desc.style.whiteSpace = 'pre-line';
  let i = 0;
  function typeLetter() {
    if (i <= text.length) {
      desc.textContent = text.slice(0, i);
      i++;
      setTimeout(typeLetter, text[i-1] === '\n' ? 250 : 22);
    }
  }
  typeLetter();
});
