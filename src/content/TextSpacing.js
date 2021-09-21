window.Reedable = window.Reedable || {};

Reedable.TextSpacing = Reedable.TextSpacing || (function () {
    "use strict";

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
        chrome.storage.sync.get(["textSpacing"], ({textSpacing}) => {
            nodeList.forEach((node) => {

                if (node.nodeType === Node.ELEMENT_NODE) {
                    if (Reedable.DOM.getText(node)) {
                        processNode(node, textSpacing);
                    }
                }

                if (node.shadowRoot) {
                    _start(node.shadowRoot);
                }
            });
        });
    }

    async function processNode(node, TextSpacing) {
        const {
            reedableLineHeight,
            reedableMarginBottom,
            reedableLetterSpacing,
            reedableWordSpacing,
            reedableTextAlign,
        } = node.dataset;

        if (typeof reedableLineHeight !== "undefined" ||
            typeof reedableMarginBottom !== "undefined" ||
            typeof reedableLetterSpacing !== "undefined" ||
            typeof reedableWordSpacing !== "undefined" ||
            typeof reedableTextAlign !== "undefined") {

            await restoreNode(node);
        }

        return (async () => {
            const {
                lineHeight,
                marginBottom,
                letterSpacing,
                wordSpacing,
                textAlign,
            } = node.style;

            const computedStyle = getComputedStyle(node);
            const computedFontSize = computedStyle.fontSize || "";

            function getLineHeight() {
                const computedLineHeight = computedStyle.lineHeight || "";

                if (computedLineHeight === "normal") {
                    return Reedable.DOM.parseSize(
                        TextSpacing.lineHeight, computedStyle);
                }

                const estimatedLineHeight =
                    parseFloat(computedLineHeight) /
                    parseFloat(computedFontSize);

                if (estimatedLineHeight < TextSpacing.lineHeight) {
                    return TextSpacing.lineHeight;
                }
            }

            function getMarginBottom() {
                // FIXME Are there non-semantic way to mark-up paragraphs?
                if (node.tagName === "P") {
                    const computedMarginBottom = computedStyle.marginBottom;

                    if (parseFloat(computedMarginBottom) <
                        Reedable.DOM.parseSize(
                            TextSpacing.afterParagraph,
                            computedStyle)) {

                        return TextSpacing.afterParagraph;
                    }
                }
            }

            function getLetterSpacing() {
                const computedLetterSpacing = computedStyle.letterSpacing;

                if (computedLetterSpacing === "normal") {
                    return TextSpacing.letterSpacing;
                }

                const estimatedLetterSpacing =
                    parseFloat(computedLetterSpacing) /
                    parseFloat(computedFontSize);

                if (estimatedLetterSpacing <
                    Reedable.DOM.parseSize(
                        TextSpacing.letterSpacing,
                        computedStyle)) {

                    return TextSpacing.letterSpacing;
                }
            }

            function getWordSpacing() {
                const computedWordSpacing = computedStyle.wordSpacing;

                if (computedWordSpacing === "normal") {
                    return TextSpacing.wordSpacing;
                }

                const computedFontSize = computedStyle.fontSize;
                const estimatedLetterSpacing =
                    parseFloat(computedWordSpacing) /
                    parseFloat(computedFontSize);

                if (estimatedLetterSpacing <
                    Reedable.DOM.parseSize(
                        TextSpacing.wordSpacing,
                        computedStyle)) {

                    return TextSpacing.wordSpacing;
                }
            }

            node.dataset.reedableLineHeight = lineHeight;
            node.dataset.reedableMarginBottom = marginBottom;
            node.dataset.reedableLetterSpacing = letterSpacing;
            node.dataset.reedableWordSpacing = wordSpacing;
            node.dataset.reedableTextAlign = textAlign;

            // Apply the value only if it exceeds the computed value.
            node.style.lineHeight = getLineHeight();
            node.style.marginBottom = getMarginBottom();
            node.style.letterSpacing = getLetterSpacing();
            node.style.wordSpacing = getWordSpacing();
            node.style.textAlign = TextSpacing.textAlign || "inherit";
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
                reedableLineHeight,
                reedableMarginBottom,
                reedableLetterSpacing,
                reedableWordSpacing,
                reedableTextAlign,
            } = node.dataset;

            delete node.dataset.reedableLineHeight;
            delete node.dataset.reedableMarginBottom;
            delete node.dataset.reedableLetterSpacing;
            delete node.dataset.reedableWordSpacing;
            delete node.dataset.reedableTextAlign;

            node.style.lineHeight = reedableLineHeight || "";
            node.style.marginBottom = reedableMarginBottom || "";
            node.style.letterSpacing = reedableLetterSpacing || "";
            node.style.wordSpacing = reedableWordSpacing || "";
            node.style.textAlign = reedableTextAlign || "";
        })();
    }

    return {
        "start": function (doc) {

            if (doc.body) {
                _start(doc);
            } else {
                doc.addEventListener("DOMContentLoaded", () => _start(doc));
            }

            chrome.storage.sync.get(["textSpacing"], ({textSpacing}) => {
                textSpacing.isEnabled = true;
                chrome.storage.sync.set({textSpacing});
            });
        },
        "stop": function (doc) {

            if (doc.body) {
                _stop(doc);
            } else {
                doc.addEventListener("DOMContentLoaded", () => _stop(doc));
            }

            chrome.storage.sync.get(["textSpacing"], ({textSpacing}) => {
                textSpacing.isEnabled = false;
                chrome.storage.sync.set({textSpacing});
            });
        },
    };
})();