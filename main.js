const STORAGE_KEYS = {
  animeList: 'malPrototypeAnimeList',
  bio: 'malPrototypeBio'
};

const STATUS_OPTIONS = ['Watching', 'Completed', 'On-Hold', 'Dropped', 'Plan to Watch'];

const DEFAULT_PROFILE = {
  username: 'Username',
  tagline: 'Anime Enthusiast',
  bio: 'I love fantasy, action, and emotional character-driven series. Right now I am building my anime list and tracking what I finish each season.'
};

const SEEDED_LIST = [
  {
    mal_id: 52991,
    title: 'Sousou no Frieren',
    title_english: 'Frieren: Beyond Journey\'s End',
    title_japanese: '葬送のフリーレン',
    image: 'https://myanimelist.net/images/anime/1015/138006.jpg',
    episodes: 28,
    status: 'Watching',
    watchedEpisodes: 12,
    score: 9,
    updatedAt: '2026-04-18T19:30:00'
  },
  {
    mal_id: 58735,
    title: 'Tongari Boushi no Atelier',
    title_english: 'Witch Hat Atelier',
    title_japanese: 'とんがり帽子のアトリエ',
    image: 'https://myanimelist.net/images/anime/1726/155542.jpg',
    episodes: 13,
    status: 'Plan to Watch',
    watchedEpisodes: 0,
    score: 0,
    updatedAt: '2026-04-17T17:10:00'
  },
  {
    mal_id: 16498,
    title: 'Shingeki no Kyojin',
    title_english: 'Attack on Titan',
    title_japanese: '進撃の巨人',
    image: 'https://myanimelist.net/images/anime/10/47347.jpg',
    episodes: 25,
    status: 'Completed',
    watchedEpisodes: 25,
    score: 10,
    updatedAt: '2026-04-15T13:05:00'
  },
  {
    mal_id: 21,
    title: 'One Piece',
    title_english: 'One Piece',
    title_japanese: 'ワンピース',
    image: 'https://myanimelist.net/images/anime/1244/138851.jpg',
    episodes: 1158,
    status: 'On-Hold',
    watchedEpisodes: 250,
    score: 8,
    updatedAt: '2026-04-14T11:20:00'
  },
  {
    mal_id: 35849,
    title: 'Dr. Stone',
    title_english: 'Dr. Stone',
    title_japanese: 'ドクターストーン',
    image: 'https://myanimelist.net/images/anime/1773/155779.jpg',
    episodes: 13,
    status: 'Dropped',
    watchedEpisodes: 3,
    score: 6,
    updatedAt: '2026-04-12T20:40:00'
  }
];

function getStoredList() {
  const raw = localStorage.getItem(STORAGE_KEYS.animeList);

  if (!raw) {
    localStorage.setItem(STORAGE_KEYS.animeList, JSON.stringify(SEEDED_LIST));
    return [...SEEDED_LIST];
  }

  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [...SEEDED_LIST];
  } catch {
    localStorage.setItem(STORAGE_KEYS.animeList, JSON.stringify(SEEDED_LIST));
    return [...SEEDED_LIST];
  }
}

function saveStoredList(list) {
  localStorage.setItem(STORAGE_KEYS.animeList, JSON.stringify(list));
}

function getStoredBio() {
  return localStorage.getItem(STORAGE_KEYS.bio) || DEFAULT_PROFILE.bio;
}

function saveBio(value) {
  localStorage.setItem(STORAGE_KEYS.bio, value.trim());
}

function formatDate(dateString) {
  return new Date(dateString).toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric'
  });
}

function relativeStatusClass(status) {
  return status.toLowerCase().replace(/\s+/g, '-');
}

function computeStats(list) {
  const counts = {
    'Watching': 0,
    'Completed': 0,
    'On-Hold': 0,
    'Dropped': 0,
    'Plan to Watch': 0
  };

  let episodesWatched = 0;
  let totalScore = 0;
  let scoredCount = 0;

  list.forEach(entry => {
    if (counts[entry.status] !== undefined) {
      counts[entry.status] += 1;
    }

    episodesWatched += Number(entry.watchedEpisodes || 0);

    if (Number(entry.score) > 0) {
      totalScore += Number(entry.score);
      scoredCount += 1;
    }
  });

  return {
    counts,
    totalEntries: list.length,
    episodesWatched,
    meanScore: scoredCount ? (totalScore / scoredCount).toFixed(1) : '0.0'
  };
}

function upsertAnimeEntry(entry) {
  const list = getStoredList();
  const existingIndex = list.findIndex(item => item.mal_id === entry.mal_id);

  if (existingIndex >= 0) {
    list[existingIndex] = { ...list[existingIndex], ...entry, updatedAt: new Date().toISOString() };
  } else {
    list.push({
      ...entry,
      status: entry.status || 'Plan to Watch',
      watchedEpisodes: Number(entry.watchedEpisodes || 0),
      score: Number(entry.score || 0),
      updatedAt: new Date().toISOString()
    });
  }

  saveStoredList(list);
}

function bindQuickAddButtons() {
  document.querySelectorAll('.quick-add-btn').forEach(button => {
    button.addEventListener('click', () => {
      const entry = {
        mal_id: Number(button.dataset.malId),
        title: button.dataset.title,
        image: button.dataset.image,
        episodes: Number(button.dataset.episodes || 0),
        status: 'Plan to Watch',
        watchedEpisodes: 0,
        score: 0
      };

      upsertAnimeEntry(entry);
      button.textContent = 'Added';
      button.disabled = true;

      const continueWatching = document.getElementById('continue-watching');
      if (continueWatching) renderContinueWatching();
    });
  });
}

function renderContinueWatching() {
  const container = document.getElementById('continue-watching');
  if (!container) return;

  const list = getStoredList()
    .filter(item => item.status === 'Watching' || item.status === 'On-Hold' || item.status === 'Plan to Watch')
    .slice(0, 3);

  container.innerHTML = list.length
    ? list.map(item => {
        const totalEpisodes = Number(item.episodes || 0);
        const watched = Number(item.watchedEpisodes || 0);
        const percent = totalEpisodes > 0 ? Math.min(100, (watched / totalEpisodes) * 100) : 0;

        return `
          <article class="anime-card">
            <div class="card-content">
              <img src="${item.image}" alt="${item.title}" class="anime-poster">
              <div class="anime-info">
                <h3 class="anime-title">${item.title_english ?? item.title}</h3>
                <p class="anime-subtitle">${item.title_japanese}</p>
                <div class="stats-row">
                  <span class="status-pill ${relativeStatusClass(item.status)}">${item.status}</span>
                  <span class="episode-count">${watched}/${totalEpisodes || '?'}</span>
                </div>
                <div class="progress-container">
                  <div class="progress-bar" style="width:${percent}%"></div>
                </div>
              </div>
            </div>
          </article>
        `;
      }).join('')
    : `<div class="empty-state">No saved anime yet. Add titles from Home, Community, or Browse.</div>`;
}

function renderProfilePage() {
  const statsList = document.getElementById('anime-stats-list');
  if (!statsList) return;

  const list = getStoredList();
  const stats = computeStats(list);
  const bioInput = document.getElementById('bio-input');
  const recentUpdates = document.getElementById('recent-updates');

  document.getElementById('profile-name').textContent = DEFAULT_PROFILE.username;
  document.getElementById('profile-tagline').textContent = DEFAULT_PROFILE.tagline;
  bioInput.value = getStoredBio();

  const statuses = [
    { label: 'Watching', count: stats.counts['Watching'] || 0 },
    { label: 'Completed', count: stats.counts['Completed'] || 0 },
    { label: 'On-Hold', count: stats.counts['On-Hold'] || 0 },
    { label: 'Dropped', count: stats.counts['Dropped'] || 0 },
    { label: 'Plan to Watch', count: stats.counts['Plan to Watch'] || 0 }
  ];

  statsList.innerHTML = statuses.map(item => {
    const width = stats.totalEntries ? Math.max(item.count ? 8 : 0, (item.count / stats.totalEntries) * 100) : 0;

    return `
      <div class="stat-row">
        <span>${item.label}</span>
        <div class="bar">
          <div class="stat-fill ${relativeStatusClass(item.label)}" style="width:${width}%"></div>
        </div>
        <strong>${item.count}</strong>
      </div>
    `;
  }).join('');

  document.getElementById('total-entries').textContent = stats.totalEntries;
  document.getElementById('episodes-watched').textContent = stats.episodesWatched.toLocaleString();
  document.getElementById('completed-total').textContent = stats.counts.Completed || 0;
  document.getElementById('average-score').textContent = stats.meanScore;
  document.getElementById('quick-total-entries').textContent = stats.totalEntries;
  document.getElementById('quick-total-episodes').textContent = stats.episodesWatched.toLocaleString();
  document.getElementById('quick-mean-score').textContent = stats.meanScore;

  const latest = [...list]
    .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
    .slice(0, 5);

  recentUpdates.innerHTML = latest.length
    ? latest.map(item => `
        <div class="update-row">
          <img src="${item.image}" alt="${item.title_english ?? item.title}" class="update-poster">
          <div class="update-copy">
            <h3>${item.title_english ?? item.title}</h3>
            <p>${item.status} · ${item.watchedEpisodes}/${item.episodes || '?'} episodes · Score ${item.score || '-'}</p>
          </div>
          <span class="update-meta">${formatDate(item.updatedAt)}</span>
        </div>
      `).join('')
    : '<div class="empty-state">No recent anime updates yet.</div>';

  document.getElementById('save-bio-btn').addEventListener('click', () => {
    saveBio(bioInput.value);
  });
}

function createCarouselSlide(anime, active = false) {
  const slide = document.createElement('div');
  slide.className = `carousel-slide${active ? ' active' : ''}`;

  const synopsis = anime.synopsis
    ? anime.synopsis.replace(/\s+/g, ' ').trim()
    : 'No synopsis available.';

  slide.innerHTML = `
    <article class="anime-card hero-card">
      <div class="hero-card-grid">
        <img src="${anime.images.jpg.image_url}" alt="${anime.title}" class="hero-poster">

        <div class="hero-copy">
          <span class="rank-pill">#${anime.popularity ?? 'N/A'} Popular</span>
          <h3 class="hero-title">${anime.title_english ?? anime.title}</h3>
          <p class="anime-subtitle">${anime.title_japanese ?? ''}</p>

          <div class="stats-row">
            <span class="score-badge">${anime.score ?? 'N/A'}</span>
            <span class="episode-count">Episodes: ${anime.episodes ?? '?'}</span>
            <span class="episode-count">Members: ${(anime.members || 0).toLocaleString()}</span>
          </div>

          <p class="hero-synopsis">${synopsis}</p>

          <div class="hero-actions">
            <button
              class="list-save-btn hero-add-btn"
              data-mal-id="${anime.mal_id}"
              data-title="${anime.title_english ?? anime.title}".replace(/"/g, '&quot;')}"
              data-image="${anime.images.jpg.image_url}"
              data-episodes="${anime.episodes || 0}"
              type="button">
              Add to List
            </button>
            <a class="secondary-btn browse-link-btn" href="browse.html">Open Browse</a>
          </div>
        </div>
      </div>
    </article>
  `;

  return slide;
}

async function loadCarousel() {
  const slidesContainer = document.querySelector('.carousel-card-area');
  const dotsContainer = document.querySelector('.carousel-dots');
  if (!slidesContainer || !dotsContainer) return;

  slidesContainer.querySelectorAll('.carousel-slide').forEach(slide => slide.remove());
  dotsContainer.innerHTML = '';

  try {
    const response = await fetch('https://api.jikan.moe/v4/top/anime?filter=bypopularity&limit=8');
    if (!response.ok) throw new Error(`HTTP ${response.status}`);

    const data = await response.json();
    const animeList = Array.isArray(data.data) ? data.data : [];

    animeList.forEach((anime, index) => {
      const slide = createCarouselSlide(anime, index === 0);
      const prevButton = slidesContainer.querySelector('.prev');
      slidesContainer.insertBefore(slide, prevButton);
    });

    initCarousel();
    bindHeroAddButtons();
  } catch (error) {
    console.error('Carousel data failed to load:', error);

    const fallback = document.createElement('div');
    fallback.className = 'carousel-slide active';
    fallback.innerHTML = `
      <article class="anime-card hero-card">
        <div class="hero-card-grid">
          <div class="hero-copy">
            <span class="rank-pill">Offline</span>
            <h3 class="hero-title">Top anime unavailable right now</h3>
            <p class="hero-synopsis">Reconnect to load live recommendations. Your saved list and profile still work locally in the prototype.</p>
            <div class="hero-actions">
              <a class="secondary-btn browse-link-btn" href="browse.html">Open Browse</a>
            </div>
          </div>
        </div>
      </article>
    `;
    const prevButton = slidesContainer.querySelector('.prev');
    slidesContainer.insertBefore(fallback, prevButton);
    initCarousel();
  }
}

function initCarousel() {
  const slides = document.querySelectorAll('.carousel-slide');
  const dotsContainer = document.querySelector('.carousel-dots');
  if (!slides.length || !dotsContainer) return;

  let current = 0;
  let timer;

  dotsContainer.innerHTML = '';

  slides.forEach((_, index) => {
    const dot = document.createElement('button');
    dot.type = 'button';
    dot.className = `dot${index === 0 ? ' active' : ''}`;
    dot.setAttribute('aria-label', `Go to slide ${index + 1}`);
    dot.addEventListener('click', () => goTo(index));
    dotsContainer.appendChild(dot);
  });

  function goTo(index) {
    slides[current]?.classList.remove('active');
    dotsContainer.children[current]?.classList.remove('active');

    current = (index + slides.length) % slides.length;

    slides[current]?.classList.add('active');
    dotsContainer.children[current]?.classList.add('active');
    resetTimer();
  }

  function resetTimer() {
    clearInterval(timer);
    if (slides.length > 1) {
      timer = setInterval(() => goTo(current + 1), 5000);
    }
  }

  document.querySelector('.prev')?.addEventListener('click', () => goTo(current - 1));
  document.querySelector('.next')?.addEventListener('click', () => goTo(current + 1));

  resetTimer();
}

function bindHeroAddButtons() {
  document.querySelectorAll('.hero-add-btn').forEach(button => {
    button.addEventListener('click', () => {
      const entry = {
        mal_id: Number(button.dataset.malId),
        title: button.dataset.title,
        image: button.dataset.image,
        episodes: Number(button.dataset.episodes || 0),
        status: 'Plan to Watch',
        watchedEpisodes: 0,
        score: 0
      };

      upsertAnimeEntry(entry);
      button.textContent = 'Added';
      button.disabled = true;
      renderContinueWatching();
    });
  });
}

function getEntryMap() {
  return new Map(getStoredList().map(item => [item.mal_id, item]));
}

async function renderBrowsePage() {
  const browseGrid = document.getElementById('browse-grid');
  if (!browseGrid) return;

  let animeData = [];
  const searchInput = document.getElementById('browse-search');
  const statusWrap = document.getElementById('status-filter-wrap');
  const genreWrap = document.getElementById('genre-filter-wrap');

  if (!searchInput || !statusWrap || !genreWrap) return;

  try {
    const response = await fetch('https://api.jikan.moe/v4/top/anime?filter=bypopularity&limit=20');
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const data = await response.json();
    animeData = Array.isArray(data.data) ? data.data : [];
  } catch (error) {
    console.error('Browse API failed:', error);
    browseGrid.innerHTML = `<div class="empty-state">Could not load anime from the API right now.</div>`;
    return;
  }

  [statusWrap, genreWrap].forEach(wrap => {
    const btn = wrap.querySelector('.multi-filter-btn');
    const dropdown = wrap.querySelector('.multi-filter-dropdown');
    btn.addEventListener('click', e => {
      e.stopPropagation();
      dropdown.classList.toggle('open');
    });
  });

  document.addEventListener('click', e => {
    [statusWrap, genreWrap].forEach(wrap => {
      if (!wrap.contains(e.target)) {
        wrap.querySelector('.multi-filter-dropdown').classList.remove('open');
      }
    });
  });

  function getChecked(wrap) {
    return [...wrap.querySelectorAll('input[type=checkbox]:checked')].map(cb => ({
      value: cb.value,
      label: cb.closest('label').textContent.trim()
    }));
  }

  function updateBtnLabel(wrap, defaultLabel) {
    const checked = getChecked(wrap);
    const label = checked.length ? checked.map(c => c.label).join(', ') : defaultLabel;
    wrap.querySelector('.multi-filter-btn').innerHTML =
      `<span>${label}</span><span>▾</span>`;
  }

  statusWrap.querySelectorAll('input').forEach(cb => cb.addEventListener('change', () => {
    updateBtnLabel(statusWrap, 'All Statuses');
    drawCards();
  }));

  genreWrap.querySelectorAll('input').forEach(cb => cb.addEventListener('change', () => {
    updateBtnLabel(genreWrap, 'All Genres');
    drawCards();
  }));

  searchInput.addEventListener('input', drawCards);

  function drawCards() {
    const query = searchInput.value.trim().toLowerCase();
    const selectedStatuses = getChecked(statusWrap).map(c => c.value);
    const selectedGenres = getChecked(genreWrap).map(c => c.value);
    const entryMap = getEntryMap();

    const filtered = animeData.filter(anime => {
      const entry = entryMap.get(anime.mal_id);

      const titleMatch =
        anime.title.toLowerCase().includes(query) ||
        (anime.title_japanese || '').toLowerCase().includes(query) ||
        (anime.title_english || '').toLowerCase().includes(query);

      const statusMatch = selectedStatuses.length === 0 ||
        selectedStatuses.includes(entry?.status ?? '');

      const genreMatch = selectedGenres.length === 0 ||
        selectedGenres.some(id => (anime.genres || []).some(g => String(g.mal_id) === id));

      return titleMatch && statusMatch && genreMatch;
    });

    const displayed = filtered.slice(0, 20);

    browseGrid.innerHTML = displayed.length
      ? displayed.map(anime => {
          const existing = entryMap.get(anime.mal_id);

          return `
            <article class="browse-card">
              <div class="browse-card-top">
                <img class="browse-poster" src="${anime.images.jpg.image_url}" alt="${anime.title}">
                <div class="browse-copy">
                  <div class="browse-title-row">
                    <div>
                      <h3>${anime.title_english ?? anime.title}</h3>
                      <p class="browse-meta">${anime.title_japanese ?? ''}</p>
                    </div>
                    <span class="rank-pill">#${anime.popularity ?? 'N/A'}</span>
                  </div>

                  <div class="browse-metrics">
                    <span class="score-badge">${anime.score ?? 'N/A'}</span>
                    <span class="episode-count">${anime.episodes ?? '?'} episodes</span>
                    <span class="episode-count">${anime.year ?? 'Unknown year'}</span>
                  </div>

                  <p class="browse-description">${anime.synopsis ? anime.synopsis.slice(0, 180) + '…' : 'No synopsis available.'}</p>
                </div>
              </div>

              <div class="browse-form-grid" data-anime-id="${anime.mal_id}">
                <label>
                  Status
                  <select class="anime-status">
                    ${STATUS_OPTIONS.map(status => `
                      <option value="${status}" ${existing?.status === status ? 'selected' : ''}>${status}</option>
                    `).join('')}
                  </select>
                </label>

                <label>
                  Episodes Seen
                  <input
                    class="anime-progress"
                    type="number"
                    min="0"
                    max="${anime.episodes || 9999}"
                    value="${existing?.watchedEpisodes ?? 0}">
                </label>

                <label>
                  Score
                  <select class="anime-score">
                    ${Array.from({ length: 11 }, (_, i) => `
                      <option value="${i}" ${Number(existing?.score ?? 0) === i ? 'selected' : ''}>
                        ${i === 0 ? 'No score' : i}
                      </option>
                    `).join('')}
                  </select>
                </label>

                <button class="list-save-btn browse-save-btn" type="button">Save Entry</button>
              </div>
            </article>
          `;
        }).join('')
      : `<div class="empty-state">No anime matched your search or filter.</div>`;

    document.querySelectorAll('.browse-save-btn').forEach(button => {
      button.addEventListener('click', event => {
        const parent = event.currentTarget.closest('.browse-form-grid');
        const animeId = Number(parent.dataset.animeId);
        const anime = animeData.find(item => item.mal_id === animeId);
        if (!anime) return;

        const status = parent.querySelector('.anime-status').value;
        const score = Number(parent.querySelector('.anime-score').value);
        let watchedEpisodes = Number(parent.querySelector('.anime-progress').value);
        const maxEpisodes = anime.episodes || 9999;
        watchedEpisodes = Math.max(0, Math.min(watchedEpisodes, maxEpisodes));

        upsertAnimeEntry({
          mal_id: anime.mal_id,
          title: anime.title,
          title_english: anime.title_english ?? '',
          title_japanese: anime.title_japanese ?? '',
          image: anime.images.jpg.image_url,
          episodes: anime.episodes || 0,
          status,
          watchedEpisodes,
          score
        });

        button.textContent = 'Saved';
        setTimeout(() => { button.textContent = 'Save Entry'; }, 1000);
      });
    });
  }

  drawCards();
}

function registerServiceWorkerInline() {
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', async () => {
      try {
        await navigator.serviceWorker.register('./service-worker.js');
      } catch (error) {
        console.error('Service worker registration failed:', error);
      }
    });
  }
}

window.addEventListener('DOMContentLoaded', () => {
  loadCarousel();
  renderProfilePage();
  renderBrowsePage();
  renderContinueWatching();
  bindQuickAddButtons();
  registerServiceWorkerInline();
});

const toggleBtn = document.getElementById('theme-toggle');

function setTheme(theme) {
  document.body.classList.remove('light', 'dark');
  document.body.classList.add(theme);
  localStorage.setItem('theme', theme);
}

toggleBtn?.addEventListener('click', () => {
  const isDark = document.body.classList.contains('dark');
  setTheme(isDark ? 'light' : 'dark');
});

// Initialize theme
(function initTheme() {
  const saved = localStorage.getItem('theme');

  if (saved) {
    setTheme(saved);
  } else if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
    setTheme('dark');
  } else {
    setTheme('light');
  }
})();