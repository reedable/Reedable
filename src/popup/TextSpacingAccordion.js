import {Accordion} from "../../modules/Reedable-core/ui/widgets/Accordion";
import {Debounce} from "../../modules/Reedable-core/Debounce";

export class TextSpacingAccordion extends Accordion {

    constructor(node, opts) {
        super(node, opts);

        const isEnabledCheckbox = node.querySelector("#textSpacing-isEnabled");
        const lineHeightInput = node.querySelector("#textSpacing-lineHeight");
        const afterParagraphInput = node.querySelector("#textSpacing-afterParagraph");
        const letterSpacingInput = node.querySelector("#textSpacing-letterSpacing");
        const wordSpacingInput = node.querySelector("#textSpacing-wordSpacing");

        const onChangeCheckbox = Debounce.trailing(async () => {
            if (isEnabledCheckbox.checked) {
                await this.start();
            } else {
                await this.stop();
            }
        }, 400);

        const onChangeInput = Debounce.trailing(async () => {
            chrome.storage.sync.get(["textSpacing"], async ({textSpacing}) => {
                chrome.storage.sync.set({
                    "textSpacing": Object.assign(textSpacing, {
                        "lineHeight": lineHeightInput.value,
                        "afterParagraph": afterParagraphInput.value,
                        "letterSpacing": letterSpacingInput.value,
                        "wordSpacing": wordSpacingInput.value
                    })
                });

                await onChangeCheckbox();
            });
        }, 400);

        this.$(isEnabledCheckbox).addEventListener("change", onChangeCheckbox);
        this.$(lineHeightInput).addEventListener("input", onChangeInput);
        this.$(afterParagraphInput).addEventListener("input", onChangeInput);
        this.$(letterSpacingInput).addEventListener("input", onChangeInput);
        this.$(wordSpacingInput).addEventListener("input", onChangeInput);

        chrome.storage.sync.get(["textSpacing"], ({textSpacing}) => {
            isEnabledCheckbox.checked = textSpacing.isEnabled;
            lineHeightInput.value = textSpacing.lineHeight;
            afterParagraphInput.value = textSpacing.afterParagraph;
            letterSpacingInput.value = textSpacing.letterSpacing;
            wordSpacingInput.value = textSpacing.wordSpacing;
        });
    }

    async start() {
        const [tab] = await chrome.tabs.query({
            "active": true,
            "currentWindow": true
        });

        chrome.scripting.executeScript({
            "target": {"tabId": tab.id},
            "func": function () {
                // See ../content/content.js
                // eslint-disable-next-line no-undef
                Reedable.TextSpacingEngine.getInstance().start(document);
            }
        });

        chrome.storage.sync.get(["textSpacing"], (pref) => {
            pref.textSpacing.isEnabled = true;
            chrome.storage.sync.set(pref);
        });
    }

    async stop() {
        const [tab] = await chrome.tabs.query({
            "active": true,
            "currentWindow": true
        });

        chrome.scripting.executeScript({
            "target": {"tabId": tab.id},
            "func": function () {
                // See ../content/content.js
                // eslint-disable-next-line no-undef
                Reedable.TextSpacingEngine.getInstance().stop(document);
            }
        });

        chrome.storage.sync.get(["textSpacing"], (pref) => {
            pref.textSpacing.isEnabled = false;
            chrome.storage.sync.set(pref);
        });
    }
}