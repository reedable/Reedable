window.Reedable = window.Reedable || {};

Reedable.FontOverride = Reedable.FontOverride || (function () {
    "use strict";

    // manifest.js web_accessible_resources
    // https://developer.chrome.com/docs/extensions/reference/i18n/
    const FONT_FACE_CSS = `
@font-face {
    font-family: "OpenDyslexic Regular";
    src: url("chrome-extension://${chrome.runtime.id}/font/OpenDyslexic-Regular.otf");
}
`;

    const observers = new WeakMap();

    function _start(documentFragment) {
        let observer = observers.get(documentFragment);

        if (!observer) {
            observer = createObserver(documentFragment, processNodes);
            observers.set(documentFragment, observer);
        }

        observer.observe(documentFragment, {
            "attributes": false,
            "childList": true,
            "subtree": true,
        });

        processNodes(documentFragment.querySelectorAll("*"));
    }

    function createObserver(doc, processNodes) {
        return new MutationObserver((mutationList) => {
            for (let i = 0; i < mutationList.length; i++) {
                const mutation = mutationList[i];

                if (mutation.type === "childList") {
                    processNodes(mutation.addedNodes);
                }
            }
        });
    }

    function processNodes(nodeList) {
        chrome.storage.sync.get(["FontOverride"], ({FontOverride}) => {
            nodeList.forEach(node => {

                if (node.nodeType === Node.ELEMENT_NODE) {
                    if (Reedable.DOM.getText(node)) {
                        processNode(node, FontOverride);
                    }
                }

                if (node.shadowRoot) {
                    _start(node.shadowRoot);
                }
            });
        });
    }

    async function processNode(node, FontOverride) {
        const {
            reedableFontSize,
            reedableFontFamily,
        } = node.dataset;

        if (typeof reedableFontSize !== "undefined" ||
            typeof reedableFontFamily !== "undefined") {

            await restoreNode(node);
        }

        return (async () => {
            const {
                fontSize,
                fontFamily,
            } = node.style;

            const computedStyle = getComputedStyle(node);
            const computedFontSize = computedStyle.fontSize || "";

            function getFontSize() {
                const targetFontSizePx =
                    parseFloat(computedFontSize) *
                    Number(FontOverride.fontSizeMag) / 100;

                const fontSizeMinPx =
                    Reedable.DOM.parseSize(
                        FontOverride.fontSizeMin,
                        computedStyle);

                if (targetFontSizePx < fontSizeMinPx) {
                    return [fontSizeMinPx, "px"].join("");
                }

                return [targetFontSizePx, "px"].join("");
            }

            function getFontFamily() {
                const computedFontFamily = computedStyle.fontFamily;

                if (computedFontFamily !== FontOverride.fontFamily) {
                    return FontOverride.fontFamily;
                }
            }

            node.dataset.reedableFontSize = fontSize;
            node.dataset.reedableFontFamily = fontFamily;

            node.style.fontSize = getFontSize();
            node.style.fontFamily = getFontFamily();
        })();
    }

    function _stop(documentFragment) {
        const observer = observers.get(documentFragment);

        if (observer) {
            observer.disconnect();
            observers.delete(documentFragment);
        }

        documentFragment.querySelectorAll("*").forEach(node => {
            restoreNode(node);

            if (node.shadowRoot) {
                _stop(node.shadowRoot);
            }
        });
    }

    async function restoreNode(node) {
        return (async () => {
            const {
                reedableFontSize,
                reedableFontFamily,
            } = node.dataset;

            delete node.dataset.reedableFontSize;
            delete node.dataset.reedableFontFamily;

            node.style.fontSize = reedableFontSize || "";
            node.style.fontFamily = reedableFontFamily || "";
        })();
    }

    return {
        "start": function (doc) {
            let style = doc.querySelector("#Reedable-FontOverride");

            if (!style) {
                style = doc.createElement("style");
                style.id = "Reedable-FontOverride";
                style.appendChild(doc.createTextNode(FONT_FACE_CSS));
                (doc.head || doc).appendChild(style);
            }

            if (doc.body) {
                _start(doc);
            } else {
                doc.addEventListener("DOMContentLoaded", () => _start(doc));
            }

            chrome.storage.sync.get(["FontOverride"], ({FontOverride}) => {
                FontOverride.isEnabled = true;
                chrome.storage.sync.set({FontOverride});
            });
        },
        "stop": function (doc) {
            const style = doc.querySelector("#Reedable-FontOverride");

            if (style) {
                style.remove();
            }

            if (doc.body) {
                _stop(doc);
            } else {
                doc.addEventListener("DOMContentLoaded", () => _stop(doc));
            }

            chrome.storage.sync.get(["FontOverride"], ({FontOverride}) => {
                FontOverride.isEnabled = false;
                chrome.storage.sync.set({FontOverride});
            });
        },
    };
})();