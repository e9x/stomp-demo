/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./assets/index.css":
/*!**************************!*\
  !*** ./assets/index.css ***!
  \**************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
// extracted by mini-css-extract-plugin


/***/ }),

/***/ "./Config.mjs":
/*!********************!*\
  !*** ./Config.mjs ***!
  \********************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "bare_directory": () => (/* binding */ bare_directory),
/* harmony export */   "tomp_directory": () => (/* binding */ tomp_directory),
/* harmony export */   "tomp_config": () => (/* binding */ tomp_config)
/* harmony export */ });
/* harmony import */ var _toomanyproxies_Logger_mjs__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../toomanyproxies/Logger.mjs */ "../toomanyproxies/Logger.mjs");


const bare_directory = '/bare/';
const tomp_directory = '/tomp/';

const tomp_config = {
	noscript: false,
	bare: bare_directory, // ran on same domain
	loglevel: _toomanyproxies_Logger_mjs__WEBPACK_IMPORTED_MODULE_0__.LOG_TRACE,
};

/***/ }),

/***/ "../toomanyproxies/Logger.mjs":
/*!************************************!*\
  !*** ../toomanyproxies/Logger.mjs ***!
  \************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "LOG_TRACE": () => (/* binding */ LOG_TRACE),
/* harmony export */   "LOG_DEBUG": () => (/* binding */ LOG_DEBUG),
/* harmony export */   "LOG_INFO": () => (/* binding */ LOG_INFO),
/* harmony export */   "LOG_WARN": () => (/* binding */ LOG_WARN),
/* harmony export */   "LOG_ERROR": () => (/* binding */ LOG_ERROR),
/* harmony export */   "LOG_SILENT": () => (/* binding */ LOG_SILENT),
/* harmony export */   "Logger": () => (/* binding */ Logger)
/* harmony export */ });
const LOG_TRACE = 0;
const LOG_DEBUG = 1;
const LOG_INFO = 2;
const LOG_WARN = 3;
const LOG_ERROR = 4;
const LOG_SILENT = 5;

const trace = console.trace.bind(console);
const debug = console.debug.bind(console);
const info = console.info.bind(console);
const warn = console.warn.bind(console);
const error = console.error.bind(console);

class Logger {
	levels = ['trace','debug','info','warn','error','silent'];
	constructor(loglevel){
		this.loglevel = loglevel;
	}
	trace(...args){
		if(this.loglevel <= LOG_TRACE)trace('[TOMP]', ...args);
	}
	debug(...args){
		if(this.loglevel <= LOG_DEBUG)debug('[TOMP]', ...args);
	}
	info(...args){
		if(this.loglevel <= LOG_INFO)info('[TOMP]', ...args);
	}
	warn(...args){
		if(this.loglevel <= LOG_WARN)warn('[TOMP]', ...args);
	}
	error(...args){
		if(this.loglevel <= LOG_ERROR)error('[TOMP]', ...args);
	}
};


/***/ })

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
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
(() => {
/*!**************************!*\
  !*** ./assets/index.mjs ***!
  \**************************/
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _index_css__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./index.css */ "./assets/index.css");
/* harmony import */ var _Config_mjs__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../Config.mjs */ "./Config.mjs");



const boot = new TOMPBoot(_Config_mjs__WEBPACK_IMPORTED_MODULE_1__.tomp_config);
const search = new TOMPBoot.SearchBuilder('https://searx.ru/search?q=%s');

const form = document.querySelector('.main');
const input = document.querySelector('.main > input');
const error_node = document.querySelector('.error');

boot.ready.catch(error => {
	error_node.textContent = error.toString();
});

form.addEventListener('submit', async event => {
	event.preventDefault();
	
	await boot.ready;

	location.assign(boot.process(search.query(input.value)));
});
})();

/******/ })()
;
//# sourceMappingURL=main.js.map