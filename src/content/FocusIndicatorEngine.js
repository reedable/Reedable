import {Engine} from "../../modules/Reedable-core/content/Engine";
import {DOM} from "../../modules/Reedable-core/ui/DOM";

export class FocusIndicatorEngine extends Engine {

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
        await DOM.when(documentFragment).ready;
        this._onFocusIn = this._onFocusIn.bind(this);
        documentFragment.addEventListener("focusin", this._onFocusIn);
        documentFragment.querySelectorAll("*").forEach((node) => {
            if (node.shadowRoot) {
                this.start(node.shadowRoot);
            }
        });
    }

    async stop(documentFragment) {
        await DOM.when(documentFragment).ready;
        documentFragment.removeEventListener("focusin", this._onFocusIn);
        documentFragment.querySelectorAll("*").forEach((node) => {
            if (node.shadowRoot) {
                this.stop(node.shadowRoot);
            }
        });
    }
}