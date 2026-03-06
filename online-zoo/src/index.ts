import { initLandingPage } from './pages/landing';
import { initZoosPage } from './pages/zoos';
import { initSignIn, initRegistration } from './pages/auth';

document.addEventListener('DOMContentLoaded', () => {
  if (document.querySelector('.pets__track')) {
    initLandingPage();
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