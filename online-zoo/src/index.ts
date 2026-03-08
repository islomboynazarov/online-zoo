import { initLandingPage } from './pages/landing';
import { initZoosPage } from './pages/zoos';
import { initSignIn, initRegistration } from './pages/auth';
import { initHeader } from './components/header';
import { initDonationForm } from './pages/donation';

document.addEventListener('DOMContentLoaded', () => {
  initHeader();

  if (document.querySelector('.pets__track')) {
    initLandingPage();
    initDonationForm();
  }
  if (document.querySelector('.live__animals')) {
    initZoosPage();
  }
  if (document.getElementById('signin-btn')) {
    initSignIn();
  }
  if (document.getElementById('reg-btn')) {
    initRegistration();
  }
});