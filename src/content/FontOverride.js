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
        chrome.storage.sync.get(["fontOverride"], ({fontOverride}) => {
            nodeList.forEach((node) => {

                if (node.nodeType === Node.ELEMENT_NODE) {
                    if (Reedable.DOM.getText(node)) {
                        processNode(node, fontOverride);
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
                const fontSizeMinPx = Reedable.DOM.parseSize(
                    FontOverride.fontSizeMin, computedStyle);
                let reedableFontSizeMag = node.dataset.reedableFontSizeMag;
                let fontSizeTargetPx;

                if (!reedableFontSizeMag) {
                    const reedableFontSizeMagNode =
                        node.closest("[data-reedable-font-size-mag]");

                    if (reedableFontSizeMagNode) {
                        reedableFontSizeMag =
                            reedableFontSizeMagNode.dataset.reedableFontSizeMag;
                    } else {
                        node.dataset.reedableFontSizeMag = FontOverride.fontSizeMag;
                    }
                }

                if (reedableFontSizeMag !== FontOverride.fontSizeMag) {
                    fontSizeTargetPx =
                        parseFloat(computedFontSize) *
                        Number(FontOverride.fontSizeMag) / 100;

                    node.dataset.reedableFontSizeMag =
                        FontOverride.fontSizeMag;
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

                if (computedFontFamily !== FontOverride.fontFamily) {
                    return FontOverride.fontFamily;
                }

                return "";
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

        documentFragment.querySelectorAll("*").forEach((node) => {
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
            let style = doc.querySelector("#reedable-FontOverride");

            if (!style) {
                style = doc.createElement("style");
                style.id = "reedable-FontOverride";
                style.appendChild(doc.createTextNode(FONT_FACE_CSS));
                (doc.head || doc).appendChild(style);
            }

            if (doc.body) {
                _start(doc);
            } else {
                doc.addEventListener("DOMContentLoaded", () => _start(doc));
            }

            chrome.storage.sync.get(["fontOverride"], ({fontOverride}) => {
                fontOverride.isEnabled = true;
                chrome.storage.sync.set({fontOverride});
            });
        },
        "stop": function (doc) {
            const style = doc.querySelector("#reedable-FontOverride");

            if (style) {
                style.remove();
            }

            if (doc.body) {
                _stop(doc);
            } else {
                doc.addEventListener("DOMContentLoaded", () => _stop(doc));
            }

            chrome.storage.sync.get(["fontOverride"], ({fontOverride}) => {
                fontOverride.isEnabled = false;
                chrome.storage.sync.set({fontOverride});
            });
        },
    };
})();