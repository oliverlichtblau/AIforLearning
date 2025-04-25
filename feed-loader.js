// Dieses Script lädt alle Markdown-Posts aus /feed-posts/, parst Metadaten und Inhalt und rendert die Feed-Kacheln dynamisch.
// Es nutzt marked.js (CDN muss im HTML eingebunden sein)

async function fetchFeedPosts() {
  // 1. Hole die Dateiliste via fetch auf /feed-posts/
  let files = [];
  try {
    const res = await fetch('/feed-posts/');
    const text = await res.text();
    // Extrahiere .md-Dateinamen aus Directory-Listing (funktioniert mit einfachem Server wie python -m http.server)
    files = Array.from(text.matchAll(/href="([^"]+\.md)"/g)).map(m => m[1]);
  } catch (e) {
    console.error('Feed-Posts konnten nicht geladen werden:', e);
    return [];
  }
  // 2. Hole alle Beiträge
  const posts = await Promise.all(files.map(async file => {
    try {
      const res = await fetch('/feed-posts/' + file);
      const md = await res.text();
      // Metadaten und Inhalt parsen
      const metaMatch = md.match(/^---([\s\S]*?)---/);
      let meta = {};
      let body = md;
      if (metaMatch) {
        metaMatch[1].split('\n').forEach(line => {
          const [key, ...rest] = line.split(':');
          if (key && rest.length) meta[key.trim()] = rest.join(':').trim();
        });
        body = md.substring(metaMatch[0].length).trim();
      }
      return { ...meta, body, file };
    } catch (e) {
      return null;
    }
  }));
  // Sortiere nach Datum absteigend
  return posts.filter(Boolean).sort((a, b) => (b.date || '').localeCompare(a.date || ''));
}

function createFeedCard(post, idx) {
  const teaser = post.body.split('\n')[0].replace(/[#*>`\-\[\]]/g, '').slice(0, 90) + '...';
  return `<div class="feed-card" data-feed-id="${idx}">
    <div class="feed-meta"><span class="feed-date">${post.date}</span> · <span class="feed-cat">${post.category || ''}</span></div>
    <div class="feed-content">${teaser} <span class="feed-readmore">Mehr lesen</span></div>
  </div>`;
}

let loadedPosts = [];

async function renderFeed() {
  const feedList = document.querySelector('.feed-list');
  if (!feedList) return;
  loadedPosts = await fetchFeedPosts();
  feedList.innerHTML = loadedPosts.map(createFeedCard).join('\n');
  attachFeedModalEvents();
}

function attachFeedModalEvents() {
  document.querySelectorAll('.feed-card').forEach((card, idx) => {
    card.onclick = function (e) {
      e.preventDefault();
      const modal = document.getElementById('feed-modal');
      const modalBody = document.getElementById('feed-modal-body');
      if (!modal || !modalBody) return;
      const post = loadedPosts[idx];
      modalBody.innerHTML = `<h2>${post.title}</h2>\n` + window.marked.parse(post.body);
      document.body.classList.add('modal-open');
      modal.style.display = 'flex';
    };
  });

  // Modal schließen per X-Button
  const closeBtn = document.getElementById('feed-modal-close');
  if (closeBtn) {
    closeBtn.onclick = function () {
      const modal = document.getElementById('feed-modal');
      const modalBody = document.getElementById('feed-modal-body');
      modal.style.display = 'none';
      document.body.classList.remove('modal-open');
      modalBody.innerHTML = '';
    };
  }
  // Modal schließen per Klick auf Overlay
  const modal = document.getElementById('feed-modal');
  if (modal) {
    modal.addEventListener('click', function (event) {
      if (event.target === modal) {
        modal.style.display = 'none';
        document.body.classList.remove('modal-open');
        document.getElementById('feed-modal-body').innerHTML = '';
      }
    });
  }
  // Modal schließen per Escape-Taste
  document.addEventListener('keydown', function (event) {
    if (event.key === 'Escape') {
      const modal = document.getElementById('feed-modal');
      if (modal && modal.style.display === 'flex') {
        modal.style.display = 'none';
        document.body.classList.remove('modal-open');
        document.getElementById('feed-modal-body').innerHTML = '';
      }
    }
  });
}

window.addEventListener('DOMContentLoaded', renderFeed);
