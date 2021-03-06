import {Accordion} from "../../modules/Reedable-core/ui/widgets/Accordion";
import {Debounce} from "../../modules/Reedable-core/Debounce";

export class FocusIndicatorAccordion extends Accordion {

    constructor(node, opts) {
        super(node, opts);

        const isEnabledCheckbox = node.querySelector("#focusIndicator-isEnabled");
        const boxShadowInput = node.querySelector("#focusIndicator-boxShadow");
        const borderRadiusInput = node.querySelector("#focusIndicator-borderRadius");
        const transitionInput = node.querySelector("#focusIndicator-transition");

        const onChangeCheckbox = Debounce.trailing(async () => {
            if (isEnabledCheckbox.checked) {
                await this.start();
            } else {
                await this.stop();
            }
        }, 400);

        const onChangeInput = Debounce.trailing(async () => {
            chrome.storage.sync.get(["focusIndicator"], async ({focusIndicator}) => {
                chrome.storage.sync.set({
                    "focusIndicator": Object.assign(focusIndicator, {
                        "boxShadow": boxShadowInput.value,
                        "borderRadius": borderRadiusInput.value,
                        "transition": transitionInput.value
                    })
                });

                await onChangeCheckbox();
            });
        }, 400);

        this.$(isEnabledCheckbox).addEventListener("change", onChangeCheckbox);
        this.$(boxShadowInput).addEventListener("input", onChangeInput);
        this.$(borderRadiusInput).addEventListener("input", onChangeInput);
        this.$(transitionInput).addEventListener("input", onChangeInput);

        chrome.storage.sync.get(["focusIndicator"], ({focusIndicator}) => {
            isEnabledCheckbox.checked = focusIndicator.isEnabled;
            boxShadowInput.value = focusIndicator.boxShadow;
            borderRadiusInput.value = focusIndicator.borderRadius;
            transitionInput.value = focusIndicator.transition;
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
                Reedable.FocusIndicatorEngine.getInstance().start(document);
            }
        });

        chrome.storage.sync.get(["focusIndicator"], (pref) => {
            pref.focusIndicator.isEnabled = true;
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
                Reedable.FocusIndicatorEngine.getInstance().stop(document);
            }
        });

        chrome.storage.sync.get(["focusIndicator"], (pref) => {
            pref.focusIndicator.isEnabled = false;
            chrome.storage.sync.set(pref);
        });
    }
}