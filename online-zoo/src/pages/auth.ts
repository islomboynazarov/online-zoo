import { login, register } from '../api/api';
import { LoginPayload, RegisterPayload } from '../types/interfaces';

// ─── VALIDATION HELPERS ────────────────────────────────────

function validateLogin(value: string): string {
  if (value.length < 3) return 'Login must be at least 3 characters long.';
  if (!/^[a-zA-Z]/.test(value)) return 'Login must start with a letter.';
  if (!/^[a-zA-Z]+$/.test(value)) return 'Login must contain only English letters.';
  return '';
}

function validatePassword(value: string): string {
  if (value.length < 6) return 'Password must be at least 6 characters long.';
  if (!/[^a-zA-Z0-9]/.test(value)) return 'Password must contain at least 1 special character.';
  return '';
}

function validateName(value: string): string {
  if (value.length < 3) return 'Name must be at least 3 characters long.';
  if (!/^[a-zA-Z\s]+$/.test(value)) return 'Name must contain only English letters.';
  return '';
}

function validateEmail(value: string): string {
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return 'Please enter a valid email address.';
  return '';
}

function showError(errorEl: HTMLElement, message: string): void {
  errorEl.textContent = message;
  const input = errorEl.previousElementSibling as HTMLInputElement;
  if (input) input.style.borderColor = 'red';
}

function clearError(errorEl: HTMLElement): void {
  errorEl.textContent = '';
  const input = errorEl.previousElementSibling as HTMLInputElement;
  if (input) input.style.borderColor = '';
}

// ─── SIGN IN ───────────────────────────────────────────────

export function initSignIn(): void {
  const loginInput = document.getElementById('signin-login') as HTMLInputElement;
  const passwordInput = document.getElementById('signin-password') as HTMLInputElement;
  const loginError = document.getElementById('signin-login-error') as HTMLElement;
  const passwordError = document.getElementById('signin-password-error') as HTMLElement;
  const formError = document.getElementById('signin-form-error') as HTMLElement;
  const signInBtn = document.getElementById('signin-btn') as HTMLButtonElement;

  if (!loginInput || !passwordInput || !signInBtn) return;

  function checkForm(): void {
    const loginValid = validateLogin(loginInput.value) === '';
    const passwordValid = validatePassword(passwordInput.value) === '';
    signInBtn.disabled = !(loginValid && passwordValid);
  }

  loginInput.addEventListener('blur', () => {
    const error = validateLogin(loginInput.value);
    if (error) showError(loginError, error);
    else clearError(loginError);
    checkForm();
  });

  loginInput.addEventListener('focus', () => clearError(loginError));

  passwordInput.addEventListener('blur', () => {
    const error = validatePassword(passwordInput.value);
    if (error) showError(passwordError, error);
    else clearError(passwordError);
    checkForm();
  });

  passwordInput.addEventListener('focus', () => clearError(passwordError));

  loginInput.addEventListener('input', checkForm);
  passwordInput.addEventListener('input', checkForm);

  signInBtn.addEventListener('click', () => {
    const payload: LoginPayload = {
      login: loginInput.value,
      password: passwordInput.value,
    };

    signInBtn.disabled = true;
    signInBtn.textContent = 'Signing in...';

    login(payload)
      .then((response) => {
        localStorage.setItem('token', response.token);
        localStorage.setItem('user', JSON.stringify(response.user));
        window.location.href = '../zoos/panda/index.html';
      })
      .catch(() => {
        formError.textContent = 'Incorrect login or password';
        signInBtn.disabled = false;
        signInBtn.textContent = 'Sign In';
      });
  });
}

// ─── REGISTRATION ──────────────────────────────────────────

export function initRegistration(): void {
  const loginInput = document.getElementById('reg-login') as HTMLInputElement;
  const nameInput = document.getElementById('reg-name') as HTMLInputElement;
  const passwordInput = document.getElementById('reg-password') as HTMLInputElement;
  const confirmInput = document.getElementById('reg-confirm') as HTMLInputElement;
  const loginError = document.getElementById('reg-login-error') as HTMLElement;
  const nameError = document.getElementById('reg-name-error') as HTMLElement;
  const passwordError = document.getElementById('reg-password-error') as HTMLElement;
  const confirmError = document.getElementById('reg-confirm-error') as HTMLElement;
  const formError = document.getElementById('reg-form-error') as HTMLElement;
  const regBtn = document.getElementById('reg-btn') as HTMLButtonElement;
  const emailInput = document.getElementById('reg-email') as HTMLInputElement;
  const emailError = document.getElementById('reg-email-error') as HTMLElement;

  if (!loginInput || !nameInput || !passwordInput || !confirmInput || !regBtn) return;

  function checkForm(): void {
  const loginValid = validateLogin(loginInput.value) === '';
  const nameValid = validateName(nameInput.value) === '';
  const emailValid = validateEmail(emailInput.value) === '';
  const passwordValid = validatePassword(passwordInput.value) === '';
  const confirmValid = passwordInput.value === confirmInput.value && confirmInput.value !== '';
  regBtn.disabled = !(loginValid && nameValid && emailValid && passwordValid && confirmValid);
}

  loginInput.addEventListener('blur', () => {
    const error = validateLogin(loginInput.value);
    if (error) showError(loginError, error);
    else clearError(loginError);
    checkForm();
  });
  loginInput.addEventListener('focus', () => clearError(loginError));

  nameInput.addEventListener('blur', () => {
    const error = validateName(nameInput.value);
    if (error) showError(nameError, error);
    else clearError(nameError);
    checkForm();
  });
  nameInput.addEventListener('focus', () => clearError(nameError));

  passwordInput.addEventListener('blur', () => {
    const error = validatePassword(passwordInput.value);
    if (error) showError(passwordError, error);
    else clearError(passwordError);
    checkForm();
  });
  passwordInput.addEventListener('focus', () => clearError(passwordError));

  confirmInput.addEventListener('blur', () => {
    if (passwordInput.value !== confirmInput.value) {
      showError(confirmError, 'Passwords do not match.');
    } else {
      clearError(confirmError);
    }
    checkForm();
  });
  confirmInput.addEventListener('focus', () => clearError(confirmError));

  loginInput.addEventListener('input', checkForm);
  nameInput.addEventListener('input', checkForm);
  passwordInput.addEventListener('input', checkForm);
  confirmInput.addEventListener('input', checkForm);

  emailInput.addEventListener('blur', () => {
  const error = validateEmail(emailInput.value);
  if (error) showError(emailError, error);
  else clearError(emailError);
  checkForm();
  });
  emailInput.addEventListener('focus', () => clearError(emailError));
  emailInput.addEventListener('input', checkForm);

  regBtn.addEventListener('click', () => {
    const payload: RegisterPayload = {
      login: loginInput.value,
      password: passwordInput.value,
      name: nameInput.value,
      email: emailInput.value,
    };

    regBtn.disabled = true;
    regBtn.textContent = 'Registering...';

    register(payload)
      .then((response) => {
        localStorage.setItem('token', response.token);
        localStorage.setItem('user', JSON.stringify(response.user));
        window.location.href = '../zoos/panda/index.html';
      })
      .catch((err: Error) => {
        formError.textContent = err.message || 'Registration failed. Please try again.';
        regBtn.disabled = false;
        regBtn.textContent = 'Register';
      });
  });
}