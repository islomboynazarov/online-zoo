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












export function initProfilePage(): void {
  const userStr = localStorage.getItem('user');
  if (!userStr) {
    window.location.href = '../signin/index.html';
    return;
  }

  renderHeader();
}