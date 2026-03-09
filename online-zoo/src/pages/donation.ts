import { getPets, postDonation } from '../api/api';
import { Pet, DonationPayload } from '../types/interfaces';

interface DonationState {
  amount: number;
  petId: number | null;
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
  document.querySelectorAll('.form-amount-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.form-amount-btn').forEach(b => b.classList.remove('selected'));
      btn.classList.add('selected');
      const val = btn.textContent?.replace('$', '') ?? '0';
      state.amount = parseInt(val);
      const otherInput = document.querySelector('.other-amount-input') as HTMLInputElement;
      if (otherInput) otherInput.value = '';
    });
  });

  const otherInput = document.querySelector('.other-amount-input') as HTMLInputElement;
  if (otherInput) {
    otherInput.addEventListener('input', () => {
      document.querySelectorAll('.form-amount-btn').forEach(b => b.classList.remove('selected'));
      state.amount = parseInt(otherInput.value) || 0;
    });
  }

  const petSelect = document.querySelector('.special-pet-select') as HTMLSelectElement;
  if (petSelect) {
    getPets().then((pets: Pet[]) => {
      petSelect.innerHTML = '<option value="">Choose your favourite</option>';
      pets.forEach((pet) => {
        const option = document.createElement('option');
        option.value = String(pet.id);
        option.textContent = `${pet.name} the ${pet.commonName}`;
        petSelect.appendChild(option);
      });
    }).catch(() => {});

    petSelect.addEventListener('change', () => {
      state.petId = petSelect.value ? parseInt(petSelect.value) : null;
    });
  }

  const recurringCheckbox = document.querySelector('.checkbox-row input') as HTMLInputElement;
  if (recurringCheckbox) {
    recurringCheckbox.addEventListener('change', () => {
      state.isRecurring = recurringCheckbox.checked;
    });
  }

  const nextBtn = document.querySelector('#step-1 .btn-next') as HTMLButtonElement;
  if (nextBtn) {
    nextBtn.onclick = () => {
      if (state.amount <= 0) {
        alert('Please select or enter a donation amount.');
        return;
      }
      goToStep(2);
    };
  }
}

function initStep2(): void {
  const nameInput = document.querySelector('#step-2 .form-input[type="text"]') as HTMLInputElement;
  const emailInput = document.querySelector('#step-2 .form-input[type="email"]') as HTMLInputElement;

  const user = getUser();
  if (user) {
    if (nameInput) nameInput.value = user.name;
    if (emailInput) emailInput.value = user.email;
    state.name = user.name;
    state.email = user.email;
  }

  if (nameInput) {
    nameInput.addEventListener('input', () => { state.name = nameInput.value; });
  }
  if (emailInput) {
    emailInput.addEventListener('input', () => { state.email = emailInput.value; });
  }

  const backBtn = document.querySelector('#step-2 .btn-back') as HTMLButtonElement;
  if (backBtn) backBtn.onclick = () => goToStep(1);

  const nextBtn = document.querySelector('#step-2 .btn-next') as HTMLButtonElement;
  if (nextBtn) {
    nextBtn.onclick = () => {
      if (!state.name.trim()) { alert('Please enter your name.'); return; }
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(state.email)) { alert('Please enter a valid email.'); return; }
      goToStep(3);
    };
  }
}

function initStep3(): void {
  const cardInput = document.querySelector('#step-3 .form-input') as HTMLInputElement;
  const cvvInput = document.querySelectorAll('#step-3 .form-input')[1] as HTMLInputElement;
  const monthSelect = document.querySelectorAll('#step-3 .form-select')[0] as HTMLSelectElement;
  const yearSelect = document.querySelectorAll('#step-3 .form-select')[1] as HTMLSelectElement;

  if (cardInput) cardInput.addEventListener('input', () => { state.cardNumber = cardInput.value; });
  if (cvvInput) cvvInput.addEventListener('input', () => { state.cvv = cvvInput.value; });

  const updateExpiry = (): void => {
    state.expirationDate = `${monthSelect.value}/${yearSelect.value}`;
  };
  if (monthSelect) monthSelect.addEventListener('change', updateExpiry);
  if (yearSelect) yearSelect.addEventListener('change', updateExpiry);

  const backBtn = document.querySelector('#step-3 .btn-back') as HTMLButtonElement;
  if (backBtn) backBtn.onclick = () => goToStep(2);

  const completeBtn = document.querySelector('#step-3 .btn-next') as HTMLButtonElement;
  if (completeBtn) {
    completeBtn.onclick = () => {
      if (!state.cardNumber.trim()) { alert('Please enter your card number.'); return; }
      if (!state.cvv.trim()) { alert('Please enter your CVV.'); return; }
      if (monthSelect.value === 'Month' || yearSelect.value === 'Year') {
        alert('Please select expiration date.');
        return;
      }
      if (!state.petId) { alert('Please select a pet to donate to.'); return; }

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
          const overlay = document.getElementById('popup-overlay') as HTMLElement;
          const popupForm = document.getElementById('popup-form') as HTMLElement;
          popupForm.classList.remove('active');
          overlay.style.display = 'none';
          alert('Thank you for your donation!');
        })
        .catch(() => {
          alert('Something went wrong. Please try again.');
          completeBtn.disabled = false;
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