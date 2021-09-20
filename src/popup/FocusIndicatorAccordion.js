import Accordion from "./Reedable/Accordion.js";
import debounce from "./Reedable/debounce.js";

export default class FocusIndicatorAccordion extends Accordion {

    constructor(node, opts) {
        super(node, opts);

        const isEnabledCheckbox = node.querySelector("#focusIndicator-isEnabled");
        const boxShadowInput = node.querySelector("#focusIndicator-boxShadow");
        const borderRadiusInput = node.querySelector("#focusIndicator-borderRadius");
        const transitionInput = node.querySelector("#focusIndicator-transition");

        const onChangeCheckbox = debounce(async () => {
            if (isEnabledCheckbox.checked) {
                await this.start();
            } else {
                await this.stop();
            }
        }, 400);

        const onChangeInput = debounce(async () => {
            chrome.storage.sync.get(["focusIndicator"], async ({focusIndicator}) => {
                chrome.storage.sync.set({
                    "focusIndicator": Object.assign(focusIndicator, {
                        "boxShadow": boxShadowInput.value,
                        "borderRadius": borderRadiusInput.value,
                        "transition": transitionInput.value,
                    }),
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
            "currentWindow": true,
        });

        chrome.scripting.executeScript({
            "target": {"tabId": tab.id},
            "func": function () {
                Reedable.FocusIndicator.start(document);
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
                Reedable.FocusIndicator.stop(document);
            },
        });
    }
}