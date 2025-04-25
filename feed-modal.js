document.addEventListener('DOMContentLoaded', function () {
  const modal = document.getElementById('feed-modal');
  const modalBody = document.getElementById('feed-modal-body');
  const closeBtn = document.getElementById('feed-modal-close');

  // Dummy full content for each feed (replace with real content as needed)
  const feedContent = {
    1: `<h2>EduSheet AI – Arbeitsblattgenerator mit KI</h2><p>Mit EduSheet AI lassen sich in Sekunden individuell zugeschnittene Arbeitsblätter für jede Alters- und Niveaustufe generieren. Die KI passt Aufgaben automatisch an das Lernziel und den Schwierigkeitsgrad an. <br><br>Features:<ul><li>Automatische Differenzierung</li><li>Export als PDF</li><li>Integration in bestehende Lernplattformen</li></ul></p>`,
    2: `<h2>Explainable AI für Seniorenkurse</h2><p>Gerade in Kursen für ältere Lernende ist es wichtig, KI-Entscheidungen nachvollziehbar zu machen. Explainable AI hilft, Vertrauen zu schaffen und Ängste abzubauen. <br><br>Praxisbeispiel: <i>Interaktive Visualisierungen und einfache Erklärtexte.</i></p>`,
    3: `<h2>GoLearn Cloud Dashboard</h2><p>Das neue Dashboard-Design für GoLearn Cloud bietet eine intuitive Übersicht über alle Kurse, Fortschritte und Materialien. <br><br>Highlights:<ul><li>Modernes, responsives UI</li><li>Dark Mode</li><li>Echtzeit-Feedback</li></ul></p>`,
    4: `<h2>KI in der Schule – Wochenrückblick</h2><p>Diese Woche habe ich erlebt, wie KI-Tools den Unterricht bereichern können: Von automatischer Aufgabenerstellung bis zur individuellen Förderung. <br><br>Reflexion: <i>Worauf kommt es an? Transparenz, Didaktik und Offenheit für Neues.</i></p>`
  };

  document.querySelectorAll('.feed-card').forEach(card => {
    card.addEventListener('click', function (e) {
      e.preventDefault();
      const id = this.getAttribute('data-feed-id');
      modalBody.innerHTML = feedContent[id] || '<p>Kein Inhalt verfügbar.</p>';
      document.body.classList.add('modal-open');
      modal.style.display = 'flex';
    });
  });

  closeBtn.addEventListener('click', function () {
    modal.style.display = 'none';
    document.body.classList.remove('modal-open');
    modalBody.innerHTML = '';
  });

  window.addEventListener('click', function (event) {
    if (event.target === modal) {
      modal.style.display = 'none';
      document.body.classList.remove('modal-open');
      modalBody.innerHTML = '';
    }
  });
});
