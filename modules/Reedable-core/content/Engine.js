import {DOM} from "../ui/DOM";
import {UnsupportedOperationError} from "../errors/UnsupportedOperationError";
import {Sync} from "../Storage";

export class Engine {

    constructor(engineName) {
        this.engineName = engineName;
        this.observers = new WeakMap();
    }

    async start(documentFragment = document) {
        await DOM.when(documentFragment).ready;
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
        await DOM.when(documentFragment).ready;
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
        return (node.nodeType === Node.ELEMENT_NODE && DOM.getText(node));
    }

    async _processNodes(nodeList) {
        const pref = await Sync.get(this.engineName);

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
        throw new UnsupportedOperationError("Engine._processNode");
    }

    /**
     * Implementation must be provided by the sub-classes.
     */
    async _restoreNode(node) {
        throw new UnsupportedOperationError("Engine._restoreNode");
    }
}