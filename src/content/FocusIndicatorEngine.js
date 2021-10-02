window.Reedable = window.Reedable || {};

Reedable.FocusIndicatorEngine = Reedable.FocusIndicatorEngine || (function (
    {
        Engine,
    },
) {

    class FocusIndicatorEngine extends Engine {

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
                outline,
            } = node.style;

            node.dataset.reedableBorderRadius = borderRadius;
            node.dataset.reedableBoxShadow = boxShadow;
            node.dataset.reedableTransition = transition;
            node.dataset.reedableOutline = outline;

            this._onFocusOut = onFocusOut.bind(this);

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
                reedableOutline,
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

        _start(documentFragment) {
            this._onFocusIn = onFocusIn.bind(this);
            documentFragment.addEventListener("focusin", this._onFocusIn);
            documentFragment.querySelectorAll("*").forEach((node) => {
                if (node.shadowRoot) {
                    this._start(node.shadowRoot);
                }
            });
        }

        _stop(documentFragment) {
            documentFragment.removeEventListener("focusin", this._onFocusIn);
            documentFragment.querySelectorAll("*").forEach((node) => {
                if (node.shadowRoot) {
                    this._stop(node.shadowRoot);
                }
            });
        }
    }

    return FocusIndicatorEngine;

})(Reedable);