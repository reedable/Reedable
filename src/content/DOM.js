window.Reedable = window.Reedable || {};

Reedable.DOM = Reedable.DOM || (function () {
    "use strict";

    let _computedRem = null;

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
     * @param string {string} Lenght include the unit, e.g. "1em", "1px"
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

    return {parseLength, getText};

})(Reedable);