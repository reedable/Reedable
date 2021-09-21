window.Reedable = window.Reedable || {};

Reedable.TextSpacingEngine = Reedable.TextSpacingEngine || (function (
    {
        DOM,
        Engine,
    },
) {
    TextSpacingEngine.getInstance = function () {
        if (!TextSpacingEngine.instance) {
            TextSpacingEngine.instance = new TextSpacingEngine();
        }

        return TextSpacingEngine.instance;
    };

    function TextSpacingEngine() {
        Engine.call(this, "textSpacing");
    }

    TextSpacingEngine.prototype = Object.create(Engine.prototype);

    TextSpacingEngine.constructor = TextSpacingEngine;

    Object.assign(TextSpacingEngine.prototype, {
        _processNode,
        _restoreNode,
    });

    async function _processNode(node, enginePref) {

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

            await this._restoreNode(node);
        }

        //FIXME Why did I make this async?
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

            function getMarginBottom() {
                // FIXME Are there non-semantic way to mark-up paragraphs?
                if (node.tagName === "P") {
                    const computedMarginBottom = computedStyle.marginBottom;

                    if (parseFloat(computedMarginBottom) <
                        DOM.parseLength(
                            enginePref.afterParagraph,
                            computedStyle)) {

                        return enginePref.afterParagraph;
                    }
                }
            }

            function getLetterSpacing() {
                const computedLetterSpacing = computedStyle.letterSpacing;

                if (computedLetterSpacing === "normal") {
                    return enginePref.letterSpacing;
                }

                const estimatedLetterSpacing =
                    parseFloat(computedLetterSpacing) /
                    parseFloat(computedFontSize);

                if (estimatedLetterSpacing <
                    DOM.parseLength(
                        enginePref.letterSpacing,
                        computedStyle)) {

                    return enginePref.letterSpacing;
                }
            }

            function getWordSpacing() {
                const computedWordSpacing = computedStyle.wordSpacing;

                if (computedWordSpacing === "normal") {
                    return enginePref.wordSpacing;
                }

                const computedFontSize = computedStyle.fontSize;
                const estimatedLetterSpacing =
                    parseFloat(computedWordSpacing) /
                    parseFloat(computedFontSize);

                if (estimatedLetterSpacing <
                    DOM.parseLength(
                        enginePref.wordSpacing,
                        computedStyle)) {

                    return enginePref.wordSpacing;
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
            node.style.textAlign = enginePref.textAlign || "inherit";
        })();
    }

    async function _restoreNode(node) {

        // FIXME Why did I made this async? Consider performance implications
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

    return TextSpacingEngine;

})(Reedable);
