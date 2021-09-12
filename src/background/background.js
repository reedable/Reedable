const log = console.log.bind(console, "[background]");

const manifest = chrome.runtime.getManifest();

// TODO Add version-to-version upgrade mechanisms
function upgrade({Reedable, TextSpacing, FontOverride, FocusIndicator}) {
    const version = manifest.version;
    // TODO const prevVersion = Reedable.version;
    // TODO Store previous version and develop a restore strategy

    if (!Reedable) {
        Reedable = {};
        TextSpacing = {
            "isEnabled": true,
            "lineHeight": "2",
            "letterSpacing": "0.1em",
            "wordSpacing": "0.4em",
        };
        FontOverride = {
            "isEnabled": true,
            "fontSizeMin": "10pt",
            "fontSizeMag": "100",
            "fontFamily": "",
        };
        FocusIndicator = {
            "isEnabled": true,
            "boxShadow": "0 0 0 0.15em orange,\n0 0 0 0.3em white",
            "borderRadius": "0.3em",
            "transition": "0.1s",
        };
    }

    Object.assign(Reedable, {version});

    // Save default parameters onInstall
    chrome.storage.sync.set({
        Reedable,
        TextSpacing,
        FontOverride,
        FocusIndicator,
    });

    return {
        Reedable,
        TextSpacing,
        FontOverride,
        FocusIndicator,
    };
}

chrome.runtime.onInstalled.addListener(() => {
    chrome.storage.sync.get(
        ["Reedable", "TextSpacing", "FontOverride", "FocusIndicator"],
        ({Reedable, TextSpacing, FontOverride, FocusIndicator}) => {

            const before = {
                Reedable,
                TextSpacing,
                FontOverride,
                FocusIndicator,
            };

            log("Before upgrade", before);

            const after = upgrade(before);

            log("After upgrade", after);

            chrome.storage.sync.set(after);
        },
    );
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