// main.js – Animationen für Oli AI Portfolio

// Typewriter-Effekt für Introtext
window.addEventListener('DOMContentLoaded', () => {
  const tw = document.querySelector('.typewriter');
  if (tw) {
    const text = tw.textContent;
    tw.textContent = '';
    let i = 0;
    function type() {
      if (i < text.length) {
        tw.textContent += text.charAt(i);
        i++;
        setTimeout(type, 28);
      }
    }
    type();
  }

  // Fade-in/Slide-in für Manifest & Cards
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, { threshold: 0.2 });

  document.querySelectorAll('.fade-in, .manifest-block, .feed-card').forEach(el => {
    observer.observe(el);
  });
});
