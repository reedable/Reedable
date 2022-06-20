import { DOM } from "../core/ui/DOM";
import { Engine } from "../core/content/Engine";

/**
 * Injected <style> tag content CSS text loads packaged font files.
 *
 * The loaded font files must be declared in the manifest.js under
 * web_accessible_resources.
 *
 * https://developer.chrome.com/documentFragments/extensions/reference/i18n/
 */
const FONT_FACE_CSS = `
        @font-face {
            font-family: "OpenDyslexic Regular";
            src: url("chrome-extension://${chrome.runtime.id}/thirdparty/OpenDyslexic-Regular.otf");
        }`;

export class FontOverrideEngine extends Engine {

    static getInstance() {

        if (!this.instance) {
            this.instance = new FontOverrideEngine();
        }

        return this.instance;
    }

    constructor() {
        super("fontOverride");
    }

    async start(documentFragment) {

        await super.start(documentFragment);

        if (documentFragment) {

            let style = documentFragment.querySelector("#reedableFontOverrideStyle");

            if (!style) {
                style = documentFragment.createElement("style");
                style.id = "reedableFontOverrideStyle";
                style.appendChild(documentFragment.createTextNode(FONT_FACE_CSS));
                (documentFragment.head || documentFragment).appendChild(style);
            }
        }
    }

    async stop(documentFragment) {

        await super.stop(documentFragment);

        if (documentFragment) {
            const style = documentFragment.querySelector("#reedableFontOverrideStyle");

            if (style) {
                style.remove();
            }
        }
    }

    async _processNode(node, fontOverride) {

        const { reedableFontSize, reedableFontFamily } = node.dataset;

        if (typeof reedableFontSize !== "undefined" ||
            typeof reedableFontFamily !== "undefined") {

            await this._restoreNode(node);
        }

        return (async () => {

            const { fontSize, fontFamily } = node.style;

            const computedStyle = getComputedStyle(node);
            const computedFontSize = computedStyle.fontSize || "";

            function getFontSize() {

                const fontSizeMinPx = DOM.parseLength(fontOverride.fontSizeMin, computedStyle);
                let reedableFontSizeMag = node.dataset.reedableFontSizeMag;
                let fontSizeTargetPx;

                if (!reedableFontSizeMag) {
                    const reedableFontSizeMagNode = node.closest("[data-reedable-font-size-mag]");

                    if (reedableFontSizeMagNode) {
                        reedableFontSizeMag = reedableFontSizeMagNode.dataset.reedableFontSizeMag;
                    } else {
                        node.dataset.reedableFontSizeMag = fontOverride.fontSizeMag;
                    }
                }

                if (reedableFontSizeMag !== fontOverride.fontSizeMag) {
                    fontSizeTargetPx = parseFloat(computedFontSize) * Number(fontOverride.fontSizeMag) / 100;
                    node.dataset.reedableFontSizeMag = fontOverride.fontSizeMag;
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

    async _restoreNode(node) {

        return (async () => {

            const { reedableFontSize, reedableFontFamily } = node.dataset;

            delete node.dataset.reedableFontSize;
            delete node.dataset.reedableFontFamily;

            node.style.fontSize = reedableFontSize || "";
            node.style.fontFamily = reedableFontFamily || "";
        })();
    }
}
