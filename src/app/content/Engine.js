import {DOM} from "../../core/ui/DOM";
import {UnsupportedOperationError} from "../../core/errors/UnsupportedOperationError";

export class Engine {

    constructor(engineName) {
        this.engineName = engineName;
        this.observers = new WeakMap();
    }

    async start(doc = document) {
        await DOM.when(doc).ready;
        this._start(doc);

        chrome.storage.sync.get([this.engineName], (pref) => {
            pref[this.engineName].isEnabled = true;
            chrome.storage.sync.set(pref);
        });
    }

    _start(documentFragment = document) {
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

    _processNodes(nodeList) {
        chrome.storage.sync.get([this.engineName], (pref = {}) => {
            (nodeList || []).forEach((node) => {

                if (node.nodeType === Node.ELEMENT_NODE) {
                    if (DOM.getText(node)) {
                        try {
                            this._processNode(node, pref[this.engineName]);
                        } catch (e) {
                            console.debug(e);
                        }
                    }
                }

                if (node.shadowRoot) {
                    this._start(node.shadowRoot);
                }
            });
        });
    }

    /**
     * Implementation must be provided by the sub-classes.
     */
    async _processNode(node, enginePref) {
        throw new UnsupportedOperationError("Engine._processNode", node, enginePref);
    }

    async stop(doc) {
        await DOM.when(doc).ready;
        this._stop(doc);

        chrome.storage.sync.get([this.engineName], (pref) => {
            pref[this.engineName].isEnabled = false;
            chrome.storage.sync.set(pref);
        });
    }

    _stop(documentFragment = document) {
        const observer = this.observers.get(documentFragment);

        if (observer) {
            observer.disconnect();
            this.observers.delete(documentFragment);
        }

        documentFragment.querySelectorAll("*").forEach((node) => {
            this._restoreNode(node);

            if (node.shadowRoot) {
                this._stop(node.shadowRoot);
            }
        });
    }

    /**
     * Implementation must be provided by the sub-classes.
     */
    async _restoreNode(node) {
        throw new UnsupportedOperationError("Engine._restoreNode", node);
    }
}