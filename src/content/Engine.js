window.Reedable = window.Reedable || {};

Reedable.Engine = Reedable.Engine || (function (
    {
        DOM,
    },
) {

    function Engine(engineName) {
        this.engineName = engineName;
        this.observers = new WeakMap();
    }

    Object.assign(Engine.prototype, {
        start,
        _start,
        _createObserver,
        _processNodes,
        _processNode,
        stop,
        _stop,
        _restoreNode,
    });

    function start(doc) {

        if (doc.body) {
            this._start(doc);
        } else {
            doc.addEventListener("DOMContentLoaded", () => {
                this._start(doc);
            });
        }

        chrome.storage.sync.get([this.engineName], (pref) => {
            pref[this.engineName].isEnabled = true;
            chrome.storage.sync.set(pref);
        });
    }

    function _start(documentFragment) {
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
            "subtree": true,
        });

        this._processNodes(documentFragment.querySelectorAll("*"));
    }

    function _createObserver(callback) {
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

    function _processNodes(nodeList) {
        chrome.storage.sync.get([this.engineName], (pref) => {
            nodeList.forEach((node) => {

                if (node.nodeType === Node.ELEMENT_NODE) {
                    if (DOM.getText(node)) {
                        this._processNode(node, pref[this.engineName]);
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
    async function _processNode(node, enginePref) {
        throw new Error("unsupported operation");
    }

    function stop(doc) {

        if (doc.body) {
            this._stop(doc);
        } else {
            doc.addEventListener("DOMContentLoaded", () => {
                this._stop(doc);
            });
        }

        chrome.storage.sync.get([this.engineName], (pref) => {
            pref[this.engineName].isEnabled = false;
            chrome.storage.sync.set(pref);
        });
    }

    function _stop(documentFragment) {
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
    async function _restoreNode(node) {
        throw new Error("unsupported operation");
    }

    return Engine;

})(Reedable);
