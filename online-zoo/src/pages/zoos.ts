declare const L: typeof import('leaflet');
import { getCameras, getPetById } from '../api/api';
import { Camera, PetDetail } from '../types/interfaces';

const FALLBACK_COORDS: Record<number, [number, number]> = {
  1: [30.6, 104.0],   // Panda - China
  2: [-18.9, 47.5],   // Lemur - Madagascar
  3: [0.3, 25.0],     // Gorilla - Central Africa
  5: [44.5, -100.0],  // Eagle - USA
};

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
  pandaInfo.style.position = 'relative';

  const existing = document.getElementById('panda-info-loader');
  if (existing) existing.remove();

  const loaderOverlay = document.createElement('div');
  loaderOverlay.id = 'panda-info-loader';
  loaderOverlay.style.cssText = `
    position: absolute;
    inset: 0;
    background: rgba(255,255,255,0.75);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 100;
  `;
  loaderOverlay.innerHTML = `
    <div style="
      width: 48px; height: 48px;
      border: 5px solid #ccc;
      border-top-color: #00A092;
      border-radius: 50%;
      animation: spin 0.8s linear infinite;
    "></div>
    <style>
      @keyframes spin { to { transform: rotate(360deg); } }
    </style>
  `;
  pandaInfo.appendChild(loaderOverlay);
  pandaInfo.style.pointerEvents = 'none';
}

function hidePandaInfoLoader(): void {
  const pandaInfo = document.querySelector('.panda-info') as HTMLElement;
  if (!pandaInfo) return;
  const loaderOverlay = document.getElementById('panda-info-loader');
  if (loaderOverlay) loaderOverlay.remove();
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

function initHeartButton(): void {
  const btn = document.getElementById('heart-btn') as HTMLButtonElement;
  if (!btn) return;

  const petId = getCurrentPetId();

  // Step 1 — read current favourites from localStorage
  const getFavourites = (): number[] => {
    return JSON.parse(localStorage.getItem('favourites') || '[]');
  };

  // Step 2 — set initial visual state on page load
  if (getFavourites().includes(petId)) {
    btn.classList.add('active');
  }

  // Step 3 — toggle on click
  btn.addEventListener('click', () => {
    const favs = getFavourites();
    const idx = favs.indexOf(petId);

    if (idx === -1) {
      // not in favourites — add it
      favs.push(petId);
      btn.classList.add('active');
    } else {
      // already in favourites — remove it
      favs.splice(idx, 1);
      btn.classList.remove('active');
    }

    localStorage.setItem('favourites', JSON.stringify(favs));
  });
}

export function initZoosPage(): void {
  const animalsContainer = document.querySelector('.live__animals') as HTMLElement;
  const pandaInfo = document.querySelector('.panda-info') as HTMLElement;

  if (animalsContainer) {
    animalsContainer.innerHTML = '<p class="loader" style="color:white; padding:20px;">Loading...</p>';
  }
  if (pandaInfo) showPandaInfoLoader();

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
          hidePandaInfoLoader();
          if (pandaInfo) {
          pandaInfo.innerHTML = '<p class="error-message">Something went wrong. Please, refresh the page</p>';
    }
        });
    })
    .catch(() => {
      if (animalsContainer) {
        animalsContainer.innerHTML = '<p class="error-message" style="color:white; padding:20px;">Something went wrong. Please, refresh the page</p>';
      }
    });
    initMapModal();
    initHeartButton();
}

function initMapModal(): void {
  const overlay = document.getElementById('map-overlay') as HTMLElement;
  const closeBtn = document.getElementById('map-modal-close') as HTMLElement;
  let mapInstance: L.Map | null = null;

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
    const fallback = FALLBACK_COORDS[currentPetId] ?? [0, 0];

    getPetById(currentPetId)
      .then((pet) => {
        const parseLat = (val: unknown): number => {
          if (typeof val === 'number') return val;
          const str = String(val).replace(/[°NnSs\s]/g, '').trim();
          const num = parseFloat(str);
          return isNaN(num) ? fallback[0] : num;
        };
        const parseLng = (val: unknown): number => {
          if (typeof val === 'number') return val;
          const str = String(val).replace(/[°EeWw\s]/g, '').trim();
          const num = parseFloat(str);
          return isNaN(num) ? fallback[1] : num;
        };
        const lat = parseLat(pet.latitude);
        const lng = parseLng(pet.longitude);
        openMap(lat, lng, pet.commonName);
      })
      .catch(() => {
        openMap(fallback[0], fallback[1], 'Habitat Range');
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

  document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    overlay.classList.remove('active');
    if (mapInstance) {
      mapInstance.remove();
      mapInstance = null;
    }
    }
  });
}

