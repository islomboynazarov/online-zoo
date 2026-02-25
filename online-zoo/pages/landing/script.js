
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


  // ================================================
//  DONATION POPUPS
// ================================================

const overlay      = document.getElementById('popup-overlay');
const popupWelcome = document.getElementById('popup-welcome');
const popupForm    = document.getElementById('popup-form');

// ── Scroll trigger ──────────────────────────────
let triggered = false;

window.addEventListener('scroll', () => {
  if (!triggered && window.scrollY > 300) {
    triggered = true;
    overlay.classList.add('active');
    popupWelcome.classList.add('active');
    popupForm.classList.remove('active');
  }
});

// ── Close buttons ───────────────────────────────
document.getElementById('close-welcome').addEventListener('click', closeAll);
document.getElementById('close-form').addEventListener('click', closeAll);

overlay.addEventListener('click', (e) => {
  if (e.target === overlay) closeAll();
});

function closeAll() {
  overlay.classList.remove('active');
  popupWelcome.classList.remove('active');
  popupForm.classList.remove('active');
}

// ── Preset amount buttons (popup 1) ────────────
function selectAmount(amount) {
  openDonationForm();
}

// ── Open donation form ──────────────────────────
function openDonationForm() {
  popupWelcome.classList.remove('active');
  popupForm.classList.add('active');
  goToStep(1);
}

// ── Amount button highlight (popup 2) ──────────
document.querySelectorAll('.form-amount-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.form-amount-btn').forEach(b => b.classList.remove('selected'));
    btn.classList.add('selected');
  });
});

// ── Step navigation ─────────────────────────────
function goToStep(stepNum) {
  document.querySelectorAll('.form-step').forEach(s => s.classList.remove('active'));
  document.getElementById(`step-${stepNum}`).classList.add('active');
}

// ── Complete donation ────────────────────────────
function completeDonation() {
  alert('Thank you for your donation!');
  closeAll();
}