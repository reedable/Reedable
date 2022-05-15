import {Accordion,} from "../../modules/Reedable-core/ui/widgets/Accordion";
import {Debounce,} from "../../modules/Reedable-core/Debounce";

export class LinkInformationAccordion extends Accordion {

    constructor(node, opts) {
        super(node, opts);

        const isEnabledCheckbox = node.querySelector("#linkInformation-isEnabled");
        const boxShadowInput = node.querySelector("#linkInformation-boxShadow");
        const borderRadiusInput = node.querySelector("#linkInformation-borderRadius");
        const transitionInput = node.querySelector("#linkInformation-transition");

        const onChangeCheckbox = Debounce.trailing(async () => {
            if (isEnabledCheckbox.checked) {
                await this.start();
            } else {
                await this.stop();
            }
        }, 400);

        const onChangeInput = Debounce.trailing(async () => {
            chrome.storage.sync.get(["linkInformation"], async ({linkInformation}) => {
                chrome.storage.sync.set({
                    // "linkInformation": Object.assign(linkInformation, {
                    //     "boxShadow": boxShadowInput.value,
                    //     "borderRadius": borderRadiusInput.value,
                    //     "transition": transitionInput.value
                    // })
                });

                await onChangeCheckbox();
            });
        }, 400);

        this.$(isEnabledCheckbox).addEventListener("change", onChangeCheckbox);
        this.$(boxShadowInput).addEventListener("input", onChangeInput);
        this.$(borderRadiusInput).addEventListener("input", onChangeInput);
        this.$(transitionInput).addEventListener("input", onChangeInput);

        chrome.storage.sync.get(["linkInformation"], ({linkInformation}) => {
            isEnabledCheckbox.checked = linkInformation.isEnabled;
            // boxShadowInput.value = linkInformation.boxShadow;
            // borderRadiusInput.value = linkInformation.borderRadius;
            // transitionInput.value = linkInformation.transition;
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
                Reedable.LinkInformationEngine.getInstance().start(document);
            }
        });

        chrome.storage.sync.get(["linkInformation"], (pref) => {
            pref.linkInformation.isEnabled = true;
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
                Reedable.LinkInformationEngine.getInstance().stop(document);
            }
        });

        chrome.storage.sync.get(["linkInformation"], (pref) => {
            pref.linkInformation.isEnabled = false;
            chrome.storage.sync.set(pref);
        });
    }
}