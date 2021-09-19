import debounce from "./Reedable/debounce.js";

(function () {
    "use strict";

    const log = console.log.bind(console, "[TextSpacing]");

    chrome.storage.sync.get(["textSpacing"], ({textSpacing}) => {

        const isEnabledCheckbox = document.querySelector("#textSpacing-isEnabled");
        const lineHeightInput = document.querySelector("#textSpacing-lineHeight");
        const letterSpacingInput = document.querySelector("#textSpacing-letterSpacing");
        const wordSpacingInput = document.querySelector("#textSpacing-wordSpacing");

        isEnabledCheckbox.checked = textSpacing.isEnabled;
        lineHeightInput.value = textSpacing.lineHeight;
        letterSpacingInput.value = textSpacing.letterSpacing;
        wordSpacingInput.value = textSpacing.wordSpacing;

        const _onChangeCheckbox = debounce(onChangeCheckbox, 400);
        const _onChangeInput = debounce(onChangeInput, 400);

        isEnabledCheckbox.addEventListener("change", _onChangeCheckbox);
        lineHeightInput.addEventListener("input", _onChangeInput);
        letterSpacingInput.addEventListener("input", _onChangeInput);
        wordSpacingInput.addEventListener("input", _onChangeInput);

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
                        Reedable.TextSpacing.start(document);
                    },
                });
            } else {
                log("onChangeCheckbox calling stop", tab.id);
                chrome.scripting.executeScript({
                    "target": {"tabId": tab.id},
                    "func": function () {
                        Reedable.TextSpacing.stop(document);
                    },
                });
            }
        }//end of onChangeCheckbox

        async function onChangeInput() {
            const lineHeight = lineHeightInput.value;
            const letterSpacing = letterSpacingInput.value;
            const wordSpacing = wordSpacingInput.value;

            chrome.storage.sync.get(["textSpacing"], async ({textSpacing}) => {

                chrome.storage.sync.set({
                    "textSpacing": Object.assign(textSpacing, {
                        lineHeight,
                        letterSpacing,
                        wordSpacing,
                    }),
                });

                const [tab] = await chrome.tabs.query({
                    "active": true,
                    "currentWindow": true,
                });

                if (textSpacing.isEnabled) {
                    log("onChangeInput calling start", tab.id);
                    chrome.scripting.executeScript({
                        "target": {"tabId": tab.id},
                        "func": function () {
                            Reedable.TextSpacing.start(document);
                        },
                    });
                } else {
                    log("onChangeInput calling stop", tab.id);
                    chrome.scripting.executeScript({
                        "target": {"tabId": tab.id},
                        "func": function () {
                            Reedable.TextSpacing.stop(document);
                        },
                    });
                }
            });
        }//end of onChangeInput
    });
})();
