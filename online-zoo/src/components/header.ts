import { User } from '../types/interfaces';

// function getProfilePath(): string {
//   const path = window.location.pathname;
//   if (path.includes('/zoos/')) {
//     return '../../profile/index.html';
//   }
//   return '../profile/index.html';
// }

function getProfilePath(): string {
  const path = window.location.pathname;
  if (path.includes('/zoos/')) return '../../profile/index.html';
  if (path.includes('/map/') || path.includes('/contact/')) return '../pages/profile/index.html';
  return '../profile/index.html';
}

function getUser(): User | null {
  const userStr = localStorage.getItem('user');
  if (!userStr) return null;
  try {
    return JSON.parse(userStr) as User;
  } catch {
    return null;
  }
}

function createUserIcon(): void {
  const headerContainer = document.querySelector('.header__container') as HTMLElement;
  if (!headerContainer) return;

  const user = getUser();
  const burger = document.querySelector('.header__burger') as HTMLElement;

  const userWrapper = document.createElement('div');
  userWrapper.className = 'header__user';

  if (user) {
    userWrapper.innerHTML = `
      <div class="header__user-icon" id="user-icon">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="12" cy="8" r="4"/>
          <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/>
        </svg>
        <span class="header__user-name">${user.name}</span>
      </div>
      <div class="header__user-popup" id="user-popup">
        <p class="user-popup__name">${user.name}</p>
        <p class="user-popup__email">${user.email}</p>
        <hr>
        <a href="${getProfilePath()}" class="user-popup__link">My Profile</a>
        <hr>
        <button class="user-popup__signout" id="signout-btn">Sign Out</button>
      </div>
    `;
  } else {
    const authPath = window.location.pathname.includes('/zoos/') ? '../../' : '../';

    userWrapper.innerHTML = `
      <div class="header__user-icon" id="user-icon">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="12" cy="8" r="4"/>
          <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/>
        </svg>
      </div>
      <div class="header__user-popup" id="user-popup">
        <a href="${authPath}signin/index.html" class="user-popup__link">Sign In</a>
        <a href="${authPath}registration/index.html" class="user-popup__link">Registration</a>
      </div>
    `;
  }

  if (burger) {
    headerContainer.insertBefore(userWrapper, burger);
  } else {
    headerContainer.appendChild(userWrapper);
  }

  const userIcon = document.getElementById('user-icon') as HTMLElement;
  const userPopup = document.getElementById('user-popup') as HTMLElement;

  userIcon.addEventListener('click', (e) => {
    e.stopPropagation();
    userPopup.classList.toggle('active');
  });

  document.addEventListener('click', () => {
    userPopup.classList.remove('active');
  });

  const signOutBtn = document.getElementById('signout-btn');
  if (signOutBtn) {
    signOutBtn.addEventListener('click', () => {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.reload();
    });
  }
}

export function initHeader(): void {
  createUserIcon();
}