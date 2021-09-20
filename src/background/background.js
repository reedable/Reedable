const log = console.log.bind(console, "[background]");

const manifest = chrome.runtime.getManifest();

chrome.runtime.onInstalled.addListener(async () => {

    const reedable = {
        "fontOverride": {
            "isExpanded": true,
        },
        "textSpacing": {
            "isExpanded": false,
        },
        "focusIndicator": {
            "isExpanded": false,
        },
    };

    const textSpacing = {
        "isEnabled": true,
        "lineHeight": "2",
        "letterSpacing": "0.1em",
        "wordSpacing": "0.4em",
    };

    const fontOverride = {
        "isEnabled": true,
        "fontSizeMin": "10pt",
        "fontSizeMag": "100",
        "fontFamily": "",
    };

    const focusIndicator = {
        "isEnabled": true,
        "boxShadow": "0 0 0 0.15em orange,\n0 0 0 0.3em white",
        "borderRadius": "0.3em",
        "transition": "0.1s",
    };

    chrome.storage.sync.get(
        ["reedable", "textSpacing", "fontOverride", "focusIndicator"],
        async (v1_1) => {

            log("v1.1", v1_1);

            chrome.storage.sync.get(
                ["Reedable", "FontOverride", "TextSpacing", "FocusIndicator"],
                (v1_0) => {

                    log("v1.0", v1_0);

                    const store = Object.assign({
                        reedable,
                        textSpacing,
                        fontOverride,
                        focusIndicator,
                    }, {
                        "reedable": v1_0.Reedable,
                        "textSpacing": v1_0.TextSpacing,
                        "fontOverride": v1_0.FontOverride,
                        "focusIndicator": v1_0.FocusIndicator,
                    }, v1_1);

                    store.version = manifest.version;

                    log(store);

                    chrome.storage.sync.set(store);
                },
            );
        },
    );
});

// Apply style automatically on tab switch
chrome.tabs.onActivated.addListener(async (activeInfo) => {

    chrome.storage.sync.get(
        ["focusIndicator", "fontOverride", "textSpacing"],
        ({focusIndicator, fontOverride, textSpacing}) => {

            log("tabId", activeInfo.tabId);
            log("focusIndicator", focusIndicator);
            log("textSpacing", textSpacing);

            const tabId = activeInfo.tabId;

            if (textSpacing.isEnabled) {
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

            if (fontOverride.isEnabled) {
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

            if (focusIndicator.isEnabled) {
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