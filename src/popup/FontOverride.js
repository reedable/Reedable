(function () {
    "use strict";

    const log = console.log.bind(console, "[FontOverride]");

    chrome.storage.sync.get(["FontOverride"], ({FontOverride}) => {

        const isEnabledCheckbox = document.querySelector("#FontOverride-isEnabled");
        const fontSizeMinInput = document.querySelector("#FontOverride-fontSizeMin");
        const fontSizeMagInput = document.querySelector("#FontOverride-fontSizeMag");
        const fontFamilyInput = document.querySelector("#FontOverride-fontFamily");

        isEnabledCheckbox.checked = FontOverride.isEnabled;
        fontSizeMinInput.value = FontOverride.fontSizeMin;
        fontSizeMagInput.value = FontOverride.fontSizeMag;
        fontFamilyInput.value = FontOverride.fontFamily;

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

            chrome.storage.sync.get(["FontOverride"], async ({FontOverride}) => {

                chrome.storage.sync.set({
                    "FontOverride": Object.assign(FontOverride, {
                        fontSizeMin,
                        fontSizeMag,
                        fontFamily,
                    }),
                });

                const [tab] = await chrome.tabs.query({
                    "active": true,
                    "currentWindow": true,
                });

                if (FontOverride.isEnabled) {
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
