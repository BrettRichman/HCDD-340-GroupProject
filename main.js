async function loadCarousel() {
  const response = await fetch('https://api.jikan.moe/v4/top/anime?filter=airing&limit=3');
  const data = await response.json();
  const slidesContainer = document.querySelector('.carousel-card-area');

  data.data.forEach((anime, i) => {
    const slide = document.createElement('div');
    slide.classList.add('carousel-slide');
    if (i === 0) slide.classList.add('active');

    slide.innerHTML = `
      <article class="anime-card">
        <div class="card-content">
          <img src="${anime.images.jpg.image_url}" alt="${anime.title}" class="anime-poster">
          <div class="anime-info">
            <h3 class="anime-title">${anime.title}</h3>
            <p class="anime-subtitle">${anime.title_japanese ?? ''}</p>
            <div class="stats-row">
              <span class="score-badge">${anime.score ?? 'N/A'}</span>
              <span class="episode-count">EP ? / ${anime.episodes ?? '???'}</span>
            </div>
            <div class="progress-container">
              <div class="progress-bar" style="width: 50%;"></div>
            </div>
          </div>
        </div>
      </article>
    `;

    slidesContainer.insertBefore(slide, document.querySelector('.prev'));
  });

  initCarousel();
}

function initCarousel() {
  const slides = document.querySelectorAll('.carousel-slide');
  const dotsContainer = document.querySelector('.carousel-dots');
  let current = 0;
  let timer;

  slides.forEach((_, i) => {
    const dot = document.createElement('div');
    dot.classList.add('dot');
    if (i === 0) dot.classList.add('active');
    dot.addEventListener('click', () => goTo(i));
    dotsContainer.appendChild(dot);
  });

  function goTo(index) {
    slides[current].classList.remove('active');
    document.querySelectorAll('.dot')[current].classList.remove('active');

    current = (index + slides.length) % slides.length;

    slides[current].classList.add('active');
    document.querySelectorAll('.dot')[current].classList.add('active');

    resetTimer();
  }

  function resetTimer() {
    clearInterval(timer);
    timer = setInterval(() => goTo(current + 1), 5000);
  }

  resetTimer();

  document.querySelector('.prev').addEventListener('click', () => goTo(current - 1));
  document.querySelector('.next').addEventListener('click', () => goTo(current + 1));
}

loadCarousel();