import { getPets, postDonation } from '../api/api';
import { Pet, DonationPayload, DonationHistoryItem } from '../types/interfaces';


interface DonationState {
  amount: number;
  petId: number | null;
  petName: string;
  isRecurring: boolean;
  name: string;
  email: string;
  cardNumber: string;
  expirationDate: string;
  cvv: string;
}

const state: DonationState = {
  amount: 0,
  petId: null,
  petName: '',
  isRecurring: false,
  name: '',
  email: '',
  cardNumber: '',
  expirationDate: '',
  cvv: '',
};

function getUser(): { name: string; email: string } | null {
  const userStr = localStorage.getItem('user');
  if (!userStr) return null;
  try {
    return JSON.parse(userStr);
  } catch {
    return null;
  }
}

function goToStep(step: number): void {
  document.querySelectorAll('.form-step').forEach((s) => s.classList.remove('active'));
  const stepEl = document.getElementById(`step-${step}`) as HTMLElement;
  if (stepEl) stepEl.classList.add('active');
}

function showPopupForm(initialAmount?: number): void {
  state.amount = 0;
  state.petId = null;
  state.petName = '';
  state.name = '';
  state.email = '';
  state.cardNumber = '';
  state.expirationDate = '';
  state.cvv = '';

  const overlay = document.getElementById('popup-overlay') as HTMLElement;
  const popupWelcome = document.getElementById('popup-welcome') as HTMLElement;
  const popupForm = document.getElementById('popup-form') as HTMLElement;

  popupWelcome.classList.remove('active');
  popupForm.classList.add('active');
  overlay.style.display = 'flex';

  if (initialAmount) {
    state.amount = initialAmount;
    highlightAmount(initialAmount);
  }


  // Reset complete button state
  const completeBtn = document.querySelector('#step-3 .btn-next') as HTMLButtonElement;
  if (completeBtn) {
    completeBtn.disabled = true;
    completeBtn.style.opacity = '0.5';
    completeBtn.textContent = 'Complete Donation';
  }

  // Reset pet select
  const petSelect = document.querySelector('.special-pet-select') as HTMLSelectElement;
  if (petSelect) petSelect.value = '';

  // Reset step 1 next button
const nextBtn1 = document.querySelector('#step-1 .btn-next') as HTMLButtonElement;
if (nextBtn1) {
  nextBtn1.disabled = true;
  nextBtn1.style.opacity = '0.5';
  nextBtn1.style.cursor = 'not-allowed';
}

// Reset step 1 amount buttons
document.querySelectorAll('.form-amount-btn').forEach(btn => {
  btn.classList.remove('selected');
});

// Reset other amount input
const otherInput = document.querySelector('.other-amount-input') as HTMLInputElement;
if (otherInput) otherInput.value = '';

  goToStep(1);
}


function highlightAmount(amount: number): void {
  document.querySelectorAll('.form-amount-btn').forEach((btn) => {
    btn.classList.remove('selected');
    if (btn.textContent === `$${amount}`) {
      btn.classList.add('selected');
    }
  });
}

function showToast(message: string, type: 'success' | 'error' = 'success'): void {
  const container = document.getElementById('toast-container') as HTMLElement;
  if (!container) return;

  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.textContent = message;
  container.appendChild(toast);

  setTimeout(() => toast.classList.add('show'), 10);

  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => toast.remove(), 300);
  }, 3500);
}

function initDonationButtons(): void {
  const overlay = document.getElementById('popup-overlay') as HTMLElement;
  const popupWelcome = document.getElementById('popup-welcome') as HTMLElement;

  if (!overlay || !popupWelcome) return;

  const openPopup = (): void => {
    overlay.style.display = 'flex';
    popupWelcome.classList.add('active');
  };

  const closePopup = (): void => {
    overlay.style.display = 'none';
    popupWelcome.classList.remove('active');
  };

  ['quick-donate-btn', 'donate-now-btn', 'donate-now-btn-2', 'donate-now-btn-3'].forEach((id) => {
    const btn = document.getElementById(id);
    if (btn) btn.addEventListener('click', openPopup);
  });

  const closeWelcome = document.getElementById('close-welcome');
  if (closeWelcome) closeWelcome.addEventListener('click', closePopup);

  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) closePopup();
  });
}

function initStep1(): void {
  const otherInput = document.querySelector('.other-amount-input') as HTMLInputElement;
  const nextBtn = document.querySelector('#step-1 .btn-next') as HTMLButtonElement;

  const checkStep1Valid = (): void => {
    const valid = state.amount > 0 && state.petId !== null;
    if (nextBtn) {
      nextBtn.disabled = !valid;
      nextBtn.style.opacity = valid ? '1' : '0.5';
      nextBtn.style.cursor = valid ? 'pointer' : 'not-allowed';
    }
  };

  if (nextBtn) {
    nextBtn.disabled = true;
    nextBtn.style.opacity = '0.5';
    nextBtn.style.cursor = 'not-allowed';
  }

  document.querySelectorAll('.form-amount-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.form-amount-btn').forEach(b => b.classList.remove('selected'));
      btn.classList.add('selected');
      const val = btn.textContent?.replace('$', '') ?? '0';
      state.amount = parseInt(val);
      if (otherInput) otherInput.value = '';
      checkStep1Valid();
    });
  });

  if (otherInput) {
    otherInput.addEventListener('input', () => {
      document.querySelectorAll('.form-amount-btn').forEach(b => b.classList.remove('selected'));
      const raw = otherInput.value;
      if (/e/i.test(raw)) {
        otherInput.value = raw.replace(/[eE]/g, '');
      }
      const parsed = parseInt(otherInput.value);
      state.amount = (!isNaN(parsed) && parsed > 0) ? parsed : 0;
      checkStep1Valid();
    });
  }

  const otherAmountBtn = document.querySelector('.btn-other-amount') as HTMLButtonElement;
  if (otherAmountBtn && otherInput) {
    otherAmountBtn.addEventListener('click', () => {
      document.querySelectorAll('.form-amount-btn').forEach(b => b.classList.remove('selected'));
      state.amount = 0;
      otherInput.value = '';
      otherInput.focus();
      checkStep1Valid();
    });
  }

  const petSelect = document.querySelector('.special-pet-select') as HTMLSelectElement;
  if (petSelect) {
    const ALLOWED_PET_IDS = [1, 2, 3, 5];
    getPets().then((pets: Pet[]) => {
    petSelect.innerHTML = '<option value="">Choose your favourite</option>';
    pets
      .filter((pet) => ALLOWED_PET_IDS.includes(pet.id))
      .forEach((pet) => {
        const option = document.createElement('option');
        option.value = String(pet.id);
        option.textContent = `${pet.name} the ${pet.commonName}`;
        petSelect.appendChild(option);
      });
  }).catch(() => {});

  petSelect.addEventListener('change', () => {
    state.petId = petSelect.value ? parseInt(petSelect.value) : null;
    const selectedOption = petSelect.options[petSelect.selectedIndex];
    state.petName = selectedOption ? selectedOption.textContent ?? '' : '';
    checkStep1Valid();
  });
  }

  const recurringCheckbox = document.querySelector('.checkbox-row input') as HTMLInputElement;
  if (recurringCheckbox) {
    recurringCheckbox.addEventListener('change', () => {
      state.isRecurring = recurringCheckbox.checked;
    });
  }

  if (nextBtn) {
    nextBtn.onclick = () => {
      if (state.amount <= 0 || state.petId === null) return;
      goToStep(2);
    };
  }
}

function initStep2(): void {
  const nameInput = document.querySelector('#step-2 .form-input[type="text"]') as HTMLInputElement;
  const emailInput = document.querySelector('#step-2 .form-input[type="email"]') as HTMLInputElement;
  const nextBtn = document.querySelector('#step-2 .btn-next') as HTMLButtonElement;

  const checkStep2Valid = (): void => {
    const nameValid = /^[a-zA-Z\s]{3,}$/.test(nameInput.value.trim());
    const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailInput.value.trim());
    const valid = nameValid && emailValid;
    nextBtn.disabled = !valid;
    nextBtn.style.opacity = valid ? '1' : '0.5';
    nextBtn.style.cursor = valid ? 'pointer' : 'not-allowed';
  };

  if (nextBtn) {
    nextBtn.disabled = true;
    nextBtn.style.opacity = '0.5';
    nextBtn.style.cursor = 'not-allowed';
  }

  const user = getUser();
if (user) {
  if (nameInput) nameInput.value = user.name;
  if (emailInput) emailInput.value = user.email;
  state.name = user.name;
  state.email = user.email;
  checkStep2Valid();
}

  if (nameInput) {
    nameInput.addEventListener('input', () => {
      state.name = nameInput.value;
      checkStep2Valid();
    });
  }

  if (emailInput) {
    emailInput.addEventListener('input', () => {
      state.email = emailInput.value;
      checkStep2Valid();
    });
  }

  const backBtn = document.querySelector('#step-2 .btn-back') as HTMLButtonElement;
  if (backBtn) backBtn.onclick = () => goToStep(1);

  if (nextBtn) {
    nextBtn.onclick = () => {
    goToStep(3);
  };
}
}

function initStep3(): void {
  const cardInput = document.querySelector('#step-3 .form-input') as HTMLInputElement;
  const cvvInput = document.querySelectorAll('#step-3 .form-input')[1] as HTMLInputElement;
  const monthSelect = document.getElementById('month-select') as HTMLSelectElement;
  const yearSelect = document.getElementById('year-select') as HTMLSelectElement;
  const completeBtn = document.querySelector('#step-3 .btn-next') as HTMLButtonElement;

  if (completeBtn) {
    completeBtn.disabled = true;
    completeBtn.style.opacity = '0.5';
    completeBtn.style.cursor = 'not-allowed';
  }

  const checkStep3Valid = (): void => {
  const cardDigits = cardInput.value.replace(/\s+/g, '').trim();
  const cardValid = /^\d{16}$/.test(cardDigits);
  const cvvValid = /^\d{3}$/.test(cvvInput.value.trim());
  const monthValid = monthSelect.value !== 'Month' && monthSelect.value !== '';
  const yearValid = yearSelect.value !== 'Year' && yearSelect.value !== '';
  const valid = cardValid && cvvValid && monthValid && yearValid;
  completeBtn.disabled = !valid;
  completeBtn.style.opacity = valid ? '1' : '0.5';
  completeBtn.style.cursor = valid ? 'pointer' : 'not-allowed';
};

  if (cardInput) cardInput.addEventListener('input', () => { state.cardNumber = cardInput.value.replace(/\s+/g, ''); checkStep3Valid(); });
  if (cvvInput) cvvInput.addEventListener('input', () => { state.cvv = cvvInput.value; checkStep3Valid(); });

  const updateExpiry = (): void => {
    state.expirationDate = `${monthSelect.value}/${yearSelect.value}`;
    checkStep3Valid();
  };
  if (monthSelect) monthSelect.addEventListener('change', updateExpiry);
  if (yearSelect) yearSelect.addEventListener('change', updateExpiry);

  const backBtn = document.querySelector('#step-3 .btn-back') as HTMLButtonElement;
  if (backBtn) backBtn.onclick = () => goToStep(2);

  const saveCardRow = document.getElementById('save-card-row') as HTMLElement;
  const saveCardCheckbox = document.getElementById('save-card-checkbox') as HTMLInputElement;
  const user = getUser();
  if (saveCardRow && user) {
    saveCardRow.style.display = 'block';
  }

  const savedCardsRow = document.getElementById('saved-cards-row') as HTMLElement;
const savedCardsSelect = document.getElementById('saved-cards-select') as HTMLSelectElement;

if (savedCardsRow && savedCardsSelect && user) {
  const savedCards: { cardNumber: string; expirationDate: string; cvv: string }[] =
    JSON.parse(localStorage.getItem('savedCards') || '[]');

  if (savedCards.length > 0) {
    savedCardsRow.style.display = 'block';
    savedCards.forEach((card, index) => {
      const option = document.createElement('option');
      option.value = String(index);
      const num = card.cardNumber;
      option.textContent = `${num.slice(0, 4)} **** **** ${num.slice(-4)}`;
      savedCardsSelect.appendChild(option);
    });

    savedCardsSelect.addEventListener('change', () => {
    const idx = parseInt(savedCardsSelect.value);
    if (!isNaN(idx) && savedCards[idx]) {
      const card = savedCards[idx];
      const cleanCard = card.cardNumber.replace(/\s+/g, '');
      if (cardInput) { cardInput.value = cleanCard; state.cardNumber = cleanCard; }
      if (cvvInput) { cvvInput.value = card.cvv; state.cvv = card.cvv; }
      const parts = card.expirationDate.split('/');
      const month = parts[0]?.padStart(2, '0');
      const year  = parts[1];
      if (monthSelect && month) monthSelect.value = month;
      if (yearSelect && year)   yearSelect.value  = year;
      state.expirationDate = card.expirationDate;
      checkStep3Valid();
    }
  });
  }
}

  if (completeBtn) {
  completeBtn.onclick = () => {
  if (!state.petId) { showToast('Please select a pet to donate to.', 'error'); return; }

  // Re-read name and email from inputs
  const nameInput = document.querySelector('#step-2 .form-input[type="text"]') as HTMLInputElement;
  const emailInput = document.querySelector('#step-2 .form-input[type="email"]') as HTMLInputElement;
  if (nameInput) state.name = nameInput.value;
  if (emailInput) state.email = emailInput.value;

  const payload: DonationPayload = {
    petId: state.petId,
    amount: state.amount,
    name: state.name,
    email: state.email,
    cardNumber: state.cardNumber,
    expirationDate: state.expirationDate,
    cvv: state.cvv,
  };

    completeBtn.disabled = true;
    completeBtn.textContent = 'Processing...';

    postDonation(payload)
    .then(() => {
  // Save donation to history
  const historyItem: DonationHistoryItem = {
    petId: state.petId as number,
    petName: state.petName,
    amount: state.amount,
    date: new Date().toISOString().split('T')[0],
  };
  const history: DonationHistoryItem[] = JSON.parse(
    localStorage.getItem('donationHistory') || '[]'
  );
  history.unshift(historyItem);
  localStorage.setItem('donationHistory', JSON.stringify(history));

  if (saveCardCheckbox && saveCardCheckbox.checked) {
          const cards: { cardNumber: string; expirationDate: string; cvv: string }[] =
            JSON.parse(localStorage.getItem('savedCards') || '[]');
          cards.push({
            cardNumber: state.cardNumber,
            expirationDate: state.expirationDate,
            cvv: state.cvv,
          });
          localStorage.setItem('savedCards', JSON.stringify(cards));
        }
        const overlay = document.getElementById('popup-overlay') as HTMLElement;
        const popupForm = document.getElementById('popup-form') as HTMLElement;
        popupForm.classList.remove('active');
        overlay.style.display = 'none';
        showToast(`Thank you for your donation of $${state.amount} to ${state.petName}!`, 'success');
      })
      .catch(() => {
        showToast('Something went wrong. Please try again.', 'error');
        completeBtn.disabled = false;
        completeBtn.style.opacity = '1';
        completeBtn.textContent = 'Complete Donation';
      });
  };
}
}

export function initDonationForm(): void {
  initDonationButtons();

  document.querySelectorAll('.amount-btn').forEach((btn) => {
    if (btn.classList.contains('amount-btn--other')) {
      btn.addEventListener('click', () => showPopupForm());
    } else {
      btn.addEventListener('click', () => {
        const val = parseInt(btn.textContent?.replace('$', '') ?? '0');
        showPopupForm(val);
      });
    }
  });

  const closeForm = document.getElementById('close-form') as HTMLElement;
  if (closeForm) {
    closeForm.addEventListener('click', () => {
      const overlay = document.getElementById('popup-overlay') as HTMLElement;
      const popupForm = document.getElementById('popup-form') as HTMLElement;
      popupForm.classList.remove('active');
      overlay.style.display = 'none';
    });
  }

  initStep1();
  initStep2();
  initStep3();
}