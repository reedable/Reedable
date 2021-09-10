window.Reedable = window.Reedable || {};

Reedable.DOM = Reedable.DOM || (function () {
    "use strict";

    const computedRem = getComputedStyle(document.documentElement).fontSize || "";

    function getText(node) {
        const textContents = new Array(node.childNodes.length);

        node.childNodes.forEach(function (node) {
            if (node.nodeType === node.TEXT_NODE) {
                textContents.push(node.textContent);
            }
        });

        return textContents.join("")
            .replace(/[\r\t]/g, " ")
            .replace(/\s+/g, " ");
    }

    function parseSize(string, node) {
        return parseAbsoluteSize(string) ||
            parseRelativeSize(string, node) ||
            parseFloat(string);
    }

    /**
     * Convert absolute measurements into px
     */
    function parseAbsoluteSize(string) {
        string = string || "";

        if (string.endsWith("rem")) {
            return parseFloat(string) * parseFloat(computedRem);
        } else if (string.endsWith("pt")) {
            return parseFloat(string) / 0.75;
        }
    }

    /**
     * Convert relative measurements into px
     */
    function parseRelativeSize(string, computedStyle) {
        if (computedStyle) {
            const computedFontSize = computedStyle.fontSize || "";

            if (string.endsWith("em")) {
                return parseFloat(string) * parseFloat(computedFontSize);
            }
        }
    }

    return {parseSize, getText};
})();