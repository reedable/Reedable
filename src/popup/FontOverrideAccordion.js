import Accordion from "./Reedable/Accordion.js";
import debounce from "./Reedable/debounce.js";

export default class FontOverrideAccordion extends Accordion {

    constructor(node, opts) {
        super(node, opts);

        const isEnabledCheckbox = node.querySelector("#fontOverride-isEnabled");
        const fontSizeMinInput = node.querySelector("#fontOverride-fontSizeMin");
        const fontSizeMagInput = node.querySelector("#fontOverride-fontSizeMag");
        const fontFamilyInput = node.querySelector("#fontOverride-fontFamily");

        const onChangeCheckbox = debounce(async () => {
            if (isEnabledCheckbox.checked) {
                await this.start();
            } else {
                await this.stop();
            }
        }, 400);

        const onChangeInput = debounce(async () => {
            chrome.storage.sync.get(["fontOverride"], async ({fontOverride}) => {
                chrome.storage.sync.set({
                    "fontOverride": Object.assign(fontOverride, {
                        "fontSizeMin": fontSizeMinInput.value,
                        "fontSizeMag": fontSizeMagInput.value,
                        "fontFamily": fontFamilyInput.value,
                    }),
                });

                await onChangeCheckbox();
            });
        }, 400);

        this.$(isEnabledCheckbox).addEventListener("change", onChangeCheckbox);
        this.$(fontSizeMinInput).addEventListener("input", onChangeInput);
        this.$(fontSizeMagInput).addEventListener("input", onChangeInput);
        this.$(fontFamilyInput).addEventListener("input", onChangeInput);

        chrome.storage.sync.get(["fontOverride"], ({fontOverride}) => {
            isEnabledCheckbox.checked = fontOverride.isEnabled;
            fontSizeMinInput.value = fontOverride.fontSizeMin;
            fontSizeMagInput.value = fontOverride.fontSizeMag;
            fontFamilyInput.value = fontOverride.fontFamily;
        });
    }

    async start() {
        const [tab] = await chrome.tabs.query({
            "active": true,
            "currentWindow": true,
        });

        chrome.scripting.executeScript({
            "target": {"tabId": tab.id},
            "func": function () {
                Reedable.FontOverrideEngine.getInstance().start(document);
            },
        });
    }

    async stop() {
        const [tab] = await chrome.tabs.query({
            "active": true,
            "currentWindow": true,
        });

        chrome.scripting.executeScript({
            "target": {"tabId": tab.id},
            "func": function () {
                Reedable.FontOverrideEngine.getInstance().stop(document);
            },
        });
    }
}