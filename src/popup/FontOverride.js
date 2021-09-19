import debounce from "./Reedable/debounce.js";

(function () {
    "use strict";

    const log = console.log.bind(console, "[FontOverride]");

    chrome.storage.sync.get(["fontOverride"], ({fontOverride}) => {

        const isEnabledCheckbox = document.querySelector("#fontOverride-isEnabled");
        const fontSizeMinInput = document.querySelector("#fontOverride-fontSizeMin");
        const fontSizeMagInput = document.querySelector("#fontOverride-fontSizeMag");
        const fontFamilyInput = document.querySelector("#fontOverride-fontFamily");

        isEnabledCheckbox.checked = fontOverride.isEnabled;
        fontSizeMinInput.value = fontOverride.fontSizeMin;
        fontSizeMagInput.value = fontOverride.fontSizeMag;
        fontFamilyInput.value = fontOverride.fontFamily;

        const _onChangeCheckbox = debounce(onChangeCheckbox, 400);
        const _onChangeInput = debounce(onChangeInput, 400);

        isEnabledCheckbox.addEventListener("change", _onChangeCheckbox);
        fontSizeMinInput.addEventListener("input", _onChangeInput);
        fontSizeMagInput.addEventListener("input", _onChangeInput);
        fontFamilyInput.addEventListener("input", _onChangeInput);

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
                        Reedable.FontOverride.start(document);
                    },
                });
            } else {
                log("onChangeCheckbox calling stop", tab.id);
                chrome.scripting.executeScript({
                    "target": {"tabId": tab.id},
                    "func": function () {
                        Reedable.FontOverride.stop(document);
                    },
                });
            }
        }//end of onChangeCheckbox

        async function onChangeInput() {
            const fontSizeMin = fontSizeMinInput.value;
            const fontSizeMag = fontSizeMagInput.value;
            const fontFamily = fontFamilyInput.value;

            chrome.storage.sync.get(["fontOverride"], async ({fontOverride}) => {

                chrome.storage.sync.set({
                    "fontOverride": Object.assign(fontOverride, {
                        fontSizeMin,
                        fontSizeMag,
                        fontFamily,
                    }),
                });

                const [tab] = await chrome.tabs.query({
                    "active": true,
                    "currentWindow": true,
                });

                if (fontOverride.isEnabled) {
                    log("onChangeInput calling start", tab.id);
                    chrome.scripting.executeScript({
                        "target": {"tabId": tab.id},
                        "func": function () {
                            Reedable.FontOverride.start(document);
                        },
                    });
                } else {
                    log("onChangeInput calling stop", tab.id);
                    chrome.scripting.executeScript({
                        "target": {"tabId": tab.id},
                        "func": function () {
                            Reedable.FontOverride.stop(document);
                        },
                    });
                }
            });
        }//end of onChangeInput
    });
})();
