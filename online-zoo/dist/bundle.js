/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/api/api.ts"
/*!************************!*\
  !*** ./src/api/api.ts ***!
  \************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

eval("{__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   getCameras: () => (/* binding */ getCameras),\n/* harmony export */   getFeedback: () => (/* binding */ getFeedback),\n/* harmony export */   getPetById: () => (/* binding */ getPetById),\n/* harmony export */   getPets: () => (/* binding */ getPets),\n/* harmony export */   login: () => (/* binding */ login),\n/* harmony export */   postDonation: () => (/* binding */ postDonation),\n/* harmony export */   register: () => (/* binding */ register)\n/* harmony export */ });\n/* harmony import */ var _types_interfaces__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../types/interfaces */ \"./src/types/interfaces.ts\");\nvar __awaiter = (undefined && undefined.__awaiter) || function (thisArg, _arguments, P, generator) {\n    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }\n    return new (P || (P = Promise))(function (resolve, reject) {\n        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }\n        function rejected(value) { try { step(generator[\"throw\"](value)); } catch (e) { reject(e); } }\n        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }\n        step((generator = generator.apply(thisArg, _arguments || [])).next());\n    });\n};\n\nconst BASE_URL = 'https://vsqsnqnxkh.execute-api.eu-central-1.amazonaws.com/prod';\nfunction fetchData(endpoint, options) {\n    return __awaiter(this, void 0, void 0, function* () {\n        const response = yield fetch(`${BASE_URL}${endpoint}`, options);\n        if (!response.ok) {\n            throw new Error(`HTTP error! status: ${response.status}`);\n        }\n        return response.json();\n    });\n}\nfunction getPets() {\n    return __awaiter(this, void 0, void 0, function* () {\n        const result = yield fetchData(_types_interfaces__WEBPACK_IMPORTED_MODULE_0__.ApiEndpoint.Pets);\n        return result.data;\n    });\n}\nfunction getPetById(id) {\n    return __awaiter(this, void 0, void 0, function* () {\n        const result = yield fetchData(`${_types_interfaces__WEBPACK_IMPORTED_MODULE_0__.ApiEndpoint.Pets}/${id}`);\n        return result.data;\n    });\n}\nfunction getCameras() {\n    return __awaiter(this, void 0, void 0, function* () {\n        const result = yield fetchData(_types_interfaces__WEBPACK_IMPORTED_MODULE_0__.ApiEndpoint.Cameras);\n        return result.data;\n    });\n}\nfunction getFeedback() {\n    return __awaiter(this, void 0, void 0, function* () {\n        const result = yield fetchData(_types_interfaces__WEBPACK_IMPORTED_MODULE_0__.ApiEndpoint.Feedback);\n        return result.data;\n    });\n}\nfunction login(payload) {\n    return __awaiter(this, void 0, void 0, function* () {\n        return fetchData(_types_interfaces__WEBPACK_IMPORTED_MODULE_0__.ApiEndpoint.Login, {\n            method: 'POST',\n            headers: { 'Content-Type': 'application/json' },\n            body: JSON.stringify(payload),\n        });\n    });\n}\nfunction register(payload) {\n    return __awaiter(this, void 0, void 0, function* () {\n        return fetchData(_types_interfaces__WEBPACK_IMPORTED_MODULE_0__.ApiEndpoint.Register, {\n            method: 'POST',\n            headers: { 'Content-Type': 'application/json' },\n            body: JSON.stringify(payload),\n        });\n    });\n}\nfunction postDonation(payload) {\n    return __awaiter(this, void 0, void 0, function* () {\n        yield fetchData(_types_interfaces__WEBPACK_IMPORTED_MODULE_0__.ApiEndpoint.Donations, {\n            method: 'POST',\n            headers: { 'Content-Type': 'application/json' },\n            body: JSON.stringify(payload),\n        });\n    });\n}\n\n\n//# sourceURL=webpack://online-zoo/./src/api/api.ts?\n}");

/***/ },

/***/ "./src/index.ts"
/*!**********************!*\
  !*** ./src/index.ts ***!
  \**********************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

eval("{__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _pages_landing__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./pages/landing */ \"./src/pages/landing.ts\");\n\ndocument.addEventListener('DOMContentLoaded', () => {\n    (0,_pages_landing__WEBPACK_IMPORTED_MODULE_0__.initLandingPage)();\n});\n\n\n//# sourceURL=webpack://online-zoo/./src/index.ts?\n}");

/***/ },

/***/ "./src/pages/landing.ts"
/*!******************************!*\
  !*** ./src/pages/landing.ts ***!
  \******************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

eval("{__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   initLandingPage: () => (/* binding */ initLandingPage)\n/* harmony export */ });\n/* harmony import */ var _api_api__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../api/api */ \"./src/api/api.ts\");\n\nfunction showLoader(container) {\n    container.innerHTML = '<div class=\"loader\">Loading...</div>';\n}\nfunction showError(container) {\n    container.innerHTML = '<p class=\"error-message\">Something went wrong. Please, refresh the page</p>';\n}\n// ─── PETS SLIDER ───────────────────────────────────────────\nlet pets = [];\nlet petIndex = 0;\nconst VISIBLE_PETS = 3;\nfunction renderPetSlider(track) {\n    track.innerHTML = '';\n    for (let i = 0; i < VISIBLE_PETS; i++) {\n        const pet = pets[(petIndex + i) % pets.length];\n        const card = document.createElement('div');\n        card.className = 'pet-card';\n        card.style.cursor = 'pointer';\n        card.onclick = () => {\n            window.location.href = `../zoos/panda/index.html`;\n        };\n        card.innerHTML = `\r\n      <div class=\"pet-card__image\">\r\n        <img src=\"../../assets/images/pet-sliders/slider_panda.png\" alt=\"${pet.name}\">\r\n        <span class=\"pet-card__name\">${pet.name}</span>\r\n      </div>\r\n      <div class=\"pet-card__content\">\r\n        <h3>${pet.commonName}</h3>\r\n        <p>${pet.description}</p>\r\n        <a href=\"#\" class=\"pet-card__link\">View Live Cam\r\n          <svg class=\"slidecard_arrow\" viewBox=\"0 0 24 24\" fill=\"none\">\r\n            <line x1=\"2\" y1=\"12\" x2=\"19\" y2=\"12\" stroke=\"currentColor\" stroke-width=\"2.5\" stroke-linecap=\"round\"/>\r\n            <polyline points=\"13,5 21,12 13,19\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2.5\" stroke-linecap=\"round\" stroke-linejoin=\"round\"/>\r\n          </svg>\r\n        </a>\r\n      </div>\r\n    `;\n        track.appendChild(card);\n    }\n}\nfunction initPetSlider() {\n    const track = document.querySelector('.pets__track');\n    if (!track)\n        return;\n    showLoader(track);\n    (0,_api_api__WEBPACK_IMPORTED_MODULE_0__.getPets)()\n        .then((data) => {\n        pets = data;\n        renderPetSlider(track);\n        const prevBtn = document.querySelector('#petsPrev');\n        const nextBtn = document.querySelector('#petsNext');\n        if (prevBtn) {\n            prevBtn.addEventListener('click', () => {\n                petIndex = (petIndex - 1 + pets.length) % pets.length;\n                renderPetSlider(track);\n            });\n        }\n        if (nextBtn) {\n            nextBtn.addEventListener('click', () => {\n                petIndex = (petIndex + 1) % pets.length;\n                renderPetSlider(track);\n            });\n        }\n    })\n        .catch(() => showError(track));\n}\n// ─── FEEDBACK SLIDER ───────────────────────────────────────\nlet feedbacks = [];\nlet feedbackIndex = 0;\nconst VISIBLE_FEEDBACKS = 2;\n// function renderFeedbackSlider(grid: HTMLElement): void {\n//   // keep the controls div, remove only testimonial-card divs\n//   const existingCards = grid.querySelectorAll('.testimonial-card');\n//   existingCards.forEach(card => card.remove());\n//   const controls = grid.querySelector('.testimonials__controls') as HTMLElement;\n//   for (let i = 0; i < VISIBLE_FEEDBACKS; i++) {\n//     const feedback = feedbacks[(feedbackIndex + i) % feedbacks.length];\n//     const card = document.createElement('div');\n//     card.className = 'testimonial-card';\n//     card.innerHTML = `\n//       <p class=\"testimonial-card__text\">${feedback.text}</p>\n//       <p class=\"testimonial-card__location\">${feedback.city}, ${feedback.month} ${feedback.year}</p>\n//       <p class=\"testimonial-card__name\">${feedback.name}</p>\n//     `;\n//     grid.insertBefore(card, controls);\n//   }\n// }\nconst TESTIMONIAL_IMAGES = [\n    'testimonial_karen.png',\n    'testimonial_carol.png',\n    'testimonial_stockman.png',\n    'testimonial_tomas.png',\n];\nfunction renderFeedbackSlider(grid) {\n    const existingCards = grid.querySelectorAll('.testimonial-card');\n    existingCards.forEach(card => card.remove());\n    const controls = grid.querySelector('.testimonials__controls');\n    for (let i = 0; i < VISIBLE_FEEDBACKS; i++) {\n        const feedback = feedbacks[(feedbackIndex + i) % feedbacks.length];\n        const imgFile = TESTIMONIAL_IMAGES[(feedbackIndex + i) % TESTIMONIAL_IMAGES.length];\n        const card = document.createElement('div');\n        card.className = 'testimonial-card';\n        card.innerHTML = `\r\n      <img src=\"../../assets/images/testimonials/${imgFile}\" alt=\"${feedback.name}\" class=\"testimonial-card__img\">\r\n    `;\n        grid.insertBefore(card, controls);\n    }\n}\nfunction initFeedbackSlider() {\n    const grid = document.querySelector('.testimonials__grid');\n    if (!grid)\n        return;\n    const existingCards = grid.querySelectorAll('.testimonial-card');\n    existingCards.forEach(card => {\n        card.innerHTML = '<div class=\"loader\">Loading...</div>';\n    });\n    (0,_api_api__WEBPACK_IMPORTED_MODULE_0__.getFeedback)()\n        .then((data) => {\n        feedbacks = data;\n        renderFeedbackSlider(grid);\n        const arrows = grid.querySelectorAll('.testimonial__btn__arrow');\n        const prevBtn = arrows[0];\n        const nextBtn = arrows[1];\n        if (prevBtn) {\n            prevBtn.addEventListener('click', () => {\n                feedbackIndex = (feedbackIndex - 1 + feedbacks.length) % feedbacks.length;\n                renderFeedbackSlider(grid);\n            });\n        }\n        if (nextBtn) {\n            nextBtn.addEventListener('click', () => {\n                feedbackIndex = (feedbackIndex + 1) % feedbacks.length;\n                renderFeedbackSlider(grid);\n            });\n        }\n    })\n        .catch(() => {\n        const existingCards = grid.querySelectorAll('.testimonial-card');\n        existingCards.forEach(card => {\n            card.innerHTML = '<p class=\"error-message\">Something went wrong. Please, refresh the page</p>';\n        });\n    });\n}\nfunction initLandingPage() {\n    initPetSlider();\n    initFeedbackSlider();\n}\n\n\n//# sourceURL=webpack://online-zoo/./src/pages/landing.ts?\n}");

/***/ },

/***/ "./src/types/interfaces.ts"
/*!*********************************!*\
  !*** ./src/types/interfaces.ts ***!
  \*********************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

eval("{__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   ApiEndpoint: () => (/* binding */ ApiEndpoint)\n/* harmony export */ });\nvar ApiEndpoint;\n(function (ApiEndpoint) {\n    ApiEndpoint[\"Pets\"] = \"/pets\";\n    ApiEndpoint[\"Cameras\"] = \"/cameras\";\n    ApiEndpoint[\"Feedback\"] = \"/feedback\";\n    ApiEndpoint[\"Donations\"] = \"/donations\";\n    ApiEndpoint[\"Login\"] = \"/auth/login\";\n    ApiEndpoint[\"Register\"] = \"/auth/register\";\n})(ApiEndpoint || (ApiEndpoint = {}));\n\n\n//# sourceURL=webpack://online-zoo/./src/types/interfaces.ts?\n}");

/***/ }

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		if (!(moduleId in __webpack_modules__)) {
/******/ 			delete __webpack_module_cache__[moduleId];
/******/ 			var e = new Error("Cannot find module '" + moduleId + "'");
/******/ 			e.code = 'MODULE_NOT_FOUND';
/******/ 			throw e;
/******/ 		}
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module can't be inlined because the eval devtool is used.
/******/ 	var __webpack_exports__ = __webpack_require__("./src/index.ts");
/******/ 	
/******/ })()
;