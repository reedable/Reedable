(function () {
    "use strict";

    const log = console.log.bind(console, "[TextSpacing]");

    chrome.storage.sync.get(["TextSpacing"], ({TextSpacing}) => {

        const isEnabledCheckbox = document.querySelector("#TextSpacing-isEnabled");
        const lineHeightInput = document.querySelector("#TextSpacing-lineHeight");
        const letterSpacingInput = document.querySelector("#TextSpacing-letterSpacing");
        const wordSpacingInput = document.querySelector("#TextSpacing-wordSpacing");

        isEnabledCheckbox.checked = TextSpacing.isEnabled;
        lineHeightInput.value = TextSpacing.lineHeight;
        letterSpacingInput.value = TextSpacing.letterSpacing;
        wordSpacingInput.value = TextSpacing.wordSpacing;

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

            chrome.storage.sync.get(["TextSpacing"], async ({TextSpacing}) => {

                chrome.storage.sync.set({
                    "TextSpacing": Object.assign(TextSpacing, {
                        lineHeight,
                        letterSpacing,
                        wordSpacing,
                    }),
                });

                const [tab] = await chrome.tabs.query({
                    "active": true,
                    "currentWindow": true,
                });

                if (TextSpacing.isEnabled) {
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
