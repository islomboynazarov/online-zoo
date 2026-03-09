declare const L: typeof import('leaflet');
import { getCameras, getPetById } from '../api/api';
import { Camera, PetDetail } from '../types/interfaces';

const SIDEBAR_ICONS: Record<number, string> = {
  1: 'sidePanel_pandaBig.png',
  2: 'sidePanel_lemurBig.png',
  3: 'sidePanel_gorillaBig.png',
  5: 'sidePanel_eagleBig.png',
};

const DEFAULT_ICON = 'sidePanel_pandaBig.png';

const PAGE_URLS: Record<number, string> = {
  1: '../panda/index.html',
  2: '../lemur/index.html',
  3: '../gorilla/index.html',
  5: '../eagle/index.html',
};

function getIcon(petId: number): string {
  return SIDEBAR_ICONS[petId] ?? DEFAULT_ICON;
}

function getCurrentPetId(): number {
  const path = window.location.pathname;
  if (path.includes('panda')) return 1;
  if (path.includes('lemur')) return 2;
  if (path.includes('gorilla')) return 3;
  if (path.includes('eagle')) return 5;
  return 1;
}

function showPandaInfoLoader(): void {
  const pandaInfo = document.querySelector('.panda-info') as HTMLElement;
  if (!pandaInfo) return;
  pandaInfo.style.opacity = '0.4';
  pandaInfo.style.pointerEvents = 'none';
}

function hidePandaInfoLoader(): void {
  const pandaInfo = document.querySelector('.panda-info') as HTMLElement;
  if (!pandaInfo) return;
  pandaInfo.style.opacity = '1';
  pandaInfo.style.pointerEvents = 'auto';
}

function updateDidYouKnow(pet: PetDetail): void {
  const fact = document.querySelector('.panda-fact p') as HTMLElement;
  const details = document.querySelector('.panda-details') as HTMLElement;
  const description = document.querySelector('.panda-description p') as HTMLElement;
  const title = document.querySelector('.live__header h1') as HTMLElement;

  if (fact) fact.textContent = pet.description;
  if (title) title.textContent = `LIVE ${pet.commonName.toUpperCase()} CAMS`;
  if (description) description.textContent = pet.description;

  if (details) {
    details.innerHTML = `
      <p><span>Common name:</span> ${pet.commonName}</p>
      <p><span>Scientific name:</span> ${pet.scientificName ?? 'N/A'}</p>
      <p><span>Type:</span> ${pet.type ?? 'N/A'}</p>
      <p><span>Size:</span> ${pet.size ?? 'N/A'}</p>
      <p><span>Diet:</span> ${pet.diet ?? 'N/A'}</p>
      <p><span>Habitat:</span> ${pet.habitat ?? 'N/A'}</p>
      <p><span>Range:</span> ${pet.range ?? 'N/A'} <a href="#" class="view-map">VIEW MAP →</a></p>
    `;
  }
}

function generateSidebar(cameras: Camera[]): void {
  const animalsContainer = document.querySelector('.live__animals') as HTMLElement;
  if (!animalsContainer) return;

  const currentPetId = getCurrentPetId();

  // Keep only first 4 cameras + arrow
  const visibleCameras = cameras.slice(0, 4);

  animalsContainer.innerHTML = '';

  visibleCameras.forEach((camera) => {
    const url = PAGE_URLS[camera.petId] ?? '../panda/index.html';
    const icon = getIcon(camera.petId);
    const isActive = camera.petId === currentPetId;

    const link = document.createElement('a');
    link.href = url;

    const box = document.createElement('div');
    box.className = `sidebar__boxes${isActive ? ' active' : ''}`;
    box.innerHTML = `
      <img src="../../../assets/icons/navigation/${icon}" alt="${camera.text}">
      <span class="animal-label">${camera.text}</span>
    `;

    box.addEventListener('click', (e) => {
    //   e.preventDefault();
      document.querySelectorAll('.sidebar__boxes').forEach(b => b.classList.remove('active'));
      box.classList.add('active');

      showPandaInfoLoader();
      getPetById(camera.petId)
        .then((pet) => {
          updateDidYouKnow(pet);
          hidePandaInfoLoader();
        })
        .catch(() => {
          hidePandaInfoLoader();
        });
    });

    link.appendChild(box);
    animalsContainer.appendChild(link);
  });

  // Arrow down
  const arrow = document.createElement('div');
  arrow.className = 'sidebar__boxes live__arrow-down';
  arrow.innerHTML = '&#8964;';
  animalsContainer.appendChild(arrow);
}

// export function initZoosPage(): void {
//   getCameras()
//     .then((cameras) => {
//       generateSidebar(cameras);

//       // Load current pet info on page load
//       const currentPetId = getCurrentPetId();
//       getPetById(currentPetId)
//         .then((pet) => updateDidYouKnow(pet))
//         .catch(() => console.error('Failed to load pet info'));
//     })
//     .catch(() => {
//       const animalsContainer = document.querySelector('.live__animals') as HTMLElement;
//       if (animalsContainer) {
//         animalsContainer.innerHTML = '<p class="error-message">Something went wrong. Please, refresh the page</p>';
//       }
//     });
// }

export function initZoosPage(): void {
  const animalsContainer = document.querySelector('.live__animals') as HTMLElement;
  const pandaInfo = document.querySelector('.panda-info') as HTMLElement;

  if (animalsContainer) {
    animalsContainer.innerHTML = '<p class="loader" style="color:white; padding:20px;">Loading...</p>';
  }
  if (pandaInfo) {
    pandaInfo.style.opacity = '0.4';
    pandaInfo.style.pointerEvents = 'none';
  }

  getCameras()
    .then((cameras) => {
      generateSidebar(cameras);

      const currentPetId = getCurrentPetId();
      getPetById(currentPetId)
        .then((pet) => {
          updateDidYouKnow(pet);
          if (pandaInfo) {
            pandaInfo.style.opacity = '1';
            pandaInfo.style.pointerEvents = 'auto';
          }
        })
        .catch(() => {
          if (pandaInfo) {
            pandaInfo.innerHTML = '<p class="error-message">Something went wrong. Please, refresh the page</p>';
            pandaInfo.style.opacity = '1';
            pandaInfo.style.pointerEvents = 'auto';
          }
        });
    })
    .catch(() => {
      if (animalsContainer) {
        animalsContainer.innerHTML = '<p class="error-message" style="color:white; padding:20px;">Something went wrong. Please, refresh the page</p>';
      }
    });
    initMapModal();
}

function initMapModal(): void {
  const overlay = document.getElementById('map-overlay') as HTMLElement;
  const closeBtn = document.getElementById('map-modal-close') as HTMLElement;
  let mapInstance: L.Map | null = null;

//   function openMap(lat: number, lng: number, title: string): void {
//     const titleEl = document.getElementById('map-modal__title') as HTMLElement;
//     if (titleEl) titleEl.textContent = `${title} — Habitat Range`;

//     overlay.classList.add('active');

//     setTimeout(() => {
//       if (mapInstance) {
//         mapInstance.remove();
//         mapInstance = null;
//       }
//       mapInstance = L.map('map-container').setView([lat, lng], 5);
//       L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
//         attribution: '© OpenStreetMap contributors'
//       }).addTo(mapInstance);
//       L.marker([lat, lng]).addTo(mapInstance).bindPopup(title).openPopup();
//     }, 100);
//   }

function openMap(lat: number, lng: number, title: string): void {
  const titleEl = document.getElementById('map-modal__title') as HTMLElement;
  if (titleEl) titleEl.textContent = `${title} — Habitat Range`;

  overlay.classList.add('active');

  setTimeout(() => {
    if (mapInstance) {
      mapInstance.remove();
      mapInstance = null;
    }

    const container = document.getElementById('map-container') as HTMLElement;
    container.style.height = '400px';

    mapInstance = L.map('map-container').setView([lat, lng], 5);
    L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
    attribution: '© OpenStreetMap © CARTO'
    }).addTo(mapInstance);
    L.marker([lat, lng]).addTo(mapInstance).bindPopup(title).openPopup();

    setTimeout(() => {
      if (mapInstance) mapInstance.invalidateSize();
    }, 200);
  }, 500);
}

  document.addEventListener('click', (e) => {
    const target = e.target as HTMLElement;
    if (target.classList.contains('view-map')) {
      e.preventDefault();
      const currentPetId = getCurrentPetId();
      getPetById(currentPetId).then((pet) => {
        const lat = pet.latitude ?? 30.0;
        const lng = pet.longitude ?? 100.0;
        openMap(lat, lng, pet.commonName);
      });
    }
  });

  closeBtn.addEventListener('click', () => {
    overlay.classList.remove('active');
    if (mapInstance) { mapInstance.remove(); mapInstance = null; }
  });

  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) {
      overlay.classList.remove('active');
      if (mapInstance) { mapInstance.remove(); mapInstance = null; }
    }
  });
}