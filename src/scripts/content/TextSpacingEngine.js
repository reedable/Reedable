import { DOM } from "../core/ui/DOM";
import { Engine } from "../core/content/Engine";

export class TextSpacingEngine extends Engine {

    static getInstance() {

        if (!this.instance) {
            this.instance = new TextSpacingEngine();
        }

        return this.instance;
    }

    constructor() {
        super("textSpacing");
    }

    _filterNode(node) {
        return (
            (super._filterNode(node) || node.tagName === "PRE") &&
            (node.tagName !== "CODE")
        );
    }

    async _processNode(node, enginePref) {

        const {
            reedableLineHeight,
            reedableMarginTop,
            reedableLetterSpacing,
            reedableWordSpacing,
            reedableTextAlign
        } = node.dataset;

        if (typeof reedableLineHeight !== "undefined" ||
            typeof reedableMarginTop !== "undefined" ||
            typeof reedableLetterSpacing !== "undefined" ||
            typeof reedableWordSpacing !== "undefined" ||
            typeof reedableTextAlign !== "undefined") {

            await this._restoreNode(node);
        }

        //FIXME Why did I make this async?
        return (async () => {

            const { lineHeight, marginTop, letterSpacing, wordSpacing, textAlign } = node.style;
            const computedStyle = getComputedStyle(node);
            const computedFontSize = computedStyle.fontSize || "";

            function getLineHeight() {

                const computedLineHeight = computedStyle.lineHeight || "";

                if (computedLineHeight === "normal") {
                    return DOM.parseLength(
                        enginePref.lineHeight, computedStyle);
                }

                const estimatedLineHeight =
                    parseFloat(computedLineHeight) /
                    parseFloat(computedFontSize);

                if (estimatedLineHeight < enginePref.lineHeight) {
                    return enginePref.lineHeight;
                }
            }

            function getMarginTop() {

                // FIXME Are there non-semantic way to mark-up paragraphs?
                if (node.tagName === "P") {

                    const computedMarginTop = computedStyle.marginTop;

                    if (parseFloat(computedMarginTop) <
                        DOM.parseLength(enginePref.afterParagraph, computedStyle)) {
                        return enginePref.afterParagraph;
                    }
                }
            }

            function getLetterSpacing() {

                const computedLetterSpacing = computedStyle.letterSpacing;

                if (computedLetterSpacing === "normal") {
                    return enginePref.letterSpacing;
                }

                const estimatedLetterSpacing = parseFloat(computedLetterSpacing) / parseFloat(computedFontSize);

                if (estimatedLetterSpacing < DOM.parseLength(enginePref.letterSpacing, computedStyle)) {
                    return enginePref.letterSpacing;
                }
            }

            function getWordSpacing() {

                const computedWordSpacing = computedStyle.wordSpacing;

                if (computedWordSpacing === "normal") {
                    return enginePref.wordSpacing;
                }

                const computedFontSize = computedStyle.fontSize;
                const estimatedLetterSpacing = parseFloat(computedWordSpacing) / parseFloat(computedFontSize);

                if (estimatedLetterSpacing < DOM.parseLength(enginePref.wordSpacing, computedStyle)) {
                    return enginePref.wordSpacing;
                }
            }

            node.dataset.reedableLineHeight = lineHeight;
            node.dataset.reedableMarginTop = marginTop;
            node.dataset.reedableLetterSpacing = letterSpacing;
            node.dataset.reedableWordSpacing = wordSpacing;
            node.dataset.reedableTextAlign = textAlign;

            if (node.tagName === "PRE") {
                // <PRE> pre-formatted content should remain as is
                node.style.lineHeight = "initial";
                node.style.marginTop = "initial";
                node.style.letterSpacing = "initial";
                node.style.wordSpacing = "initial";
            } else {
                // Apply the value only if it exceeds the computed value.
                node.style.lineHeight = getLineHeight();
                node.style.marginTop = getMarginTop();
                node.style.letterSpacing = getLetterSpacing();
                node.style.wordSpacing = getWordSpacing();
                node.style.textAlign = enginePref.textAlign || "inherit";
            }
        })();
    }

    async _restoreNode(node) {

        // FIXME Why did I made this async? Consider performance implications
        return (async () => {

            const {
                reedableLineHeight,
                reedableMarginTop,
                reedableLetterSpacing,
                reedableWordSpacing,
                reedableTextAlign
            } = node.dataset;

            delete node.dataset.reedableLineHeight;
            delete node.dataset.reedableMarginTop;
            delete node.dataset.reedableLetterSpacing;
            delete node.dataset.reedableWordSpacing;
            delete node.dataset.reedableTextAlign;

            node.style.lineHeight = reedableLineHeight || "";
            node.style.marginTop = reedableMarginTop || "";
            node.style.letterSpacing = reedableLetterSpacing || "";
            node.style.wordSpacing = reedableWordSpacing || "";
            node.style.textAlign = reedableTextAlign || "";
        })();
    }
}