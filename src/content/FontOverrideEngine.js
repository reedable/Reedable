window.Reedable = window.Reedable || {};

Reedable.FontOverrideEngine = Reedable.FontOverrideEngine || (function (
    {
        DOM,
        Engine,
    },
) {

    /**
     * Injected <style> tag content CSS text loads packaged font files.
     *
     * The loaded font files must be declared in the manifest.js under
     * web_accessible_resources.
     *
     * https://developer.chrome.com/docs/extensions/reference/i18n/
     */
    const FONT_FACE_CSS = `
        @font-face {
            font-family: "OpenDyslexic Regular";
            src: url("chrome-extension://${chrome.runtime.id}/font/OpenDyslexic-Regular.otf");
        }`;

    FontOverrideEngine.getInstance = function () {
        if (!FontOverrideEngine.instance) {
            FontOverrideEngine.instance = new FontOverrideEngine();
        }

        return FontOverrideEngine.instance;
    };

    function FontOverrideEngine() {
        Engine.call(this, "fontOverride");
    }

    FontOverrideEngine.prototype = Object.create(Engine.prototype);

    FontOverrideEngine.constructor = FontOverrideEngine;

    Object.assign(FontOverrideEngine.prototype, {
        _processNode,
        _restoreNode,
        _start,
        _stop,
    });

    function _start(doc) {
        Engine.prototype._start.apply(this, arguments);

        if (doc) {
            let style = doc.querySelector("#reedableFontOverride");

            if (!style) {
                style = doc.createElement("style");
                style.id = "reedableFontOverride";
                style.appendChild(doc.createTextNode(FONT_FACE_CSS));
                (doc.head || doc).appendChild(style);
            }
        }
    }

    function _stop(doc) {
        Engine.prototype._stop.apply(this, arguments);

        if (doc) {
            const style = doc.querySelector("#reedableFontOverride");

            if (style) {
                style.remove();
            }
        }
    }

    async function _processNode(node, fontOverride) {
        const {
            reedableFontSize,
            reedableFontFamily,
        } = node.dataset;

        if (typeof reedableFontSize !== "undefined" ||
            typeof reedableFontFamily !== "undefined") {

            await this._restoreNode(node);
        }

        return (async () => {
            const {
                fontSize,
                fontFamily,
            } = node.style;

            const computedStyle = getComputedStyle(node);
            const computedFontSize = computedStyle.fontSize || "";

            function getFontSize() {
                const fontSizeMinPx = DOM.parseLength(
                    fontOverride.fontSizeMin, computedStyle);
                let reedableFontSizeMag = node.dataset.reedableFontSizeMag;
                let fontSizeTargetPx;

                if (!reedableFontSizeMag) {
                    const reedableFontSizeMagNode =
                        node.closest("[data-reedable-font-size-mag]");

                    if (reedableFontSizeMagNode) {
                        reedableFontSizeMag =
                            reedableFontSizeMagNode.dataset.reedableFontSizeMag;
                    } else {
                        node.dataset.reedableFontSizeMag = fontOverride.fontSizeMag;
                    }
                }

                if (reedableFontSizeMag !== fontOverride.fontSizeMag) {
                    fontSizeTargetPx =
                        parseFloat(computedFontSize) *
                        Number(fontOverride.fontSizeMag) / 100;

                    node.dataset.reedableFontSizeMag =
                        fontOverride.fontSizeMag;
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

                if (computedFontFamily !== fontOverride.fontFamily) {
                    return fontOverride.fontFamily;
                }

                return "";
            }

            node.dataset.reedableFontSize = fontSize;
            node.dataset.reedableFontFamily = fontFamily;

            node.style.fontSize = getFontSize();
            node.style.fontFamily = getFontFamily();
        })();
    }

    async function _restoreNode(node) {
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

    return FontOverrideEngine;
})(Reedable);