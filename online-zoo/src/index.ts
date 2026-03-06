import { initLandingPage } from './pages/landing';
import { initZoosPage } from './pages/zoos';

document.addEventListener('DOMContentLoaded', () => {
  if (document.querySelector('.pets__track')) {
    initLandingPage();
  }
  if (document.querySelector('.live__animals')) {
    initZoosPage();
  }
});