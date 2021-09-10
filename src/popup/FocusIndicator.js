(function () {
    "use strict";

    const log = console.log.bind(console, "[FocusIndicator]");

    chrome.storage.sync.get(["FocusIndicator"], ({FocusIndicator}) => {

        const isEnabledCheckbox = document.querySelector("#FocusIndicator-isEnabled");
        const boxShadowInput = document.querySelector("#FocusIndicator-boxShadow");
        const borderRadiusInput = document.querySelector("#FocusIndicator-borderRadius");
        const transitionInput = document.querySelector("#FocusIndicator-transition");

        isEnabledCheckbox.checked = FocusIndicator.isEnabled;
        boxShadowInput.value = FocusIndicator.boxShadow;
        borderRadiusInput.value = FocusIndicator.borderRadius;
        transitionInput.value = FocusIndicator.transition;

        const _onChangeCheckbox = debounce(onChangeCheckbox, 400);
        const _onChangeInput = debounce(onChangeInput, 400);

        isEnabledCheckbox.addEventListener("change", _onChangeCheckbox);
        boxShadowInput.addEventListener("input", _onChangeInput);
        borderRadiusInput.addEventListener("input", _onChangeInput);
        transitionInput.addEventListener("input", _onChangeInput);

        async function onChangeCheckbox() {
            const [tab] = await chrome.tabs.query({
                "active": true,
                "currentWindow": true,
            });

            if (isEnabledCheckbox.checked) {
                log("onChangeCheckbox calling start", tab.id);
                chrome.scripting.executeScript({
                    "target": {"tabId": tab.id},
                    "func": function () {
                        Reedable.FocusIndicator.start(document);
                    },
                });
            } else {
                log("onChangeCheckbox calling stop", tab.id);
                chrome.scripting.executeScript({
                    "target": {"tabId": tab.id},
                    "func": function () {
                        Reedable.FocusIndicator.stop(document);
                    },
                });
            }
        }//end of function onChangeCheckbox

        async function onChangeInput() {
            const boxShadow = boxShadowInput.value;
            const borderRadius = borderRadiusInput.value;
            const transition = transitionInput.value;

            chrome.storage.sync.get(["FocusIndicator"], async ({FocusIndicator}) => {

                chrome.storage.sync.set({
                    "FocusIndicator": Object.assign(FocusIndicator, {
                        boxShadow,
                        borderRadius,
                        transition,
                    }),
                });

                const [tab] = await chrome.tabs.query({
                    "active": true,
                    "currentWindow": true,
                });

                if (FocusIndicator.isEnabled) {
                    log("onChangeInput calling start", tab.id);
                    chrome.scripting.executeScript({
                        "target": {"tabId": tab.id},
                        "func": function () {
                            Reedable.FocusIndicator.start(document);
                        },
                    });
                } else {
                    log("onChangeInput calling stop", tab.id);
                    chrome.scripting.executeScript({
                        "target": {"tabId": tab.id},
                        "func": function () {
                            Reedable.FocusIndicator.stop(document);
                        },
                    });
                }
            });
        }//end of function onChangeInput
    });
})();
