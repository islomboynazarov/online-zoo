
  const track = document.querySelector('.pets__track');
  const cards = document.querySelectorAll('.pet-card');
  const prevBtn = document.getElementById('petsPrev');
  const nextBtn = document.getElementById('petsNext');

  let index = 0;
  const visibleCards = 4;
  const totalCards = cards.length;

  function updateSlider() {
    const cardWidth = cards[0].offsetWidth + 30; // 30 = gap
    track.style.transform = `translateX(-${index * cardWidth}px)`;
  }

  nextBtn.addEventListener('click', () => {
    if (index < totalCards - visibleCards) {
      index++;
      updateSlider();
    }
  });

  prevBtn.addEventListener('click', () => {
    if (index > 0) {
      index--;
      updateSlider();
    }
  });

  window.addEventListener('resize', updateSlider);