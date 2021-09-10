const log = console.log.bind(console, "[background]");

chrome.runtime.onInstalled.addListener(() => {

    // Save default parameters onInstall
    chrome.storage.sync.set({
        "Reedable": {},
        "TextSpacing": {
            "isEnabled": true,
            "lineHeight": "2",
            "letterSpacing": "0.1em",
            "wordSpacing": "0.4em",
        },
        "FontOverride": {
            "isEnabled": true,
            "fontSizeMin": "12pt",
            "fontSizeMag": "100",
            "fontFamily": "",
        },
        "FocusIndicator": {
            "isEnabled": true,
            "boxShadow": "0 0 0 0.15em orange,\n0 0 0 0.3em white",
            "borderRadius": "0.3em",
            "transition": "0.1s",
        },
    });
});

// Apply style automatically on tab switch
chrome.tabs.onActivated.addListener(async (activeInfo) => {

    chrome.storage.sync.get(
        ["FocusIndicator", "FontOverride", "TextSpacing"],
        ({FocusIndicator, FontOverride, TextSpacing}) => {

            log("tabId", activeInfo.tabId);
            log("FocusIndicator", FocusIndicator);
            log("TextSpacing", TextSpacing);

            const tabId = activeInfo.tabId;

            if (TextSpacing.isEnabled) {
                chrome.scripting.executeScript({
                    "target": {"tabId": tabId},
                    "func": function () {
                        Reedable.TextSpacing.start(document);
                    },
                });
            } else {
                chrome.scripting.executeScript({
                    "target": {"tabId": tabId},
                    "func": function () {
                        Reedable.TextSpacing.stop(document);
                    },
                });
            }

            if (FontOverride.isEnabled) {
                chrome.scripting.executeScript({
                    "target": {"tabId": tabId},
                    "func": function () {
                        Reedable.FontOverride.start(document);
                    },
                });
            } else {
                chrome.scripting.executeScript({
                    "target": {"tabId": tabId},
                    "func": function () {
                        Reedable.FontOverride.stop(document);
                    },
                });
            }

            if (FocusIndicator.isEnabled) {
                chrome.scripting.executeScript({
                    "target": {"tabId": tabId},
                    "func": function () {
                        Reedable.FocusIndicator.start(document);
                    },
                });
            } else {
                chrome.scripting.executeScript({
                    "target": {"tabId": tabId},
                    "func": function () {
                        Reedable.FocusIndicator.stop(document);
                    },
                });
            }
        },
    );
});