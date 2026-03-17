import { initLandingPage } from './pages/landing';
import { initZoosPage } from './pages/zoos';
import { initSignIn, initRegistration } from './pages/auth';
import { initHeader } from './components/header';
import { initDonationForm } from './pages/donation';
import { initProfilePage } from './pages/profile';

document.addEventListener('DOMContentLoaded', () => {
  initHeader();

  if (document.querySelector('.pets__track')) {
    initLandingPage();
    initDonationForm();
  }
  if (document.querySelector('.live__animals')) {
    initZoosPage();
    initDonationForm();
  }
  if (document.getElementById('signin-btn')) {
    initSignIn();
  }
  if (document.getElementById('reg-btn')) {
    initRegistration();
  }
  if (document.querySelector('.profile-page')) {
  initProfilePage();
}
});