async function loadCarousel() {
  const response = await fetch('https://api.jikan.moe/v4/top/anime?filter=bypopularity&limit=10');
  const data = await response.json();
  const slidesContainer = document.querySelector('.carousel-card-area');

  data.data.forEach((anime, i) => {
    const slide = document.createElement('div');
    slide.classList.add('carousel-slide');
    if (i === 0) slide.classList.add('active');

    slide.innerHTML = `
      <article class="anime-card">
        <div class="card-content">
          <div class="card-top">
            <img src="${anime.images.jpg.image_url}" alt="${anime.title}" class="anime-poster">
            <div class="anime-info">
              <h3 class="anime-title">${anime.title}</h3>
              <p class="anime-subtitle">${anime.title_japanese ?? ''}</p>
              <div>Rank<span class="blue-bold"> #${anime.rank ?? 'N/A'}</span></div>
              <div>Popularity<span class="blue-bold"> #${anime.popularity ?? 'N/A'}</span></div>
              <div class="stats-row">
                <span class="score-badge">${anime.score ?? 'N/A'}</span>
                <span class="episode-count">Episodes: ${anime.episodes ?? '???'}</span>
              </div>
            </div>
          </div>
          <div class="anime-synopsis">
            <p>${anime.synopsis ?? 'No synopsis available.'}</p>
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
const trendingAnimeData = [
  {
    title: "Frieren: Beyond Journey's End",
    subtitle: "Sousou no Frieren",
    score: "9.28",
    rank: "#1 Trending",
    image: "https://myanimelist.net/images/anime/1015/138006.jpg"
  },
  {
    title: "Witch Hat Atelier",
    subtitle: "Tongari Boushi no Atelier",
    score: "8.81",
    rank: "#2 Trending",
    image: "https://myanimelist.net/images/anime/1726/155542.jpg"
  },
  {
    title: "Attack on Titan",
    subtitle: "Shingeki no Kyojin",
    score: "8.54",
    rank: "#3 Trending",
    image: "https://myanimelist.net/images/anime/10/47347.jpg"
  }
];

const forumPostsData = [
  {
    id: 1,
    title: "Best anime of the season?",
    description: "Fans are debating which current show deserves the top spot this season.",
    replies: 248,
    posts: [
      {
        user: "AnimeFan21",
        time: "2 hours ago:",
        message: "For me it has to be Frieren. The pacing and emotional storytelling have been incredible every week."
      },
      {
        user: "MangaReader99",
        time: "1 hour ago:",
        message: "I agree Frieren is amazing, but I think Witch Hat Atelier is getting underrated in these discussions."
      },
      {
        user: "OtakuCentral",
        time: "35 minutes ago:",
        message: "I think it depends on whether people care more about writing, animation, or hype moments."
      }
    ]
  },
  {
    id: 2,
    title: "Most underrated fantasy anime",
    description: "Users are sharing hidden gems that deserve more recognition.",
    replies: 183,
    posts: [
      {
        user: "CloudWatcher",
        time: "3 hours ago:",
        message: "Grimgar will always be one of the most underrated fantasy anime for me."
      },
      {
        user: "NightOwl",
        time: "2 hours ago:",
        message: "The Vision of Escaflowne deserves way more love from modern anime fans."
      },
      {
        user: "RetroAnimeGuy",
        time: "50 minutes ago:",
        message: "Twelve Kingdoms is another one people barely mention anymore."
      }
    ]
  },
  {
    id: 3,
    title: "Anime openings you never skip",
    description: "A discussion about the most iconic openings and songs in anime.",
    replies: 312,
    posts: [
      {
        user: "OpeningCollector",
        time: "5 hours ago:",
        message: "I never skip Again from Fullmetal Alchemist: Brotherhood."
      },
      {
        user: "VibeCheck",
        time: "4 hours ago:",
        message: "Cruel Angel's Thesis is the definition of an opening you have to listen to every time."
      },
      {
        user: "MusicNerd",
        time: "25 minutes ago:",
        message: "The first Death Note opening still goes unbelievably hard."
      }
    ]
  },
  {
    id: 4,
    title: "What should I watch after Frieren?",
    description: "Recommendations for viewers looking for similar emotional fantasy series.",
    replies: 129,
    posts: [
      {
        user: "StorySeeker",
        time: "1 hour ago:",
        message: "You should definitely try Violet Evergarden if you want something emotional and reflective."
      },
      {
        user: "FantasyLover",
        time: "45 minutes ago:",
        message: "Mushishi has a similar calm and thoughtful feeling, even though it is a different kind of fantasy."
      },
      {
        user: "CozyWatcher",
        time: "20 minutes ago:",
        message: "Natsume's Book of Friends is another great pick if you liked the emotional atmosphere."
      }
    ]
  }
];

function renderTrendingAnime() {
  const trendingContainer = document.getElementById("trendingAnime");
  if (!trendingContainer) return;

  trendingContainer.innerHTML = "";

  trendingAnimeData.forEach((anime) => {
    const animeCard = document.createElement("article");
    animeCard.classList.add("anime-card");

    animeCard.innerHTML = `
      <div class="card-content">
        <img src="${anime.image}" alt="Poster for ${anime.title}" class="anime-poster">
        <div class="anime-info">
          <h3 class="anime-title">${anime.title}</h3>
          <p class="anime-subtitle">${anime.subtitle}</p>
          <div class="stats-row">
            <span class="score-badge">${anime.score}</span>
            <span class="episode-count">${anime.rank}</span>
          </div>
        </div>
      </div>
    `;

    trendingContainer.appendChild(animeCard);
  });
}

function renderForumPosts() {
  
  const forumContainer = document.getElementById("forumList");
  if (!forumContainer) return;

  forumContainer.innerHTML = "";

  forumPostsData.forEach((post) => {
    const forumCard = document.createElement("article");
    forumCard.classList.add("forum-card");

    forumCard.innerHTML = `
      <h3>${post.title}</h3>
      <p>${post.description}</p>
      <span class="forum-meta">${post.replies} replies</span>
    `;
    forumCard.addEventListener("click", () => openThread(post));
    forumContainer.appendChild(forumCard);
  });
}

renderTrendingAnime();
renderForumPosts();



function openThread(thread) {
  const viewer = document.getElementById("threadViewer");
  const title = document.getElementById("threadTitle");
  const description = document.getElementById("threadDescription");
  const postsContainer = document.getElementById("threadPosts");

  if (!viewer || !title || !description || !postsContainer) return;

  title.textContent = thread.title;
  description.textContent = thread.description;
  postsContainer.innerHTML = "";

  thread.posts.forEach((post) => {
    const postCard = document.createElement("div");
    postCard.classList.add("thread-post-card");

    postCard.innerHTML = `
      <div class="thread-post-top">
        <span class="thread-user">${post.user}</span>
        <span class="thread-time">${post.time}</span>
      </div>
      <p class="thread-message">${post.message}</p>
    `;

    postsContainer.appendChild(postCard);
  });

  viewer.classList.remove("hidden");
  viewer.scrollIntoView({ behavior: "smooth", block: "start" });
}