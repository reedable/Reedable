import {Accordion} from "../../core/ui/widgets/Accordion";
import {Debounce} from "../../core/Debounce";

export class FontOverrideAccordion extends Accordion {

    constructor(node, opts) {
        super(node, opts);

        const isEnabledCheckbox = node.querySelector("#fontOverride-isEnabled");
        const fontSizeMinInput = node.querySelector("#fontOverride-fontSizeMin");
        const fontSizeMagInput = node.querySelector("#fontOverride-fontSizeMag");
        const fontFamilyInput = node.querySelector("#fontOverride-fontFamily");

        const onChangeCheckbox = Debounce.trailing(async () => {
            if (isEnabledCheckbox.checked) {
                await this.start();
            } else {
                await this.stop();
            }
        }, 400);

        const onChangeInput = Debounce.trailing(async () => {
            chrome.storage.sync.get(["fontOverride"], async ({fontOverride}) => {
                chrome.storage.sync.set({
                    "fontOverride": Object.assign(fontOverride, {
                        "fontSizeMin": fontSizeMinInput.value,
                        "fontSizeMag": fontSizeMagInput.value,
                        "fontFamily": fontFamilyInput.value
                    })
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
            "currentWindow": true
        });

        chrome.scripting.executeScript({
            "target": {"tabId": tab.id},
            "func": function () {
                // See ../content/content.js
                // eslint-disable-next-line no-undef
                Reedable.FontOverrideEngine.getInstance().start(document);
            }
        });

        chrome.storage.sync.get(["fontOverride"], (pref) => {
            pref.fontOverride.isEnabled = true;
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
                Reedable.FontOverrideEngine.getInstance().stop(document);
            }
        });

        chrome.storage.sync.get(["fontOverride"], (pref) => {
            pref.fontOverride.isEnabled = false;
            chrome.storage.sync.set(pref);
        });
    }
}