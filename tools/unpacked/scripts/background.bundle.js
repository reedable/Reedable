/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ([
/* 0 */,
/* 1 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Sync": () => (/* binding */ Sync)
/* harmony export */ });
class Sync {

    static async get(...keys) {
        return new Promise(resolve => {
            chrome.storage.sync.get(keys, resolve);
        });
    }

    static async set(values) {
        return new Promise(resolve => {
            chrome.storage.sync.set(values, resolve);
        });
    }
}

/***/ })
/******/ 	]);
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
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _modules_Reedable_core_Storage__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(1);


const manifest = chrome.runtime.getManifest();

chrome.runtime.onInstalled.addListener(async () => {

    const default_reedable = {
        "fontOverride": {
            "isExpanded": true
        },
        "textSpacing": {
            "isExpanded": false
        },
        "focusIndicator": {
            "isExpanded": false
        },
        "linkInformation": {
            "isExpanded": false
        },
        "colorOverride": {
            "isExpanded": false
        }
    };

    const default_textSpacing = {
        "isEnabled": true,
        "lineHeight": "1.5",
        "afterParagraph": "2em",
        "letterSpacing": "0.12em",
        "wordSpacing": "0.16em"
    };

    const default_fontOverride = {
        "isEnabled": true,
        "fontSizeMin": "10pt",
        "fontSizeMag": "100",
        "fontFamily": ""
    };

    const default_focusIndicator = {
        "isEnabled": true,
        "boxShadow": "0 0 0 0.25em orange,\n0 0 0 0.5em white",
        "borderRadius": "0.5em",
        "transition": "0.2s"
    };

    const default_linkInformation = {
        "isEnabled": true,
        "showTitle": true,
        "showIcon": true
    };

    const default_colorOverride = {
        "isEnabled": false, //FIXME set to false
        "filterInvert": "1",
        "filterContrast": "200%"
    };

    const v1_3 = await _modules_Reedable_core_Storage__WEBPACK_IMPORTED_MODULE_0__.Sync.get(
        "reedable",
        "textSpacing",
        "fontOverride",
        "focusIndicator",
        "linkInformation",
        "colorOverride"
    );

    const v1_2 = await _modules_Reedable_core_Storage__WEBPACK_IMPORTED_MODULE_0__.Sync.get(
        "reedable",
        "textSpacing",
        "fontOverride",
        "focusIndicator",
        "linkInformation"
    );

    // User provided v1.1 pref
    const v1_1 = await _modules_Reedable_core_Storage__WEBPACK_IMPORTED_MODULE_0__.Sync.get(
        "reedable",
        "textSpacing",
        "fontOverride",
        "focusIndicator"
    );

    // User provided v1.0 pref
    const v1_0 = await _modules_Reedable_core_Storage__WEBPACK_IMPORTED_MODULE_0__.Sync.get(
        "Reedable",
        "FontOverride",
        "TextSpacing",
        "FocusIndicator"
    );

    console.log("retrieved v1.0 pref", v1_0);
    console.log("retrieved v1.1+ pref", v1_1);

    const pref = Object.assign({
        "version": manifest.version,
        "reedable": Object.assign(
            default_reedable,
            v1_0.Reedable,
            v1_1.reedable,
            v1_2.reedable,
            v1_3.reedable
        ),
        "textSpacing": Object.assign(
            default_textSpacing,
            v1_0.TextSpacing,
            v1_1.textSpacing,
            v1_2.textSpacing,
            v1_3.textSpacing
        ),
        "fontOverride": Object.assign(
            default_fontOverride,
            v1_0.FontOverride,
            v1_1.fontOverride,
            v1_2.fontOverride,
            v1_3.fontOverride
        ),
        "focusIndicator": Object.assign(
            default_focusIndicator,
            v1_0.FocusIndicator,
            v1_1.focusIndicator,
            v1_2.focusIndicator,
            v1_3.focusIndicator
        ),
        "linkInformation": Object.assign(
            default_linkInformation,
            v1_2.linkInformation,
            v1_3.linkInformation
        ),
        "colorOverride": Object.assign(
            default_colorOverride,
            v1_3.colorOverride
        )
    });

    // User pref to be stored
    console.log("storing pref", pref);

    await _modules_Reedable_core_Storage__WEBPACK_IMPORTED_MODULE_0__.Sync.set(pref);
});

// Apply style automatically on tab switch
chrome.tabs.onActivated.addListener(async (activeInfo) => {

    const {
        focusIndicator,
        fontOverride,
        textSpacing,
        linkInformation,
        colorOverride
    } = await _modules_Reedable_core_Storage__WEBPACK_IMPORTED_MODULE_0__.Sync.get(
        "focusIndicator",
        "fontOverride",
        "textSpacing",
        "linkInformation",
        "colorOverride"
    );

    console.log("tabId", activeInfo.tabId);
    console.log("fontOverride", fontOverride.isEnabled);
    console.log("focusIndicator", focusIndicator.isEnabled);
    console.log("textSpacing", textSpacing.isEnabled);
    console.log("linkInformation", linkInformation.isEnabled);
    console.log("colorOverride", colorOverride.isEnabled);

    const tabId = activeInfo.tabId;

    if (textSpacing.isEnabled) {
        chrome.scripting.executeScript({
            "target": { "tabId": tabId },
            "func": function () {
                // See ../content/content.js
                // eslint-disable-next-line no-undef
                Reedable.TextSpacingEngine.getInstance().start(document);
            }
        });
    } else {
        chrome.scripting.executeScript({
            "target": { "tabId": tabId },
            "func": function () {
                // See ../content/content.js
                // eslint-disable-next-line no-undef
                Reedable.TextSpacingEngine.getInstance().stop(document);
            }
        });
    }

    if (fontOverride.isEnabled) {
        chrome.scripting.executeScript({
            "target": { "tabId": tabId },
            "func": function () {
                // See ../content/content.js
                // eslint-disable-next-line no-undef
                Reedable.FontOverrideEngine.getInstance().start(document);
            }
        });
    } else {
        chrome.scripting.executeScript({
            "target": { "tabId": tabId },
            "func": function () {
                // See ../content/content.js
                // eslint-disable-next-line no-undef
                Reedable.FontOverrideEngine.getInstance().stop(document);
            }
        });
    }

    if (focusIndicator.isEnabled) {
        chrome.scripting.executeScript({
            "target": { "tabId": tabId },
            "func": function () {
                // See ../content/content.js
                // eslint-disable-next-line no-undef
                Reedable.FocusIndicatorEngine.getInstance().start(document);
            }
        });
    } else {
        chrome.scripting.executeScript({
            "target": { "tabId": tabId },
            "func": function () {
                // See ../content/content.js
                // eslint-disable-next-line no-undef
                Reedable.FocusIndicatorEngine.getInstance().stop(document);
            }
        });
    }

    if (linkInformation.isEnabled) {
        chrome.scripting.executeScript({
            "target": { "tabId": tabId },
            "func": function () {
                // See ../content/content.js
                // eslint-disable-next-line no-undef
                Reedable.LinkInformationEngine.getInstance().start(document);
            }
        });
    } else {
        chrome.scripting.executeScript({
            "target": { "tabId": tabId },
            "func": function () {
                // See ../content/content.js
                // eslint-disable-next-line no-undef
                Reedable.LinkInformationEngine.getInstance().stop(document);
            }
        });
    }

    if (colorOverride.isEnabled) {
        chrome.scripting.executeScript({
            "target": { "tabId": tabId },
            "func": function () {
                // See ../content/content.js
                // eslint-disable-next-line no-undef
                Reedable.ColorOverrideEngine.getInstance().start(document);
            }
        });
    } else {
        chrome.scripting.executeScript({
            "target": { "tabId": tabId },
            "func": function () {
                // See ../content/content.js
                // eslint-disable-next-line no-undef
                Reedable.ColorOverrideEngine.getInstance().stop(document);
            }
        });
    }
});
})();

/******/ })()
;