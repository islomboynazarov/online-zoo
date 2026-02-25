// ── Pets Slider ─────────────────────────────────
const track = document.querySelector('.pets__track');
const cards = document.querySelectorAll('.pet-card');
const prevBtn = document.getElementById('petsPrev');
const nextBtn = document.getElementById('petsNext');

let index = 0;
const visibleCards = 4;
const totalCards = cards.length;

function updateSlider() {
  const cardWidth = cards[0].offsetWidth + 30;
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

// ── Popup ────────────────────────────────────────
const overlay      = document.getElementById('popup-overlay');
const popupWelcome = document.getElementById('popup-welcome');
const popupForm    = document.getElementById('popup-form');

let triggered = false;

window.addEventListener('scroll', () => {
  if (!triggered && window.scrollY > 300) {
    triggered = true;
    overlay.classList.add('active');
    popupWelcome.classList.add('active');
    popupForm.classList.remove('active');
    document.body.style.overflow = 'hidden';
    document.body.style.position = 'fixed';
    document.body.style.width = '100%';
  }
});

document.getElementById('close-welcome').addEventListener('click', closeAll);
document.getElementById('close-form').addEventListener('click', closeAll);

overlay.addEventListener('click', (e) => {
  if (e.target === overlay) closeAll();
});

function closeAll() {
  overlay.classList.remove('active');
  popupWelcome.classList.remove('active');
  popupForm.classList.remove('active');
  document.body.style.overflow = '';
  document.body.style.position = '';
  document.body.style.width = '';
}

function selectAmount(amount) {
  openDonationForm();
}

function openDonationForm() {
  popupWelcome.classList.remove('active');
  popupForm.classList.add('active');
  goToStep(1);
}

document.querySelectorAll('.form-amount-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.form-amount-btn').forEach(b => b.classList.remove('selected'));
    btn.classList.add('selected');
  });
});

function goToStep(stepNum) {
  document.querySelectorAll('.form-step').forEach(s => s.classList.remove('active'));
  document.getElementById(`step-${stepNum}`).classList.add('active');
}

function completeDonation() {
  alert('Thank you for your donation!');
  closeAll();
}