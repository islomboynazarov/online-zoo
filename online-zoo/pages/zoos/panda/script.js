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
  if (index < thumbs.length - visibleSlides) {
    index++;
    track.style.transform = `translateX(-${index * slideWidth}px)`;
  }
});

prevBtn.addEventListener('click', () => {
  if (index > 0) {
    index--;
    track.style.transform = `translateX(-${index * slideWidth}px)`;
  }
});