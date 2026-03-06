import { getPets, getFeedback } from '../api/api';
import { Pet, Feedback } from '../types/interfaces';

function showLoader(container: HTMLElement): void {
  container.innerHTML = '<div class="loader">Loading...</div>';
}

function showError(container: HTMLElement): void {
  container.innerHTML = '<p class="error-message">Something went wrong. Please, refresh the page</p>';
}

// ─── PETS SLIDER ───────────────────────────────────────────
let pets: Pet[] = [];
let petIndex: number = 0;
const VISIBLE_PETS = 3;

function renderPetSlider(track: HTMLElement): void {
  track.innerHTML = '';
  for (let i = 0; i < VISIBLE_PETS; i++) {
    const pet = pets[(petIndex + i) % pets.length];
    const card = document.createElement('div');
    card.className = 'pet-card';
    card.style.cursor = 'pointer';
    card.onclick = (): void => {
      window.location.href = `../zoos/panda/index.html`;
    };
    card.innerHTML = `
      <div class="pet-card__image">
        <img src="../../assets/images/pet-sliders/slider_panda.png" alt="${pet.name}">
        <span class="pet-card__name">${pet.name}</span>
      </div>
      <div class="pet-card__content">
        <h3>${pet.commonName}</h3>
        <p>${pet.description}</p>
        <a href="#" class="pet-card__link">View Live Cam
          <svg class="slidecard_arrow" viewBox="0 0 24 24" fill="none">
            <line x1="2" y1="12" x2="19" y2="12" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"/>
            <polyline points="13,5 21,12 13,19" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </a>
      </div>
    `;
    track.appendChild(card);
  }
}

function initPetSlider(): void {
  const track = document.querySelector('.pets__track') as HTMLElement;
  if (!track) return;

  showLoader(track);

  getPets()
    .then((data) => {
      pets = data;
      renderPetSlider(track);

      const prevBtn = document.querySelector('#petsPrev') as HTMLElement;
      const nextBtn = document.querySelector('#petsNext') as HTMLElement;

      if (prevBtn) {
        prevBtn.addEventListener('click', () => {
          petIndex = (petIndex - 1 + pets.length) % pets.length;
          renderPetSlider(track);
        });
      }

      if (nextBtn) {
        nextBtn.addEventListener('click', () => {
          petIndex = (petIndex + 1) % pets.length;
          renderPetSlider(track);
        });
      }
    })
    .catch(() => showError(track));
}

// ─── FEEDBACK SLIDER ───────────────────────────────────────
let feedbacks: Feedback[] = [];
let feedbackIndex: number = 0;
const VISIBLE_FEEDBACKS = 2;

// function renderFeedbackSlider(grid: HTMLElement): void {
//   // keep the controls div, remove only testimonial-card divs
//   const existingCards = grid.querySelectorAll('.testimonial-card');
//   existingCards.forEach(card => card.remove());

//   const controls = grid.querySelector('.testimonials__controls') as HTMLElement;

//   for (let i = 0; i < VISIBLE_FEEDBACKS; i++) {
//     const feedback = feedbacks[(feedbackIndex + i) % feedbacks.length];
//     const card = document.createElement('div');
//     card.className = 'testimonial-card';
//     card.innerHTML = `
//       <p class="testimonial-card__text">${feedback.text}</p>
//       <p class="testimonial-card__location">${feedback.city}, ${feedback.month} ${feedback.year}</p>
//       <p class="testimonial-card__name">${feedback.name}</p>
//     `;
//     grid.insertBefore(card, controls);
//   }
// }

const TESTIMONIAL_IMAGES = [
  'testimonial_karen.png',
  'testimonial_carol.png',
  'testimonial_stockman.png',
  'testimonial_tomas.png',
];

function renderFeedbackSlider(grid: HTMLElement): void {
  const existingCards = grid.querySelectorAll('.testimonial-card');
  existingCards.forEach(card => card.remove());

  const controls = grid.querySelector('.testimonials__controls') as HTMLElement;

  for (let i = 0; i < VISIBLE_FEEDBACKS; i++) {
    const feedback = feedbacks[(feedbackIndex + i) % feedbacks.length];
    const imgFile = TESTIMONIAL_IMAGES[(feedbackIndex + i) % TESTIMONIAL_IMAGES.length];
    const card = document.createElement('div');
    card.className = 'testimonial-card';
    card.innerHTML = `
      <img src="../../assets/images/testimonials/${imgFile}" alt="${feedback.name}" class="testimonial-card__img">
    `;
    grid.insertBefore(card, controls);
  }
}

function initFeedbackSlider(): void {
  const grid = document.querySelector('.testimonials__grid') as HTMLElement;
  if (!grid) return;

  const existingCards = grid.querySelectorAll('.testimonial-card');
  existingCards.forEach(card => {
    (card as HTMLElement).innerHTML = '<div class="loader">Loading...</div>';
  });

  getFeedback()
    .then((data) => {
      feedbacks = data;
      renderFeedbackSlider(grid);

      const arrows = grid.querySelectorAll('.testimonial__btn__arrow');
      const prevBtn = arrows[0] as HTMLElement;
      const nextBtn = arrows[1] as HTMLElement;

      if (prevBtn) {
        prevBtn.addEventListener('click', () => {
          feedbackIndex = (feedbackIndex - 1 + feedbacks.length) % feedbacks.length;
          renderFeedbackSlider(grid);
        });
      }

      if (nextBtn) {
        nextBtn.addEventListener('click', () => {
          feedbackIndex = (feedbackIndex + 1) % feedbacks.length;
          renderFeedbackSlider(grid);
        });
      }
    })
    .catch(() => {
      const existingCards = grid.querySelectorAll('.testimonial-card');
      existingCards.forEach(card => {
        (card as HTMLElement).innerHTML = '<p class="error-message">Something went wrong. Please, refresh the page</p>';
      });
    });
}

export function initLandingPage(): void {
  initPetSlider();
  initFeedbackSlider();
}