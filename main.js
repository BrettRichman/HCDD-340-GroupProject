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

function moveSlide(direction) {
  goTo(current + direction);
}

function resetTimer() {
  clearInterval(timer);
  timer = setInterval(() => goTo(current + 1), 5000);
}

resetTimer();

document.querySelector('.prev').addEventListener('click', () => goTo(current - 1));
document.querySelector('.next').addEventListener('click', () => goTo(current + 1));