/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ([
/* 0 */,
/* 1 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "App": () => (/* binding */ App)
/* harmony export */ });
/* harmony import */ var _Controller__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(2);
/* harmony import */ var _DOM__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(7);



class App extends _Controller__WEBPACK_IMPORTED_MODULE_0__.Controller {

    constructor(doc, opts) {
        super(doc, opts);
    }

    async start(selectorInitializerMap = {}) {
        await _DOM__WEBPACK_IMPORTED_MODULE_1__.DOM.when(this.node$).ready;
        return this.connect(selectorInitializerMap);
    }
}

/***/ }),
/* 2 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Controller": () => (/* binding */ Controller)
/* harmony export */ });
/* harmony import */ var _ControllerRegistry__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(3);
/* harmony import */ var _NodeManager__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(4);
/* harmony import */ var _errors_UnsupportedOperationError__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(6);




class Controller {

    constructor(node, opts = {}) {

        if (typeof node === "undefined") {
            throw new _errors_UnsupportedOperationError__WEBPACK_IMPORTED_MODULE_2__.UnsupportedOperationError("node is required");
        }

        const controller = _ControllerRegistry__WEBPACK_IMPORTED_MODULE_0__.ControllerRegistry.getController(node);

        if (controller) {
            try {
                controller.destroy();
            } catch (e) {
                console.error("Error while calling destroy", e);
            }
        }

        this.opts = JSON.parse(JSON.stringify(opts));
        this.nodeManager = new _NodeManager__WEBPACK_IMPORTED_MODULE_1__.NodeManager();
        this.node$ = this.$(node);
        _ControllerRegistry__WEBPACK_IMPORTED_MODULE_0__.ControllerRegistry.register(this);
    }

    destroy() {
        this.nodeManager.destroy();
        _ControllerRegistry__WEBPACK_IMPORTED_MODULE_0__.ControllerRegistry.deregister(this);
    }

    $(node) {
        return this.nodeManager.register(node);
    }

    connect(selectorInitializerMap = {}) {
        return Object.keys(selectorInitializerMap).map((selector) => {
            const nodeList = this.node$.querySelectorAll(selector);
            const initializer = selectorInitializerMap[selector];

            return Array.from(nodeList).map((node) => {
                const controller = _ControllerRegistry__WEBPACK_IMPORTED_MODULE_0__.ControllerRegistry.getController(node);

                if (controller) {
                    console.log(
                        "node is already associated with a " +
                        "different controller. Did you forget " +
                        "to de-register it?", node, controller
                    );
                } else {
                    return initializer(node);
                }
            });
        });
    }
}

/***/ }),
/* 3 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "ControllerRegistry": () => (/* binding */ ControllerRegistry)
/* harmony export */ });
class ControllerRegistry {

    static nodeControllerMap = new WeakMap();

    static register(controller) {
        const node = controller.node$.deref();

        if (node) {
            this.nodeControllerMap.set(node, controller);
        }

        return ControllerRegistry;
    }

    static deregister(controller) {
        const node = controller.node$.deref();

        if (node) {
            this.nodeControllerMap.delete(node);
        }

        return ControllerRegistry;
    }

    static getController(node) {

        if (node && typeof node.deref === "function") {
            node = node.deref();
        }

        return this.nodeControllerMap.get(node);
    }
}


/***/ }),
/* 4 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "NodeManager": () => (/* binding */ NodeManager)
/* harmony export */ });
/* harmony import */ var _Porxy__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(5);


class NodeManager {

    constructor() {
        this._nodeEventListenerSetMap = new Map();
    }

    destroy() {

        for (let node$ of this._nodeEventListenerSetMap.keys()) {
            const eventListenerSet = this._nodeEventListenerSetMap.get(node$);

            for (let {eventName, eventListener} of eventListenerSet) {
                node$.removeEventListener(eventName, eventListener);
            }
        }
    }

    register(node) {

        if (node instanceof _Porxy__WEBPACK_IMPORTED_MODULE_0__.Porxy) {
            return node;
        }

        const nodeWeakRefProxy = _Porxy__WEBPACK_IMPORTED_MODULE_0__.WeakRefPorxyFactory.create(node);
        const node$ = _Porxy__WEBPACK_IMPORTED_MODULE_0__.AspectPorxyFactory.create(nodeWeakRefProxy, {
            "addEventListener": {
                "after": (eventName, eventListener) => {
                    const eventListenerSet =
                        this._nodeEventListenerSetMap.get(node$) ||
                        new Set();

                    this._nodeEventListenerSetMap.set(node$, eventListenerSet);
                    eventListenerSet.add({eventName, eventListener});
                }
            },
            "removeEventListener": {
                "after": (eventName, eventListener) => {
                    const eventListenerSet =
                        this._nodeEventListenerSetMap.get(node$);

                    if (eventListenerSet) {
                        for (let item of eventListenerSet) {
                            if (item.eventName === eventName &&
                                (
                                    item.eventListener === eventListener ||
                                    typeof eventListener === "undefined"
                                )
                            ) {
                                eventListenerSet.delete(item);
                            }
                        }
                    }
                }
            }
        });

        return node$;
    }
}

/***/ }),
/* 5 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Porxy": () => (/* binding */ Porxy),
/* harmony export */   "WeakRefPorxyFactory": () => (/* binding */ WeakRefPorxyFactory),
/* harmony export */   "AspectPorxyFactory": () => (/* binding */ AspectPorxyFactory),
/* harmony export */   "NoThrowPorxyFactory": () => (/* binding */ NoThrowPorxyFactory)
/* harmony export */ });
/**
 * Porxy is a Proxy, which we can identify as an instance of Porxy at runtime,
 * i.e.
 *
 *  const p = new Porxy({}, {});
 *  console.log(p instanceof Porxy); //--> true
 *
 * Otherwise, there is really nothing remarkable about Porxy.
 *
 * Why do we need this? If you want to find out, try doing something like this.
 *
 *  const p = new Proxy({}, {});
 *  console.log(p instanceof Proxy);
 *
 * I get an error instead of anything printed in the console when I do this.
 */
class Porxy {

    static [Symbol.hasInstance](instance) {
        return instance.prototype === Porxy;
    }

    constructor(target, handler) {
        const proxy = new Proxy(target, {
            get(target, key, receiver) {
                if (key === "prototype") {
                    return Porxy;
                }

                return handler.get(target, key, receiver);
            }
        });
        return proxy;
    }
}

class WeakRefPorxyFactory {

    static create(object) {
        return new Porxy(new WeakRef(object), {
            get(target, key, receiver) {
                const _object = target.deref();

                if (key === "deref") {
                    return () => _object;
                }

                if (_object) {
                    const value = _object[key];

                    if (typeof value === "function") {
                        return (...args) => _object[key](...args);
                    }

                    return value;
                }
            },
            set(target, key, value) {
                const _object = target.deref();

                if (_object) {
                    _object[key] = value;
                }
            }
        });
    }
}

class AspectPorxyFactory {

    static create(object, aspectHandler = {}) {
        return new Porxy(object, {
            get(target, key, receiver) {
                const value = target[key];

                if (typeof value === "function") {
                    const {before, after, around} = aspectHandler[key] || {};

                    return (...args) => {
                        let result;

                        if (typeof before === "function") {
                            before(...args);
                        }

                        if (typeof around === "function") {
                            result = around(target, key, args);
                        } else {
                            result = value.apply(target, args);
                        }

                        if (typeof after === "function") {
                            after(...args);
                        }

                        return result;
                    };
                }

                return value;
            }
        });
    }
}

class NoThrowPorxyFactory {

    static create(object, onError = noop) {
        return new Porxy(object, {
            get(target, key, receiver) {
                const value = target[key];

                if (typeof value === "function") {
                    return (...args) => {
                        try {
                            return target[key](...args);
                        } catch (e) {
                            try {
                                onError(e);
                            } catch (x) {
                                // eslint-disable-next-line no-empty
                            }
                        }
                    };
                }

                return value;
            }
        });
    }
}

function noop() {
}

/***/ }),
/* 6 */
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
/* 7 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "DOM": () => (/* binding */ DOM)
/* harmony export */ });
/* harmony import */ var _When__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(8);


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
/* 8 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "When": () => (/* binding */ When)
/* harmony export */ });
/* harmony import */ var _errors_OperationCancellationError__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(9);


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
/* 9 */
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
/* 10 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Main": () => (/* binding */ Main)
/* harmony export */ });
/* harmony import */ var _modules_Reedable_core_ui_widgets_AccordionGroup__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(11);
/* harmony import */ var _modules_Reedable_core_ui_Controller__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(2);
/* harmony import */ var _FontOverrideAccordion__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(13);
/* harmony import */ var _TextSpacingAccordion__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(15);
/* harmony import */ var _FocusIndicatorAccordion__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(16);
/* harmony import */ var _LinkInformationAccordion__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(17);








class Main extends _modules_Reedable_core_ui_Controller__WEBPACK_IMPORTED_MODULE_1__.Controller {

    constructor(node, opts) {
        super(node, opts);

        const [
            [fontOverrideAccordion],
            [textSpacingAccordion],
            [focusIndicatorAccordion],
            [linkInformationAccordion]
        ] = this.connect({
            // Since ES6, this should execute in insertion order except
            // for number like keys (which would not be a valid selector).
            "#fontOverride.Accordion": (n) => new _FontOverrideAccordion__WEBPACK_IMPORTED_MODULE_2__.FontOverrideAccordion(n),
            "#textSpacing.Accordion": (n) => new _TextSpacingAccordion__WEBPACK_IMPORTED_MODULE_3__.TextSpacingAccordion(n),
            "#focusIndicator.Accordion": (n) => new _FocusIndicatorAccordion__WEBPACK_IMPORTED_MODULE_4__.FocusIndicatorAccordion(n),
            "#linkInformation.Accordion": (n) => new _LinkInformationAccordion__WEBPACK_IMPORTED_MODULE_5__.LinkInformationAccordion(n),
            ".AccordionGroup": (n) => new _modules_Reedable_core_ui_widgets_AccordionGroup__WEBPACK_IMPORTED_MODULE_0__.AccordionGroup(n, {
                "isSinglePanelMode": true,
            }),
        });

        chrome.storage.sync.get(["reedable"], async ({reedable}) => {
            const {
                fontOverride,
                textSpacing,
                focusIndicator,
                linkInformation
            } = reedable;

            if (fontOverride && fontOverride.isExpanded) {
                await fontOverrideAccordion.expand();
            }

            if (textSpacing && textSpacing.isExpanded) {
                await textSpacingAccordion.expand();
            }

            if (focusIndicator && focusIndicator.isExpanded) {
                await focusIndicatorAccordion.expand();
            }

            if (linkInformation && linkInformation.isExpanded) {
                await linkInformationAccordion.expand();
            }
        });

        const viewPreferenceAccordionGroupNode =
            node.querySelector("#viewPreference.AccordionGroup");

        if (viewPreferenceAccordionGroupNode) {

            chrome.storage.sync.get(["reedable"], async ({reedable}) => {

                const onCollapse = (customEvent) => {
                    const target = customEvent && customEvent.target;
                    const id = target && target.id;

                    reedable[id] = reedable[id] || {};
                    reedable[id].isExpanded = false;
                    chrome.storage.sync.set({reedable});
                };

                const onExpand = (customEvent) => {
                    const target = customEvent && customEvent.target;
                    const id = target && target.id;

                    reedable[id] = reedable[id] || {};
                    reedable[id].isExpanded = true;
                    chrome.storage.sync.set({reedable});
                };

                this.$(viewPreferenceAccordionGroupNode)
                    .addEventListener("collapse", onCollapse);

                this.$(viewPreferenceAccordionGroupNode)
                    .addEventListener("expand", onExpand);
            });

        }//end of if (viewPreferenceAccordionGroupNode)
    }
}

/***/ }),
/* 11 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "AccordionGroup": () => (/* binding */ AccordionGroup)
/* harmony export */ });
/* harmony import */ var _Accordion__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(12);
/* harmony import */ var _Controller__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(2);
/* harmony import */ var _ControllerRegistry__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(3);




class AccordionGroup extends _Controller__WEBPACK_IMPORTED_MODULE_1__.Controller {

    constructor(node, opts) {
        super(node, opts);

        this.connect({
            ".Accordion": (n) => new _Accordion__WEBPACK_IMPORTED_MODULE_0__.Accordion(n)
        });

        if (opts.isSinglePanelMode) {
            this.node$.addEventListener("click", (event) => {
                this.collapseOthers(event);
            });
        }
    }

    collapseOthers(event) {
        const target = event && event.target;
        const targetAccordionNode = target && target.closest(".Accordion");
        const targetAccordion = _ControllerRegistry__WEBPACK_IMPORTED_MODULE_2__.ControllerRegistry.getController(targetAccordionNode);

        if (targetAccordion && targetAccordion.isExpanded) {
            this.node$.querySelectorAll(".Accordion").forEach((accordionNode) => {
                if (accordionNode !== targetAccordionNode) {
                    const accordion = _ControllerRegistry__WEBPACK_IMPORTED_MODULE_2__.ControllerRegistry.getController(accordionNode);

                    if (accordion.isExpanded) {
                        accordion.collapse();
                    }
                }
            });
        }
    }

    getAccordionNodeList() {
        return this.node$.querySelectorAll(".Accordion");
    }

    async collapse() {
        this.node$.querySelectorAll(".Accordion").forEach((accordionNode) => {
            const accordion = _ControllerRegistry__WEBPACK_IMPORTED_MODULE_2__.ControllerRegistry.getController(accordionNode);
            accordion.collapse();
        });
    }

    async expand() {
        this.node$.querySelectorAll(".Accordion").forEach((accordionNode, i) => {
            const accordion = _ControllerRegistry__WEBPACK_IMPORTED_MODULE_2__.ControllerRegistry.getController(accordionNode);

            if (accordion) {
                if (!this.opts.isSinglePanelMode || i === 0) {
                    accordion.expand();
                } else if (this.opts.isSinglePanelMode) {
                    accordion.collapse();
                }
            }
        });
    }
}

/***/ }),
/* 12 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Accordion": () => (/* binding */ Accordion)
/* harmony export */ });
/* harmony import */ var _Controller__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(2);


class Accordion extends _Controller__WEBPACK_IMPORTED_MODULE_0__.Controller {

    constructor(node, opts) {
        super(node, opts);

        const headerNode = node.querySelector("[aria-controls]");
        const panelNodeId = headerNode.getAttribute("aria-controls");
        const panelNode = document.getElementById(panelNodeId);

        this.$(headerNode).addEventListener("click", async (event) => {
            await this.toggle(event);
        });

        if (headerNode.getAttribute("aria-expanded") === "true") {
            panelNode.removeAttribute("hidden");
        } else {
            panelNode.setAttribute("hidden", "");
        }
    }

    get isExpanded() {
        const headerNode = this.node$.querySelector("[aria-controls]");
        return headerNode.getAttribute("aria-expanded") === "true";
    }

    get isCollapsed() {
        const headerNode = this.node$.querySelector("[aria-controls]");
        return headerNode.getAttribute("aria-expanded") === "false";
    }

    async toggle(event) {
        const target = event && event.target;
        const headerNode = target.closest("[aria-controls]");

        if (headerNode.getAttribute("aria-expanded") === "true") {
            return this.collapse();
        } else {
            return this.expand();
        }
    }

    async collapse() {
        const headerNode = this.node$.querySelector("[aria-controls]");
        const panelNodeId = headerNode.getAttribute("aria-controls");
        const panelNode = document.getElementById(panelNodeId);

        headerNode.setAttribute("aria-expanded", "false");
        panelNode.setAttribute("hidden", "");

        this.node$.dispatchEvent(new CustomEvent("collapse", {
            "bubbles": true
        }));

        return this.node$;
    }

    async expand() {
        const headerNode = this.node$.querySelector("[aria-controls]");
        const panelNodeId = headerNode.getAttribute("aria-controls");
        const panelNode = document.getElementById(panelNodeId);

        headerNode.setAttribute("aria-expanded", "true");
        panelNode.removeAttribute("hidden");


        this.node$.dispatchEvent(new CustomEvent("expand", {
            "bubbles": true
        }));

        return this.node$;
    }
}

/***/ }),
/* 13 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "FontOverrideAccordion": () => (/* binding */ FontOverrideAccordion)
/* harmony export */ });
/* harmony import */ var _modules_Reedable_core_ui_widgets_Accordion__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(12);
/* harmony import */ var _modules_Reedable_core_Debounce__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(14);



class FontOverrideAccordion extends _modules_Reedable_core_ui_widgets_Accordion__WEBPACK_IMPORTED_MODULE_0__.Accordion {

    constructor(node, opts) {
        super(node, opts);

        const isEnabledCheckbox = node.querySelector("#fontOverride-isEnabled");
        const fontSizeMinInput = node.querySelector("#fontOverride-fontSizeMin");
        const fontSizeMagInput = node.querySelector("#fontOverride-fontSizeMag");
        const fontFamilyInput = node.querySelector("#fontOverride-fontFamily");

        const onChangeCheckbox = _modules_Reedable_core_Debounce__WEBPACK_IMPORTED_MODULE_1__.Debounce.trailing(async () => {
            if (isEnabledCheckbox.checked) {
                await this.start();
            } else {
                await this.stop();
            }
        }, 400);

        const onChangeInput = _modules_Reedable_core_Debounce__WEBPACK_IMPORTED_MODULE_1__.Debounce.trailing(async () => {
            chrome.storage.sync.get(["fontOverride"], async ({fontOverride}) => {
                chrome.storage.sync.set({
                    "fontOverride": Object.assign(fontOverride, {
                        "fontSizeMin": fontSizeMinInput.value,
                        "fontSizeMag": fontSizeMagInput.value,
                        "fontFamily": fontFamilyInput.value
                    })
                });

                await onChangeCheckbox();
            });
        }, 400);

        this.$(isEnabledCheckbox).addEventListener("change", onChangeCheckbox);
        this.$(fontSizeMinInput).addEventListener("input", onChangeInput);
        this.$(fontSizeMagInput).addEventListener("input", onChangeInput);
        this.$(fontFamilyInput).addEventListener("input", onChangeInput);

        chrome.storage.sync.get(["fontOverride"], ({fontOverride}) => {
            isEnabledCheckbox.checked = fontOverride.isEnabled;
            fontSizeMinInput.value = fontOverride.fontSizeMin;
            fontSizeMagInput.value = fontOverride.fontSizeMag;
            fontFamilyInput.value = fontOverride.fontFamily;
        });
    }

    async start() {
        const [tab] = await chrome.tabs.query({
            "active": true,
            "currentWindow": true
        });

        chrome.scripting.executeScript({
            "target": {"tabId": tab.id},
            "func": function () {
                // See ../content/content.js
                // eslint-disable-next-line no-undef
                Reedable.FontOverrideEngine.getInstance().start(document);
            }
        });

        chrome.storage.sync.get(["fontOverride"], (pref) => {
            pref.fontOverride.isEnabled = true;
            chrome.storage.sync.set(pref);
        });
    }

    async stop() {
        const [tab] = await chrome.tabs.query({
            "active": true,
            "currentWindow": true
        });

        chrome.scripting.executeScript({
            "target": {"tabId": tab.id},
            "func": function () {
                // See ../content/content.js
                // eslint-disable-next-line no-undef
                Reedable.FontOverrideEngine.getInstance().stop(document);
            }
        });

        chrome.storage.sync.get(["fontOverride"], (pref) => {
            pref.fontOverride.isEnabled = false;
            chrome.storage.sync.set(pref);
        });
    }
}

/***/ }),
/* 14 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Debounce": () => (/* binding */ Debounce)
/* harmony export */ });
/**
 * Provides function debouncing.
 *
 * Usage
 * =====
 *
 *  import {Debounce} from "./Debounce";
 *
 *  const debouncedFn = Debounce.trailing(() => {
 *      console.log("Hello");
 *  });
 *
 *  for (var i = 0; i < 1000000; i++) {
 *      debouncedFn();
 *  }
 *
 * In above example, even though we call the debouncedFn in
 * a tight loop, we only print "Hello" once at the very end.
 * This is because each successive call is executed well below
 * the 400ms threshold (default delay).
 *
 *
 * Function execution timing
 * =========================
 *
 * Debouncing will reduce a large number of successive calls, and
 * only when there is a sufficiently large break in the activity
 * (specified by the delay parameter) that we execute the actual
 * function call.
 *
 * Debounce.leading and Debounce.trailing are similar, but they key
 * difference is that Debounce.leading will execute the first of the
 * successive call to the debounced function, whereas the
 *
 * Consider the following hypothetical scenarios. The user calls
 * the same function in three bursts. Five times in the first series,
 * followed by three in the second series, and seven times in the
 * third series, with enough pause in between to clear the delay.
 *
 * Each broken pipe represents a function call. The ones with an
 * arrow below are the calls that are executed.
 *
 *
 * Debounce.leading
 * ----------------
 *
 *  First call in each series is executed immediately.
 *
 *  || ||| <--delay--> || | <--delay--> |||||||
 *  ^                  ^                ^
 *  |                  |                |
 *  |                  |                |
 *  |                  |                |
 *
 *
 * Debounce.trailing
 * -----------------
 *
 *  Last call in each series is executed after a period of delay.
 *
 *  || ||| <--delay--> || | <--delay--> ||||||| <--delay-->
 *       ^                ^                   ^
 *       |                |                   |
 *       +------------+   +------------+      +------------+
 *                    |                |                   |
 *
 */
class Debounce {

    static leading(...args) {
        return leading(...args);
    }

    static trailing(...args) {
        return trailing(...args);
    }
}

function noop() {
}

function leading(fn = noop, delay = 400) {
    let ts = 0;
    let promise;

    return function () {
        const _this = this;
        const _args = arguments;

        if (Date.now() - ts > delay) {
            promise = new Promise((resolve) => {
                resolve(fn.apply(_this, _args));
            });
        }

        ts = Date.now();

        return promise;
    };
}

function trailing(fn = noop, delay = 400) {
    let tid;
    let promise;
    let done;
    let _this = null;
    let _args = null;

    return function () {
        _this = this;
        _args = arguments;

        if (promise) {
            clearTimeout(tid);
            tid = setTimeout(done, delay);
            return promise;
        }

        promise = new Promise((resolve) => {
            done = resolve;
            tid = setTimeout(done, delay);
        }).then(() => {
            promise = null;
            return fn.apply(_this, _args);
        });

        return promise;
    };
}


/***/ }),
/* 15 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "TextSpacingAccordion": () => (/* binding */ TextSpacingAccordion)
/* harmony export */ });
/* harmony import */ var _modules_Reedable_core_ui_widgets_Accordion__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(12);
/* harmony import */ var _modules_Reedable_core_Debounce__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(14);



class TextSpacingAccordion extends _modules_Reedable_core_ui_widgets_Accordion__WEBPACK_IMPORTED_MODULE_0__.Accordion {

    constructor(node, opts) {
        super(node, opts);

        const isEnabledCheckbox = node.querySelector("#textSpacing-isEnabled");
        const lineHeightInput = node.querySelector("#textSpacing-lineHeight");
        const afterParagraphInput = node.querySelector("#textSpacing-afterParagraph");
        const letterSpacingInput = node.querySelector("#textSpacing-letterSpacing");
        const wordSpacingInput = node.querySelector("#textSpacing-wordSpacing");

        const onChangeCheckbox = _modules_Reedable_core_Debounce__WEBPACK_IMPORTED_MODULE_1__.Debounce.trailing(async () => {
            if (isEnabledCheckbox.checked) {
                await this.start();
            } else {
                await this.stop();
            }
        }, 400);

        const onChangeInput = _modules_Reedable_core_Debounce__WEBPACK_IMPORTED_MODULE_1__.Debounce.trailing(async () => {
            chrome.storage.sync.get(["textSpacing"], async ({textSpacing}) => {
                chrome.storage.sync.set({
                    "textSpacing": Object.assign(textSpacing, {
                        "lineHeight": lineHeightInput.value,
                        "afterParagraph": afterParagraphInput.value,
                        "letterSpacing": letterSpacingInput.value,
                        "wordSpacing": wordSpacingInput.value
                    })
                });

                await onChangeCheckbox();
            });
        }, 400);

        this.$(isEnabledCheckbox).addEventListener("change", onChangeCheckbox);
        this.$(lineHeightInput).addEventListener("input", onChangeInput);
        this.$(afterParagraphInput).addEventListener("input", onChangeInput);
        this.$(letterSpacingInput).addEventListener("input", onChangeInput);
        this.$(wordSpacingInput).addEventListener("input", onChangeInput);

        chrome.storage.sync.get(["textSpacing"], ({textSpacing}) => {
            isEnabledCheckbox.checked = textSpacing.isEnabled;
            lineHeightInput.value = textSpacing.lineHeight;
            afterParagraphInput.value = textSpacing.afterParagraph;
            letterSpacingInput.value = textSpacing.letterSpacing;
            wordSpacingInput.value = textSpacing.wordSpacing;
        });
    }

    async start() {
        const [tab] = await chrome.tabs.query({
            "active": true,
            "currentWindow": true
        });

        chrome.scripting.executeScript({
            "target": {"tabId": tab.id},
            "func": function () {
                // See ../content/content.js
                // eslint-disable-next-line no-undef
                Reedable.TextSpacingEngine.getInstance().start(document);
            }
        });

        chrome.storage.sync.get(["textSpacing"], (pref) => {
            pref.textSpacing.isEnabled = true;
            chrome.storage.sync.set(pref);
        });
    }

    async stop() {
        const [tab] = await chrome.tabs.query({
            "active": true,
            "currentWindow": true
        });

        chrome.scripting.executeScript({
            "target": {"tabId": tab.id},
            "func": function () {
                // See ../content/content.js
                // eslint-disable-next-line no-undef
                Reedable.TextSpacingEngine.getInstance().stop(document);
            }
        });

        chrome.storage.sync.get(["textSpacing"], (pref) => {
            pref.textSpacing.isEnabled = false;
            chrome.storage.sync.set(pref);
        });
    }
}

/***/ }),
/* 16 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "FocusIndicatorAccordion": () => (/* binding */ FocusIndicatorAccordion)
/* harmony export */ });
/* harmony import */ var _modules_Reedable_core_ui_widgets_Accordion__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(12);
/* harmony import */ var _modules_Reedable_core_Debounce__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(14);



class FocusIndicatorAccordion extends _modules_Reedable_core_ui_widgets_Accordion__WEBPACK_IMPORTED_MODULE_0__.Accordion {

    constructor(node, opts) {
        super(node, opts);

        const isEnabledCheckbox = node.querySelector("#focusIndicator-isEnabled");
        const boxShadowInput = node.querySelector("#focusIndicator-boxShadow");
        const borderRadiusInput = node.querySelector("#focusIndicator-borderRadius");
        const transitionInput = node.querySelector("#focusIndicator-transition");

        const onChangeCheckbox = _modules_Reedable_core_Debounce__WEBPACK_IMPORTED_MODULE_1__.Debounce.trailing(async () => {
            if (isEnabledCheckbox.checked) {
                await this.start();
            } else {
                await this.stop();
            }
        }, 400);

        const onChangeInput = _modules_Reedable_core_Debounce__WEBPACK_IMPORTED_MODULE_1__.Debounce.trailing(async () => {
            chrome.storage.sync.get(["focusIndicator"], async ({focusIndicator}) => {
                chrome.storage.sync.set({
                    "focusIndicator": Object.assign(focusIndicator, {
                        "boxShadow": boxShadowInput.value,
                        "borderRadius": borderRadiusInput.value,
                        "transition": transitionInput.value
                    })
                });

                await onChangeCheckbox();
            });
        }, 400);

        this.$(isEnabledCheckbox).addEventListener("change", onChangeCheckbox);
        this.$(boxShadowInput).addEventListener("input", onChangeInput);
        this.$(borderRadiusInput).addEventListener("input", onChangeInput);
        this.$(transitionInput).addEventListener("input", onChangeInput);

        chrome.storage.sync.get(["focusIndicator"], ({focusIndicator}) => {
            isEnabledCheckbox.checked = focusIndicator.isEnabled;
            boxShadowInput.value = focusIndicator.boxShadow;
            borderRadiusInput.value = focusIndicator.borderRadius;
            transitionInput.value = focusIndicator.transition;
        });
    }

    async start() {
        const [tab] = await chrome.tabs.query({
            "active": true,
            "currentWindow": true
        });

        chrome.scripting.executeScript({
            "target": {"tabId": tab.id},
            "func": function () {
                // See ../content/content.js
                // eslint-disable-next-line no-undef
                Reedable.FocusIndicatorEngine.getInstance().start(document);
            }
        });

        chrome.storage.sync.get(["focusIndicator"], (pref) => {
            pref.focusIndicator.isEnabled = true;
            chrome.storage.sync.set(pref);
        });
    }

    async stop() {
        const [tab] = await chrome.tabs.query({
            "active": true,
            "currentWindow": true
        });

        chrome.scripting.executeScript({
            "target": {"tabId": tab.id},
            "func": function () {
                // See ../content/content.js
                // eslint-disable-next-line no-undef
                Reedable.FocusIndicatorEngine.getInstance().stop(document);
            }
        });

        chrome.storage.sync.get(["focusIndicator"], (pref) => {
            pref.focusIndicator.isEnabled = false;
            chrome.storage.sync.set(pref);
        });
    }
}

/***/ }),
/* 17 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "LinkInformationAccordion": () => (/* binding */ LinkInformationAccordion)
/* harmony export */ });
/* harmony import */ var _modules_Reedable_core_ui_widgets_Accordion__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(12);
/* harmony import */ var _modules_Reedable_core_Debounce__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(14);



class LinkInformationAccordion extends _modules_Reedable_core_ui_widgets_Accordion__WEBPACK_IMPORTED_MODULE_0__.Accordion {

    constructor(node, opts) {

        super(node, opts);

        const isEnabledCheckbox = node.querySelector("#linkInformation-isEnabled");
        const showTitleCheckbox = node.querySelector("#linkInformation-showTitle");
        const showIconCheckbox = node.querySelector("#linkInformation-showIcon");

        const onChangeCheckbox = _modules_Reedable_core_Debounce__WEBPACK_IMPORTED_MODULE_1__.Debounce.trailing(async () => {
            if (isEnabledCheckbox.checked) {
                await this.start();
            } else {
                await this.stop();
            }
        }, 400);

        const onChangeInput = _modules_Reedable_core_Debounce__WEBPACK_IMPORTED_MODULE_1__.Debounce.trailing(async () => {
            chrome.storage.sync.get(["linkInformation"], async ({ linkInformation }) => {
                chrome.storage.sync.set({
                    "linkInformation": Object.assign(linkInformation, {
                        "showTitle": showTitleCheckbox.checked,
                        "showIcon": showIconCheckbox.checked
                    })
                });

                await onChangeCheckbox();
            });
        }, 400);

        this.$(isEnabledCheckbox).addEventListener("change", onChangeCheckbox);
        this.$(showTitleCheckbox).addEventListener("change", onChangeInput);
        this.$(showIconCheckbox).addEventListener("change", onChangeInput);

        chrome.storage.sync.get(["linkInformation"], ({ linkInformation }) => {
            isEnabledCheckbox.checked = linkInformation.isEnabled;
            showTitleCheckbox.checked = linkInformation.showTitle;
            showIconCheckbox.checked = linkInformation.showIcon;
        });
    }

    async start() {

        const [tab] = await chrome.tabs.query({
            "active": true,
            "currentWindow": true
        });

        chrome.scripting.executeScript({
            "target": { "tabId": tab.id },
            "func": function () {
                // See ../content/content.js
                // eslint-disable-next-line no-undef
                Reedable.LinkInformationEngine.getInstance().start(document);
            }
        });

        chrome.storage.sync.get(["linkInformation"], (pref) => {
            pref.linkInformation.isEnabled = true;
            chrome.storage.sync.set(pref);
        });
    }

    async stop() {

        const [tab] = await chrome.tabs.query({
            "active": true,
            "currentWindow": true
        });

        chrome.scripting.executeScript({
            "target": { "tabId": tab.id },
            "func": function () {
                // See ../content/content.js
                // eslint-disable-next-line no-undef
                Reedable.LinkInformationEngine.getInstance().stop(document);
            }
        });

        chrome.storage.sync.get(["linkInformation"], (pref) => {
            pref.linkInformation.isEnabled = false;
            chrome.storage.sync.set(pref);
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
/* harmony import */ var _modules_Reedable_core_ui_App__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(1);
/* harmony import */ var _Main__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(10);



const app = new _modules_Reedable_core_ui_App__WEBPACK_IMPORTED_MODULE_0__.App(document);

app.start({
    "main": (n) => new _Main__WEBPACK_IMPORTED_MODULE_1__.Main(n)
});
})();

/******/ })()
;