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

/***/ }),
/* 2 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "TextSpacingEngine": () => (/* binding */ TextSpacingEngine)
/* harmony export */ });
/* harmony import */ var _modules_Reedable_core_ui_DOM__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(3);
/* harmony import */ var _modules_Reedable_core_content_Engine__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(6);



class TextSpacingEngine extends _modules_Reedable_core_content_Engine__WEBPACK_IMPORTED_MODULE_1__.Engine {

    static getInstance() {

        if (!this.instance) {
            this.instance = new TextSpacingEngine();
        }

        return this.instance;
    }

    constructor() {
        super("textSpacing");
    }

    _filterNode(node) {
        return (
            (super._filterNode(node) || node.tagName === "PRE") &&
            (node.tagName !== "CODE")
        );
    }

    async _processNode(node, enginePref) {

        const {
            reedableLineHeight,
            reedableMarginTop,
            reedableLetterSpacing,
            reedableWordSpacing,
            reedableTextAlign
        } = node.dataset;

        if (typeof reedableLineHeight !== "undefined" ||
            typeof reedableMarginTop !== "undefined" ||
            typeof reedableLetterSpacing !== "undefined" ||
            typeof reedableWordSpacing !== "undefined" ||
            typeof reedableTextAlign !== "undefined") {

            await this._restoreNode(node);
        }

        //FIXME Why did I make this async?
        return (async () => {

            const { lineHeight, marginTop, letterSpacing, wordSpacing, textAlign } = node.style;
            const computedStyle = getComputedStyle(node);
            const computedFontSize = computedStyle.fontSize || "";

            function getLineHeight() {

                const computedLineHeight = computedStyle.lineHeight || "";

                if (computedLineHeight === "normal") {
                    return _modules_Reedable_core_ui_DOM__WEBPACK_IMPORTED_MODULE_0__.DOM.parseLength(
                        enginePref.lineHeight, computedStyle);
                }

                const estimatedLineHeight =
                    parseFloat(computedLineHeight) /
                    parseFloat(computedFontSize);

                if (estimatedLineHeight < enginePref.lineHeight) {
                    return enginePref.lineHeight;
                }
            }

            function getMarginTop() {

                // FIXME Are there non-semantic way to mark-up paragraphs?
                if (node.tagName === "P") {

                    const computedMarginTop = computedStyle.marginTop;

                    if (parseFloat(computedMarginTop) <
                        _modules_Reedable_core_ui_DOM__WEBPACK_IMPORTED_MODULE_0__.DOM.parseLength(enginePref.afterParagraph, computedStyle)) {
                        return enginePref.afterParagraph;
                    }
                }
            }

            function getLetterSpacing() {

                const computedLetterSpacing = computedStyle.letterSpacing;

                if (computedLetterSpacing === "normal") {
                    return enginePref.letterSpacing;
                }

                const estimatedLetterSpacing = parseFloat(computedLetterSpacing) / parseFloat(computedFontSize);

                if (estimatedLetterSpacing < _modules_Reedable_core_ui_DOM__WEBPACK_IMPORTED_MODULE_0__.DOM.parseLength(enginePref.letterSpacing, computedStyle)) {
                    return enginePref.letterSpacing;
                }
            }

            function getWordSpacing() {

                const computedWordSpacing = computedStyle.wordSpacing;

                if (computedWordSpacing === "normal") {
                    return enginePref.wordSpacing;
                }

                const computedFontSize = computedStyle.fontSize;
                const estimatedLetterSpacing = parseFloat(computedWordSpacing) / parseFloat(computedFontSize);

                if (estimatedLetterSpacing < _modules_Reedable_core_ui_DOM__WEBPACK_IMPORTED_MODULE_0__.DOM.parseLength(enginePref.wordSpacing, computedStyle)) {
                    return enginePref.wordSpacing;
                }
            }

            node.dataset.reedableLineHeight = lineHeight;
            node.dataset.reedableMarginTop = marginTop;
            node.dataset.reedableLetterSpacing = letterSpacing;
            node.dataset.reedableWordSpacing = wordSpacing;
            node.dataset.reedableTextAlign = textAlign;

            if (node.tagName === "PRE") {
                // <PRE> pre-formatted content should remain as is
                node.style.lineHeight = "initial";
                node.style.marginTop = "initial";
                node.style.letterSpacing = "initial";
                node.style.wordSpacing = "initial";
            } else {
                // Apply the value only if it exceeds the computed value.
                node.style.lineHeight = getLineHeight();
                node.style.marginTop = getMarginTop();
                node.style.letterSpacing = getLetterSpacing();
                node.style.wordSpacing = getWordSpacing();
                node.style.textAlign = enginePref.textAlign || "inherit";
            }
        })();
    }

    async _restoreNode(node) {

        // FIXME Why did I made this async? Consider performance implications
        return (async () => {

            const {
                reedableLineHeight,
                reedableMarginTop,
                reedableLetterSpacing,
                reedableWordSpacing,
                reedableTextAlign
            } = node.dataset;

            delete node.dataset.reedableLineHeight;
            delete node.dataset.reedableMarginTop;
            delete node.dataset.reedableLetterSpacing;
            delete node.dataset.reedableWordSpacing;
            delete node.dataset.reedableTextAlign;

            node.style.lineHeight = reedableLineHeight || "";
            node.style.marginTop = reedableMarginTop || "";
            node.style.letterSpacing = reedableLetterSpacing || "";
            node.style.wordSpacing = reedableWordSpacing || "";
            node.style.textAlign = reedableTextAlign || "";
        })();
    }
}

/***/ }),
/* 3 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "DOM": () => (/* binding */ DOM)
/* harmony export */ });
/* harmony import */ var _When__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(4);


let _computedRem = null;
const _documentWhenMap = new WeakMap();

/**
 * Usage
 *
 *  await Reedable.DOM.when(document).ready;
 *
 * I know I can write this with plain old Promise, but we use When
 * object, which is a bit more versatile under different circumstances.
 *
 * @param doc
 * @returns {Promise<void>}
 */
async function when(doc = document) {
    let whenDocument = _documentWhenMap.get(doc);

    if (!whenDocument) {
        whenDocument = new _When__WEBPACK_IMPORTED_MODULE_0__.When();
        _documentWhenMap.set(doc, whenDocument);

        if (doc && doc.body) {
            whenDocument.resolve(doc);
        } else {
            doc.addEventListener("DOMContentLoaded", () => {
                whenDocument.resolve(doc);
            });
        }
    }

    return whenDocument.ready;
}

/**
 * Returns the document's root fontSize, i.e. rem.
 * Rem is assumed to be 16px, if one cannot be determined.
 *
 * @returns {number}
 * @see https://github.com/jsdom/jsdom/issues/2363
 */
function getComputedRem() {

    if (_computedRem === null) {
        const documentElement = document && document.documentElement;
        const documentComputedStyle = getComputedStyle(documentElement);
        const documentComputedFontSize =
            documentComputedStyle &&
            documentComputedStyle.fontSize || "16px";

        _computedRem = parseAbsoluteLength(documentComputedFontSize);
    }

    return _computedRem;
}

/**
 * Returns the text in the supplied node.
 *
 * @param node Node whose text content to be examined.
 * @returns {string} Text contained by the node. Otherwise, empty string.
 */
function getText(node) {
    const childNodes = node && node.childNodes;
    const len = childNodes && childNodes.length;
    const textContents = new Array(len);

    for (let i = 0; i < len; i++) {
        const childNode = childNodes[i];
        const nodeType = childNode && childNode.nodeType;

        if (nodeType === Node.TEXT_NODE) {
            textContents.push(childNode && childNode.textContent);
        }
    }

    return textContents.join("")
        .replace(/[\r\t]/g, " ")
        .replace(/\s+/g, " ");
}

/**
 * Converts length into the number in px.
 *
 * @param string {string} Length include the unit, e.g. "1em", "1px"
 * @param computedStyle Computed style of the node.
 * @returns {number} Length in px without the unit.
 */
function parseLength(string, computedStyle) {
    string = String(string);

    return parseAbsoluteLength(string) ||
        parseRelativeLength(string, computedStyle) ||
        parseFloat(string);
}

/**
 * Converts absolute length into the number in px.
 *
 * @param string {string} Length including the unit, e.g. "1px"
 * @returns {number} Length in px without the uit.
 */
function parseAbsoluteLength(string) {
    if (string.endsWith("px")) {
        return parseFloat(string);
    } else if (string.endsWith("pt")) {
        return parseFloat(string) / 0.75;
    } else if (string.endsWith("pc")) {
        return parseFloat(string) * 16;
    } else if (string.endsWith("in")) {
        return parseFloat(string) * 96;
    } else if (string.endsWith("mm")) {
        return parseFloat(string) * 3.8;
    } else if (string.endsWith("cm")) {
        return parseFloat(string) * 38;
    } else if (string.endsWith("Q")) {
        return parseFloat(string) * 0.95;
    }
}

/**
 * Converts relative length into the number in px.
 *
 * TODO Find out whether we need the entire computedStyle or just fontSize
 *
 * @param string {string} Length including the unit, e.g. "1em"
 * @param computedStyle Computed style of the node.
 * @returns {number} Length in px without the unit.
 */
function parseRelativeLength(string, computedStyle) {
    if (computedStyle) {
        const computedFontSize =
            parseAbsoluteLength(
                computedStyle &&
                computedStyle.fontSize);

        if (string.endsWith("rem")) {
            return parseFloat(string) * getComputedRem();
        } else if (string.endsWith("em")) { //match rem before this one
            return parseFloat(string) * computedFontSize;
        }
    }
}

class DOM {

    static parseLength(...args) {
        return parseLength(...args);
    }

    static getText(...args) {
        return getText(...args);
    }

    static when(...args) {
        return when(...args);
    }
}


/***/ }),
/* 4 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "When": () => (/* binding */ When)
/* harmony export */ });
/* harmony import */ var _errors_OperationCancellationError__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(5);


/**
 * Usage
 *
 *  const whenDocument = new When();
 *
 *  if (document.body) {
 *      whenDocument.resolve();
 *  } else {
 *      document.addEventListener("DOMContentLoaded", () => {
 *          whenDocument.resolve();
 *      });
 *  }
 *
 *  setTimeout(() => {
 *      whenDocument.reject(); // after 30 sec, give up
 *  }, 30000);
 *
 *  await whenDocument.ready;
 *
 *  //.... do whatever you do when the document is ready
 */
class When {

    constructor() {
        this.prepare();
    }

    prepare() {
        this._ctorComplete = new Promise(ctorComplete => {
            this._promise = new Promise((resolve, reject) => {
                this._resolve = resolve;
                this._reject = reject;
                ctorComplete();
            });
        });

        return this;
    }

    /**
     * Resets the status of the object by rejecting the previously
     * constructed promise with OperationCancellationError. Creates
     * a new promise in its place.
     *
     * @returns {Promise<When>}
     */
    async reset(reason = "promise was discarded by the caller") {
        await this._ctorComplete;
        this._reject(new _errors_OperationCancellationError__WEBPACK_IMPORTED_MODULE_0__.OperationCancellationError(reason));
        return this.prepare();
    }

    async resolve(...args) {
        await this._ctorComplete;
        this._resolve(...args);
    }

    async reject(...args) {
        await this._ctorComplete;
        this._reject(...args);
    }

    get ready() {
        return this._ctorComplete.then(() => this._promise);
    }
}

/***/ }),
/* 5 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "OperationCancellationError": () => (/* binding */ OperationCancellationError)
/* harmony export */ });
class OperationCancellationError extends Error {
    constructor(...args) {
        super(...args);
    }
}

/***/ }),
/* 6 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Engine": () => (/* binding */ Engine)
/* harmony export */ });
/* harmony import */ var _ui_DOM__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(3);
/* harmony import */ var _errors_UnsupportedOperationError__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(7);
/* harmony import */ var _Storage__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(1);




class Engine {

    constructor(engineName) {
        this.engineName = engineName;
        this.observers = new WeakMap();
    }

    async start(documentFragment = document) {
        await _ui_DOM__WEBPACK_IMPORTED_MODULE_0__.DOM.when(documentFragment).ready;
        let observer = this.observers.get(documentFragment);

        if (!observer) {
            observer = this._createObserver((nodeList) => {
                this._processNodes(nodeList);
            });
            this.observers.set(documentFragment, observer);
        }

        observer.observe(documentFragment, {
            "attributes": false,
            "childList": true,
            "subtree": true
        });

        this._processNodes(documentFragment.querySelectorAll("*"));
    }

    async stop(documentFragment = document) {
        await _ui_DOM__WEBPACK_IMPORTED_MODULE_0__.DOM.when(documentFragment).ready;
        const observer = this.observers.get(documentFragment);

        if (observer) {
            observer.disconnect();
            this.observers.delete(documentFragment);
        }

        documentFragment.querySelectorAll("*").forEach((node) => {
            this._restoreNode(node);

            if (node.shadowRoot) {
                this.stop(node.shadowRoot);
            }
        });
    }

    _createObserver(callback) {
        return new MutationObserver((mutationList) => {
            for (let i = 0; i < mutationList.length; i++) {
                const mutation = mutationList[i];

                if (mutation.type === "childList") {
                    try {
                        callback(mutation.addedNodes);
                    } catch (e) {
                        console.error("Error while calling callback", e);
                    }
                }
            }
        });
    }

    _filterNode(node) {
        return (node.nodeType === Node.ELEMENT_NODE && _ui_DOM__WEBPACK_IMPORTED_MODULE_0__.DOM.getText(node));
    }

    async _processNodes(nodeList) {
        const pref = await _Storage__WEBPACK_IMPORTED_MODULE_2__.Sync.get(this.engineName);

        (nodeList || []).forEach((node) => {

            if (this._filterNode(node)) {
                try {
                    this._processNode(node, pref[this.engineName]);
                } catch (e) {
                    console.error("Error while calling this._processNode", e);
                }
            }

            if (node.shadowRoot) {
                this.start(node.shadowRoot);
            }
        });
    }

    /**
     * Implementation must be provided by the sub-classes.
     */
    async _processNode(node, enginePref) {
        throw new _errors_UnsupportedOperationError__WEBPACK_IMPORTED_MODULE_1__.UnsupportedOperationError("Engine._processNode");
    }

    /**
     * Implementation must be provided by the sub-classes.
     */
    async _restoreNode(node) {
        throw new _errors_UnsupportedOperationError__WEBPACK_IMPORTED_MODULE_1__.UnsupportedOperationError("Engine._restoreNode");
    }
}

/***/ }),
/* 7 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "UnsupportedOperationError": () => (/* binding */ UnsupportedOperationError)
/* harmony export */ });
class UnsupportedOperationError extends Error {
    constructor(...args) {
        super(...args);
    }
}

/***/ }),
/* 8 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "FontOverrideEngine": () => (/* binding */ FontOverrideEngine)
/* harmony export */ });
/* harmony import */ var _modules_Reedable_core_ui_DOM__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(3);
/* harmony import */ var _modules_Reedable_core_content_Engine__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(6);



/**
 * Injected <style> tag content CSS text loads packaged font files.
 *
 * The loaded font files must be declared in the manifest.js under
 * web_accessible_resources.
 *
 * https://developer.chrome.com/documentFragments/extensions/reference/i18n/
 */
const FONT_FACE_CSS = `
        @font-face {
            font-family: "OpenDyslexic Regular";
            src: url("chrome-extension://${chrome.runtime.id}/thirdparty/OpenDyslexic-Regular.otf");
        }`;

class FontOverrideEngine extends _modules_Reedable_core_content_Engine__WEBPACK_IMPORTED_MODULE_1__.Engine {

    static getInstance() {

        if (!this.instance) {
            this.instance = new FontOverrideEngine();
        }

        return this.instance;
    }

    constructor() {
        super("fontOverride");
    }

    async start(documentFragment) {

        await super.start(documentFragment);

        if (documentFragment) {

            let style = documentFragment.querySelector("#reedableFontOverrideStyle");

            if (!style) {
                style = documentFragment.createElement("style");
                style.id = "reedableFontOverrideStyle";
                style.appendChild(documentFragment.createTextNode(FONT_FACE_CSS));
                (documentFragment.head || documentFragment).appendChild(style);
            }
        }
    }

    async stop(documentFragment) {

        await super.stop(documentFragment);

        if (documentFragment) {
            const style = documentFragment.querySelector("#reedableFontOverrideStyle");

            if (style) {
                style.remove();
            }
        }
    }

    async _processNode(node, fontOverride) {

        const { reedableFontSize, reedableFontFamily } = node.dataset;

        if (typeof reedableFontSize !== "undefined" ||
            typeof reedableFontFamily !== "undefined") {

            await this._restoreNode(node);
        }

        return (async () => {

            const { fontSize, fontFamily } = node.style;

            const computedStyle = getComputedStyle(node);
            const computedFontSize = computedStyle.fontSize || "";

            function getFontSize() {

                const fontSizeMinPx = _modules_Reedable_core_ui_DOM__WEBPACK_IMPORTED_MODULE_0__.DOM.parseLength(fontOverride.fontSizeMin, computedStyle);
                let reedableFontSizeMag = node.dataset.reedableFontSizeMag;
                let fontSizeTargetPx;

                if (!reedableFontSizeMag) {
                    const reedableFontSizeMagNode = node.closest("[data-reedable-font-size-mag]");

                    if (reedableFontSizeMagNode) {
                        reedableFontSizeMag = reedableFontSizeMagNode.dataset.reedableFontSizeMag;
                    } else {
                        node.dataset.reedableFontSizeMag = fontOverride.fontSizeMag;
                    }
                }

                if (reedableFontSizeMag !== fontOverride.fontSizeMag) {
                    fontSizeTargetPx = parseFloat(computedFontSize) * Number(fontOverride.fontSizeMag) / 100;
                    node.dataset.reedableFontSizeMag = fontOverride.fontSizeMag;
                } else {
                    fontSizeTargetPx = parseFloat(computedStyle.fontSize);
                }

                if (fontSizeTargetPx < fontSizeMinPx) {
                    fontSizeTargetPx = fontSizeMinPx;
                }

                return [fontSizeTargetPx, "px"].join("");
            }

            // FIXME This should return a list. https://www.w3schools.com/cssref/pr_font_font-family.asp
            function getFontFamily() {

                const computedFontFamily = computedStyle.fontFamily;

                if (computedFontFamily !== fontOverride.fontFamily) {
                    return fontOverride.fontFamily;
                }

                return "";
            }

            node.dataset.reedableFontSize = fontSize;
            node.dataset.reedableFontFamily = fontFamily;

            node.style.fontSize = getFontSize();
            node.style.fontFamily = getFontFamily();
        })();
    }

    async _restoreNode(node) {

        return (async () => {

            const { reedableFontSize, reedableFontFamily } = node.dataset;

            delete node.dataset.reedableFontSize;
            delete node.dataset.reedableFontFamily;

            node.style.fontSize = reedableFontSize || "";
            node.style.fontFamily = reedableFontFamily || "";
        })();
    }
}


/***/ }),
/* 9 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "FocusIndicatorEngine": () => (/* binding */ FocusIndicatorEngine)
/* harmony export */ });
/* harmony import */ var _modules_Reedable_core_content_Engine__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(6);
/* harmony import */ var _modules_Reedable_core_ui_DOM__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(3);



class FocusIndicatorEngine extends _modules_Reedable_core_content_Engine__WEBPACK_IMPORTED_MODULE_0__.Engine {

    static getInstance() {

        if (!this.instance) {
            this.instance = new FocusIndicatorEngine();
        }

        return this.instance;
    }

    constructor() {
        super("focusIndicator");
    }

    _onFocusIn(event) {

        const node = event.target;

        const {
            borderRadius,
            boxShadow,
            transition,
            outline
        } = node.style;

        node.dataset.reedableBorderRadius = borderRadius;
        node.dataset.reedableBoxShadow = boxShadow;
        node.dataset.reedableTransition = transition;
        node.dataset.reedableOutline = outline;

        this._onFocusOut = this._onFocusOut.bind(this);

        chrome.storage.sync.get([this.engineName], (pref) => {
            const enginePref = pref[this.engineName];
            node.style.borderRadius = enginePref.borderRadius;
            node.style.boxShadow = enginePref.boxShadow;
            node.style.transition = enginePref.transition;
            node.style.outline = "none";
            node.addEventListener("focusout", this._onFocusOut);
        });
    }

    _onFocusOut(event) {

        const node = event.target;

        const {
            reedableBorderRadius,
            reedableBoxShadow,
            reedableTransition,
            reedableOutline
        } = node.dataset;

        delete node.dataset.reedableBorderRadius;
        delete node.dataset.reedableBoxShadow;
        delete node.dataset.reedableTransition;
        delete node.dataset.reedableOutline;

        node.style.borderRadius = reedableBorderRadius || "";
        node.style.boxShadow = reedableBoxShadow || "";
        node.style.transition = reedableTransition || "";
        node.style.outline = reedableOutline || "";
        node.removeEventListener("focusout", this._onFocusOut);
    }

    async start(documentFragment) {

        await _modules_Reedable_core_ui_DOM__WEBPACK_IMPORTED_MODULE_1__.DOM.when(documentFragment).ready;

        this._onFocusIn = this._onFocusIn.bind(this);
        documentFragment.addEventListener("focusin", this._onFocusIn);

        documentFragment.querySelectorAll("*").forEach((node) => {
            if (node.shadowRoot) {
                this.start(node.shadowRoot);
            }
        });
    }

    async stop(documentFragment) {

        await _modules_Reedable_core_ui_DOM__WEBPACK_IMPORTED_MODULE_1__.DOM.when(documentFragment).ready;

        documentFragment.removeEventListener("focusin", this._onFocusIn);

        documentFragment.querySelectorAll("*").forEach((node) => {
            if (node.shadowRoot) {
                this.stop(node.shadowRoot);
            }
        });
    }
}

/***/ }),
/* 10 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "LinkInformationEngine": () => (/* binding */ LinkInformationEngine)
/* harmony export */ });
/* harmony import */ var _modules_Reedable_core_content_Engine__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(6);

//import { DOM } from "../../modules/Reedable-core/ui/DOM";

const FONT_FACE_CSS = `
    /* Load Font Awesome 6 in Reedable namespace to avoid collision. */

    @font-face {
        font-family: "Reedable FA6 Brands";
        font-weight: 400;
        font-style: normal;
        font-display: block;
        src: url("chrome-extension://${chrome.runtime.id}/thirdparty/fontawesome-free-6.1.1-web/webfonts/fa-brands-400.woff2") format("woff2"),
                url("chrome-extension://${chrome.runtime.id}/thirdparty/fontawesome-free-6.1.1-web/webfonts/fa-brands-400.ttf") format("truetype");
    }

    @font-face {
        font-family: 'Reedable FA6 Regular';
        font-style: normal;
        font-weight: 400;
        font-display: block;
        src: url("chrome-extension://${chrome.runtime.id}/thirdparty/fontawesome-free-6.1.1-web/webfonts/fa-regular-400.woff2") format("woff2"),
                url("chrome-extension://${chrome.runtime.id}/thirdparty/fontawesome-free-6.1.1-web/webfonts/fa-regular-400.ttf") format("truetype");
    }

    @font-face {
        font-family: 'Reedable FA6 Solid';
        font-style: normal;
        font-weight: 900;
        font-display: block;
        src: url("chrome-extension://${chrome.runtime.id}/thirdparty/fontawesome-free-6.1.1-web/webfonts/fa-solid-900.woff2") format("woff2"),
                url("chrome-extension://${chrome.runtime.id}/thirdparty/fontawesome-free-6.1.1-web/webfonts/fa-solid-900.ttf") format("truetype");
    }
`;

const LINK_INFORMATION = `

    /*
        Anchors are identified by

            a:not([href])[id]
            a:not([href])[name]
    */

    a:not([href])[id][title][data-reedable-link-information-show-title]::after,
    a:not([href])[name][title][data-reedable-link-information-show-title]::after {
        font-size: max(0.875em, 0.875rem);
        width: auto;
        content: "\\00a0(" attr(title) ")";
    }

    a:not([href])[id]:not([title])[data-reedable-link-information-show-title]::after {
        font-size: inherit;
        width: auto;
        content: "\\00a0" attr(id);
    }

    a:not([href])[name]:not([id]):not([title])[data-reedable-link-information-show-title]::after {
        font-size: inherit;
        width: auto;
        content: "\\00a0" attr(name);
    }

    /*
        Link are identified by
        
            a[href]
    */

    /* Content and title are both available. Show the title in parentheses. */
    a[href][title][data-reedable-link-information-show-title]::after {
        font-size: max(0.875em, 0.875rem);
        width: auto;
        content: "\\00a0(" attr(title) ")";
    }

    /* No content or title is provided. Show href if available. */
    a[href]:not(:has(:not(:empty))):not([title])[data-reedable-link-information-show-title]::after {
        font-size: inherit;
        width: auto;
        content: "\\00a0(" attr(href) ")";
        max-width: 12em;
        display: inline-block;
        overflow: hidden;
        text-overflow: ellipsis;
    }
`;

const LINK_INFORMATION_ON_HOVER_TOOLTIP = `

    a[href]::after {
        position: relative;
    }

    a[href]:focus::after,
    a[href]:hover::after {
        content: "\\00a0[" attr(href) "]";
        padding: 4px 8px;
        color: #333;
        position: absolute;
        left: 0;
        top: 100%;
        white-space: nowrap;
        z-index: 20;
        border-radius: 5px;
        box-shadow: 0px 0px 4px #222;
        background-image: linear-gradient(#eeeeee, #cccccc);
    }
`;

const LINK_INFORMATION_ON_HOVER_INLINE = `
    
    a[href]:focus::after,
    a[href]:hover::after {
        content: "\\00a0" attr(title) " [" attr(href) "]";
        font-style: normal;
        overflow-wrap: anywhere;
        font-size: max(0.75em, 0.75rem);
        word-break: break-all;
    }
`;

const LINK_INFORMATION_ICON = `

    /* ++ Anchor */

    a:not([href])[id][data-reedable-link-information-show-icon]::before,
    a:not([href])[name][data-reedable-link-information-show-icon]::before {
        font-family: "Reedable FA6 Regular", "Reedable FA6 Solid", "Reedable FA6 Brands";
        font-style: normal;
        font-size: 0.875em;
        width: auto;
        content: "\\f13d"; /* fa-anchor */
    }

    /* ++ Link */

    a[data-reedable-link-information-show-icon][href]::before {
        font-family: "Reedable FA6 Regular", "Reedable FA6 Solid", "Reedable FA6 Brands";
        font-style: normal;
        font-size: 0.875em;
        width: auto;
    }

    a[data-reedable-link-information-show-icon][href] * {
        position: initial;
    }

    a[data-reedable-link-information-show-icon][href^="#"]::before {
        content: "\\23\\00a0"; /* fa-hashtag */
    }

    a[data-reedable-link-information-show-icon][href^="http:"]::before,
    a[data-reedable-link-information-show-icon][href^="https:"]::before {
        content: "\\f0c1\\00a0"; /* fa-link */
    }

    a[data-reedable-link-information-show-icon][href^="ftp:"]::before,
    a[data-reedable-link-information-show-icon][href^="sftp:"]::before {
        content: "\\f15b\\00a0"; /* fa-file */
    }

    a[data-reedable-link-information-show-icon][href^="mailto:"]::before {
        content: "\\f0e0\\00a0"; /* fa-envelope */
    }

    a[data-reedable-link-information-show-icon][href^="tel:"]::before,
    a[data-reedable-link-information-show-icon][href^="wtai:"]::before {
        content: "\\f095\\00a0"; /* fa-phone */
    }

    a[data-reedable-link-information-show-icon][href^="bitcoin:"]::before {
        content: "\\f379\\00a0"; /* fa-bitcoin */
    }

    a[data-reedable-link-information-show-icon][href^="geo:"]::before {
        content: "\\f14e\\00a0"; /* fa-compass */
    }

    a[data-reedable-link-information-show-icon][href^="im:"]::before,
    a[data-reedable-link-information-show-icon][href^="irc:"]::before,
    a[data-reedable-link-information-show-icon][href^="ircs:"]::before,
    a[data-reedable-link-information-show-icon][href^="xmpp:"]::before {
        content: "\\f4ad\\00a0"; /* fa-comment-dots */
    }

    a[data-reedable-link-information-show-icon][href^="magnet:"]::before,
    a[data-reedable-link-information-show-icon][href^="urn:"]::before {
        content: "\\f15b\\00a0"; /* fa-file */
    }
    
    a[data-reedable-link-information-show-icon][href^="news:"]::before,
    a[data-reedable-link-information-show-icon][href^="nntp:"]::before {
        content: "\\f086\\00a0"; /* fa-comments */
    }

    a[data-reedable-link-information-show-icon][href^="sms:"]::before,
    a[data-reedable-link-information-show-icon][href^="smsto:"]::before {
        content: "\\f7cd\\00a0"; /* fa-comment-sms */
    }

    a[data-reedable-link-information-show-icon][href^="ssh:"]::before {
        content: "\\f120\\00a0"; /* fa-terminal */
    }

    a[data-reedable-link-information-show-icon][href^="webcal:"]::before {
        content: "\\f133\\00a0"; /* fa-calendar */
    }
`;

class LinkInformationEngine extends _modules_Reedable_core_content_Engine__WEBPACK_IMPORTED_MODULE_0__.Engine {

    static getInstance() {

        if (!this.instance) {
            this.instance = new LinkInformationEngine();
        }

        return this.instance;
    }

    constructor() {
        super("linkInformation");
    }

    async start(documentFragment) {

        await super.start(documentFragment);

        if (documentFragment) {

            let style = documentFragment.querySelector("#reedableLinkInformationStyle");

            if (!style) {

                style = documentFragment.createElement("style");
                style.id = "reedableLinkInformationStyle";

                style.appendChild(documentFragment.createTextNode(FONT_FACE_CSS));
                style.appendChild(documentFragment.createTextNode(LINK_INFORMATION));
                style.appendChild(documentFragment.createTextNode(LINK_INFORMATION_ICON));

                (documentFragment.head || documentFragment).appendChild(style);
            }
        }
    }

    async stop(documentFragment) {

        await super.stop(documentFragment);

        if (documentFragment) {

            const style = documentFragment.querySelector("#reedableLinkInformationStyle");

            if (style) {
                style.remove();
            }
        }
    }

    _filterNode(node) {
        return (node.tagName === "A");
    }

    async _processNode(node, linkInformation) {

        if (linkInformation.showTitle) {
            node.dataset.reedableLinkInformationShowTitle = "";
        } else {
            delete node.dataset.reedableLinkInformationShowTitle;
        }

        if (linkInformation.showIcon) {
            node.dataset.reedableLinkInformationShowIcon = "";
        } else {
            delete node.dataset.reedableLinkInformationShowIcon;
        }
    }

    async _restoreNode(node) {
        delete node.dataset.reedableLinkInformationShowTitle;
        delete node.dataset.reedableLinkInformationShowIcon;
    }
}

/***/ }),
/* 11 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "ColorOverrideEngine": () => (/* binding */ ColorOverrideEngine)
/* harmony export */ });
/* harmony import */ var _modules_Reedable_core_content_Engine__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(6);
/* harmony import */ var _modules_Reedable_core_Storage__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(1);



class ColorOverrideEngine extends _modules_Reedable_core_content_Engine__WEBPACK_IMPORTED_MODULE_0__.Engine {

    static getInstance() {

        if (!this.instance) {
            this.instance = new ColorOverrideEngine();
        }

        return this.instance;
    }

    constructor() {
        super("colorOverride");
    }

    _filterNode(node) {
        return (node.tagName === "IMG");
    }

    async start(documentFragment) {

        await super.start(documentFragment);

        const pref = await _modules_Reedable_core_Storage__WEBPACK_IMPORTED_MODULE_1__.Sync.get(this.engineName);
        const colorOverride = pref[this.engineName];
        const { filterInvert, filterContrast } = colorOverride;

        if (filterInvert || filterContrast) {


            if (documentFragment) {

                const filter = [
                    filterInvert && `invert(${filterInvert})`,
                    filterContrast && `contrast(${filterContrast})`
                ].join(" ");

                const html = documentFragment.querySelector("html");
                html.dataset.reedableFilter = html.style.filter;
                html.style.filter = filter;
            }
        }
    }

    async stop(documentFragment) {

        await super.stop(documentFragment);

        if (documentFragment) {

            const html = documentFragment.querySelector("html");

            if (html) {
                html.style.filter = html.dataset.reedableFilter;
                delete html.dataset.reedableFilter;
            }
        }
    }

    async _processNode(node, colorOverride) {

        const { reedableFilter } = node.dataset;
        const { filterInvert } = colorOverride;

        if (typeof reedableFilter !== "undefined") {
            await this._restoreNode(node);
        }

        return (async () => {

            const { filter } = node.style;

            node.dataset.reedableFilter = filter;

            if (filterInvert) {
                node.style.filter = `invert(${filterInvert})`;
            }
        })();
    }

    async _restoreNode(node) {

        return (async () => {

            const { reedableFilter } = node.dataset;

            delete node.dataset.reedableFilter;

            node.style.filter = reedableFilter || "";
        })();
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
/* harmony import */ var _TextSpacingEngine__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(2);
/* harmony import */ var _FontOverrideEngine__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(8);
/* harmony import */ var _FocusIndicatorEngine__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(9);
/* harmony import */ var _LinkInformationEngine__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(10);
/* harmony import */ var _ColorOverrideEngine__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(11);







window.Reedable = { TextSpacingEngine: _TextSpacingEngine__WEBPACK_IMPORTED_MODULE_1__.TextSpacingEngine, FontOverrideEngine: _FontOverrideEngine__WEBPACK_IMPORTED_MODULE_2__.FontOverrideEngine, FocusIndicatorEngine: _FocusIndicatorEngine__WEBPACK_IMPORTED_MODULE_3__.FocusIndicatorEngine, LinkInformationEngine: _LinkInformationEngine__WEBPACK_IMPORTED_MODULE_4__.LinkInformationEngine };

_modules_Reedable_core_Storage__WEBPACK_IMPORTED_MODULE_0__.Sync.get(
    "textSpacing",
    "fontOverride",
    "focusIndicator",
    "linkInformation",
    "colorOverride"
).then(

    ({
        textSpacing,
        fontOverride,
        focusIndicator,
        linkInformation,
        colorOverride
    }) => {

        console.log({
            textSpacing,
            fontOverride,
            focusIndicator,
            linkInformation,
            colorOverride
        });

        if (textSpacing.isEnabled) {
            _TextSpacingEngine__WEBPACK_IMPORTED_MODULE_1__.TextSpacingEngine.getInstance().start(document);
        } else {
            _TextSpacingEngine__WEBPACK_IMPORTED_MODULE_1__.TextSpacingEngine.getInstance().stop(document);
        }

        if (fontOverride.isEnabled) {
            _FontOverrideEngine__WEBPACK_IMPORTED_MODULE_2__.FontOverrideEngine.getInstance().start(document);
        } else {
            _FontOverrideEngine__WEBPACK_IMPORTED_MODULE_2__.FontOverrideEngine.getInstance().stop(document);
        }

        if (focusIndicator.isEnabled) {
            _FocusIndicatorEngine__WEBPACK_IMPORTED_MODULE_3__.FocusIndicatorEngine.getInstance().start(document);
        } else {
            _FocusIndicatorEngine__WEBPACK_IMPORTED_MODULE_3__.FocusIndicatorEngine.getInstance().stop(document);
        }

        if (linkInformation.isEnabled) {
            _LinkInformationEngine__WEBPACK_IMPORTED_MODULE_4__.LinkInformationEngine.getInstance().start(document);
        } else {
            _LinkInformationEngine__WEBPACK_IMPORTED_MODULE_4__.LinkInformationEngine.getInstance().stop(document);
        }

        if (colorOverride.isEnabled) {
            _ColorOverrideEngine__WEBPACK_IMPORTED_MODULE_5__.ColorOverrideEngine.getInstance().start(document);
        } else {
            _ColorOverrideEngine__WEBPACK_IMPORTED_MODULE_5__.ColorOverrideEngine.getInstance().stop(document);
        }
    }
);
})();

/******/ })()
;