import { DonationHistoryItem } from '../types/interfaces';

// ── Animal reference data ─────────────────────────────────────

const ANIMALS: Record<number, { name: string; commonName: string; region: string; emoji: string; color: string }> = {
  1: { name: 'Lukas',      commonName: 'Giant Panda',       region: 'China',          emoji: '🐼', color: '#2dd9c8' },
  2: { name: 'Andy',       commonName: 'Ring-tailed Lemur', region: 'Madagascar',      emoji: '🐒', color: '#ffaa55' },
  3: { name: 'Glen',       commonName: 'Gorilla',           region: 'Central Africa',  emoji: '🦍', color: '#7ec87e' },
  5: { name: 'Sam & Lora', commonName: 'Bald Eagle',        region: 'USA',             emoji: '🦅', color: '#b8a0ff' },
};

// ── Sponsorship goals per animal ──────────────────────────────
const GOALS: Record<number, number> = {
  1: 200,
  2: 100,
  3: 150,
  5: 150,
};

// ── Progress bar color classes ────────────────────────────────
const PROGRESS_CLASSES: Record<number, string> = {
  1: 'progress-fill--teal',
  2: 'progress-fill--orange',
  3: 'progress-fill--green',
  5: 'progress-fill--purple',
};

function renderHeader(): void {
  const userStr = localStorage.getItem('user');
  if (!userStr) return;

  const user = JSON.parse(userStr);

  const avatar = document.getElementById('db-avatar') as HTMLElement;
  const name   = document.getElementById('db-name')   as HTMLElement;
  const email  = document.getElementById('db-email')  as HTMLElement;

  if (avatar) avatar.textContent = user.name.charAt(0).toUpperCase();
  if (name)   name.textContent   = user.name;
  if (email)  email.textContent  = user.email;
}

function renderStats(): void {
  const history: DonationHistoryItem[] = JSON.parse(
    localStorage.getItem('donationHistory') || '[]'
  );
  const favourites: number[] = JSON.parse(
    localStorage.getItem('favourites') || '[]'
  );

  const total  = history.reduce((sum, item) => sum + item.amount, 0);
  const count  = history.length;
  const favCount = favourites.length;

  const statTotal = document.getElementById('stat-total') as HTMLElement;
  const statCount = document.getElementById('stat-count') as HTMLElement;
  const statFavs  = document.getElementById('stat-favs')  as HTMLElement;

  if (statTotal) statTotal.textContent = `$${total}`;
  if (statCount) statCount.textContent = String(count);
  if (statFavs)  statFavs.textContent  = String(favCount);
}

function renderFavourites(): void {
  const favourites: number[] = JSON.parse(
    localStorage.getItem('favourites') || '[]'
  );

  const grid = document.getElementById('animals-grid') as HTMLElement;
  const badge = document.getElementById('favs-badge') as HTMLElement;

  if (!grid) return;

  if (badge) badge.textContent = `${favourites.length} of 4`;

  grid.innerHTML = '';

  Object.entries(ANIMALS).forEach(([idStr, animal]) => {
    const petId = parseInt(idStr);
    const isFav = favourites.includes(petId);

    const card = document.createElement('div');
    card.className = `animal-card${isFav ? ' fav' : ''}`;
    card.innerHTML = `
      <span class="heart-icon ${isFav ? 'filled' : 'empty'}">${isFav ? '♥' : '♡'}</span>
      <div class="animal-icon">${animal.emoji}</div>
      <div class="animal-name">${animal.commonName}</div>
      <div class="animal-region">${animal.region}</div>
    `;

    grid.appendChild(card);
  });

  if (favourites.length === 0) {
    grid.innerHTML = '<p class="empty-state">You haven\'t favourited any animals yet</p>';
  }
}

function renderDonationHistory(): void {
  const history: DonationHistoryItem[] = JSON.parse(
    localStorage.getItem('donationHistory') || '[]'
  );

  const list  = document.getElementById('donation-list')  as HTMLElement;
  const badge = document.getElementById('history-badge')  as HTMLElement;

  if (!list) return;

  if (badge) badge.textContent = `${history.length} donation${history.length !== 1 ? 's' : ''}`;

  if (history.length === 0) {
    list.innerHTML = '<p class="empty-state">You haven\'t made any donations yet</p>';
    return;
  }

  list.innerHTML = '';

  history.forEach((item, index) => {
    const animal = ANIMALS[item.petId];
    const color  = animal ? animal.color : '#ffffff';

    const date = new Date(item.date);
    const formattedDate = date.toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    });

    const row = document.createElement('div');
    row.className = 'donation-row';
    row.style.animationDelay = `${index * 0.3}s`;
    row.innerHTML = `
      <div class="donation-dot" style="background: ${color}; animation-delay: ${index * 0.5}s"></div>
      <div class="donation-info">
        <div class="donation-pet">${item.petName}</div>
        <div class="donation-date">${formattedDate}</div>
      </div>
      <div class="donation-amount" style="color: ${color}">+$${item.amount}</div>
    `;

    list.appendChild(row);
  });
}










export function initProfilePage(): void {
  const userStr = localStorage.getItem('user');
  if (!userStr) {
    window.location.href = '../signin/index.html';
    return;
  }

  renderHeader();
  renderStats();
  renderFavourites();
}

