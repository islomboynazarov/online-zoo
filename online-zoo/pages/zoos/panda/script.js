const sidebar = document.querySelector('.live__sidebar');
const toggleBtn = document.querySelector('.live__collapse');

toggleBtn.addEventListener('click', () => {
  sidebar.classList.toggle('open');
});

// for slider part

const track = document.querySelector('.slider__track');
const prevBtn = document.querySelector('.prev');
const nextBtn = document.querySelector('.next');

const thumbs = document.querySelectorAll('.thumb');

let index = 0;
const visibleSlides = 3; // how many thumbnails visible
const slideWidth = 130;  // thumb width + margin

nextBtn.addEventListener('click', () => {
  const thumbWidth = thumbs[0].offsetWidth + 20; // 20 is margin-right
  if (index < thumbs.length - visibleSlides) {
    index++;
    track.style.transform = `translateX(-${index * thumbWidth}px)`;
  }
});

prevBtn.addEventListener('click', () => {
  const thumbWidth = thumbs[0].offsetWidth + 20;
  if (index > 0) {
    index--;
    track.style.transform = `translateX(-${index * thumbWidth}px)`;
  }
});

const viewport = document.querySelector('.slider__viewport');

let isDown = false;
let startX;
let scrollLeft;

viewport.addEventListener('mousedown', (e) => {
  isDown = true;
  viewport.style.cursor = 'grabbing';
  startX = e.pageX - viewport.offsetLeft;
  scrollLeft = viewport.scrollLeft;
});

viewport.addEventListener('mouseleave', () => {
  isDown = false;
  viewport.style.cursor = 'grab';
});

viewport.addEventListener('mouseup', () => {
  isDown = false;
  viewport.style.cursor = 'grab';
});

viewport.addEventListener('mousemove', (e) => {
  if (!isDown) return;
  e.preventDefault();
  const x = e.pageX - viewport.offsetLeft;
  const walk = (x - startX) * 2;
  viewport.scrollLeft = scrollLeft - walk;
});

