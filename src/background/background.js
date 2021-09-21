const log = console.log.bind(console, "[background]");

const manifest = chrome.runtime.getManifest();

chrome.runtime.onInstalled.addListener(async () => {

    const default_reedable = {
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

    const default_textSpacing = {
        "isEnabled": true,
        "lineHeight": "1.5",
        "afterParagraph": "2em",
        "letterSpacing": "0.12em",
        "wordSpacing": "0.16em",
    };

    const default_fontOverride = {
        "isEnabled": true,
        "fontSizeMin": "10pt",
        "fontSizeMag": "100",
        "fontFamily": "",
    };

    const default_focusIndicator = {
        "isEnabled": true,
        "boxShadow": "0 0 0 0.15em orange,\n0 0 0 0.3em white",
        "borderRadius": "0.3em",
        "transition": "0.1s",
    };

    chrome.storage.sync.get(
        ["reedable", "textSpacing", "fontOverride", "focusIndicator"],
        async (v1_1) => {

            log("v1.1", v1_1); //user provided v1.1 pref

            chrome.storage.sync.get(
                ["Reedable", "FontOverride", "TextSpacing", "FocusIndicator"],
                (v1_0) => {

                    log("v1.0", v1_0); //user provided v1.0 pref

                    const pref = Object.assign({
                        "version": manifest.version,
                        "reedable": Object.assign(
                            default_reedable,
                            v1_0.Reedable,
                            v1_1.reedable,
                        ),
                        "textSpacing": Object.assign(
                            default_textSpacing,
                            v1_0.TextSpacing,
                            v1_1.textSpacing,
                        ),
                        "fontOverride": Object.assign(
                            default_fontOverride,
                            v1_0.FontOverride,
                            v1_1.fontOverride,
                        ),
                        "focusIndicator": Object.assign(
                            default_focusIndicator,
                            v1_0.FocusIndicator,
                            v1_1.focusIndicator,
                        ),
                    });

                    log("pref", pref); //user pref to be stored

                    chrome.storage.sync.set(pref);
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