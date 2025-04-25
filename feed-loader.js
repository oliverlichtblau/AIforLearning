// Dieses Script lädt jetzt feed-posts.json statt Directory-Listing
// Es nutzt marked.js (CDN muss im HTML eingebunden sein)

async function fetchFeedPosts() {
  try {
    const res = await fetch('feed-posts.json');
    if (!res.ok) throw new Error('feed-posts.json konnte nicht geladen werden');
    return await res.json();
  } catch (e) {
    console.error('Feed-Posts konnten nicht geladen werden:', e);
    return [];
  }
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
