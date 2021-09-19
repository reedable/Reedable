(function () {
    "use strict";

    const log = console.log.bind(console, "[FocusIndicator]");

    chrome.storage.sync.get(["focusIndicator"], ({focusIndicator}) => {

        const isEnabledCheckbox = document.querySelector("#focusIndicator-isEnabled");
        const boxShadowInput = document.querySelector("#focusIndicator-boxShadow");
        const borderRadiusInput = document.querySelector("#focusIndicator-borderRadius");
        const transitionInput = document.querySelector("#focusIndicator-transition");

        isEnabledCheckbox.checked = focusIndicator.isEnabled;
        boxShadowInput.value = focusIndicator.boxShadow;
        borderRadiusInput.value = focusIndicator.borderRadius;
        transitionInput.value = focusIndicator.transition;

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

            chrome.storage.sync.get(["focusIndicator"], async ({focusIndicator}) => {

                chrome.storage.sync.set({
                    "focusIndicator": Object.assign(focusIndicator, {
                        boxShadow,
                        borderRadius,
                        transition,
                    }),
                });

                const [tab] = await chrome.tabs.query({
                    "active": true,
                    "currentWindow": true,
                });

                if (focusIndicator.isEnabled) {
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
