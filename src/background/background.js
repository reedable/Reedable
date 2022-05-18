import { Sync } from "../../modules/Reedable-core/Storage";

const manifest = chrome.runtime.getManifest();

chrome.runtime.onInstalled.addListener(async () => {

    const default_reedable = {
        "fontOverride": {
            "isExpanded": true
        },
        "textSpacing": {
            "isExpanded": false
        },
        "focusIndicator": {
            "isExpanded": false
        },
        "linkInformation": {
            "isExpanded": false
        }
    };

    const default_textSpacing = {
        "isEnabled": true,
        "lineHeight": "1.5",
        "afterParagraph": "2em",
        "letterSpacing": "0.12em",
        "wordSpacing": "0.16em"
    };

    const default_fontOverride = {
        "isEnabled": true,
        "fontSizeMin": "10pt",
        "fontSizeMag": "100",
        "fontFamily": ""
    };

    const default_focusIndicator = {
        "isEnabled": true,
        "boxShadow": "0 0 0 0.25em orange,\n0 0 0 0.5em white",
        "borderRadius": "0.5em",
        "transition": "0.2s"
    };

    const default_linkInformation = {
        "isEnabled": true,
        "showTitle": true,
        "showIcon": true
    };

    const v1_2 = await Sync.get(
        "reedable",
        "textSpacing",
        "fontOverride",
        "focusIndicator",
        "linkInformation"
    );

    // User provided v1.1 pref
    const v1_1 = await Sync.get(
        "reedable",
        "textSpacing",
        "fontOverride",
        "focusIndicator"
    );

    // User provided v1.0 pref
    const v1_0 = await Sync.get(
        "Reedable",
        "FontOverride",
        "TextSpacing",
        "FocusIndicator"
    );

    console.log("retrieved v1.0 pref", v1_0);
    console.log("retrieved v1.1+ pref", v1_1);

    const pref = Object.assign({
        "version": manifest.version,
        "reedable": Object.assign(
            default_reedable,
            v1_0.Reedable,
            v1_1.reedable,
            v1_2.reedable
        ),
        "textSpacing": Object.assign(
            default_textSpacing,
            v1_0.TextSpacing,
            v1_1.textSpacing,
            v1_2.textSpacing
        ),
        "fontOverride": Object.assign(
            default_fontOverride,
            v1_0.FontOverride,
            v1_1.fontOverride,
            v1_2.fontOverride
        ),
        "focusIndicator": Object.assign(
            default_focusIndicator,
            v1_0.FocusIndicator,
            v1_1.focusIndicator,
            v1_2.focusIndicator
        ),
        "linkInformation": Object.assign(
            default_linkInformation,
            v1_2.linkInformation
        )
    });

    // User pref to be stored
    console.log("storing pref", pref);

    await Sync.set(pref);
});

// Apply style automatically on tab switch
chrome.tabs.onActivated.addListener(async (activeInfo) => {

    const {
        focusIndicator,
        fontOverride,
        textSpacing,
        linkInformation
    } = await Sync.get(
        "focusIndicator",
        "fontOverride",
        "textSpacing",
        "linkInformation"
    );

    console.log("tabId", activeInfo.tabId);
    console.log("fontOverride", fontOverride.isEnabled);
    console.log("focusIndicator", focusIndicator.isEnabled);
    console.log("textSpacing", textSpacing.isEnabled);
    console.log("linkInformation", linkInformation.isEnabled);

    const tabId = activeInfo.tabId;

    if (textSpacing.isEnabled) {
        chrome.scripting.executeScript({
            "target": { "tabId": tabId },
            "func": function () {
                // See ../content/content.js
                // eslint-disable-next-line no-undef
                Reedable.TextSpacingEngine.getInstance().start(document);
            }
        });
    } else {
        chrome.scripting.executeScript({
            "target": { "tabId": tabId },
            "func": function () {
                // See ../content/content.js
                // eslint-disable-next-line no-undef
                Reedable.TextSpacingEngine.getInstance().stop(document);
            }
        });
    }

    if (fontOverride.isEnabled) {
        chrome.scripting.executeScript({
            "target": { "tabId": tabId },
            "func": function () {
                // See ../content/content.js
                // eslint-disable-next-line no-undef
                Reedable.FontOverrideEngine.getInstance().start(document);
            }
        });
    } else {
        chrome.scripting.executeScript({
            "target": { "tabId": tabId },
            "func": function () {
                // See ../content/content.js
                // eslint-disable-next-line no-undef
                Reedable.FontOverrideEngine.getInstance().stop(document);
            }
        });
    }

    if (focusIndicator.isEnabled) {
        chrome.scripting.executeScript({
            "target": { "tabId": tabId },
            "func": function () {
                // See ../content/content.js
                // eslint-disable-next-line no-undef
                Reedable.FocusIndicatorEngine.getInstance().start(document);
            }
        });
    } else {
        chrome.scripting.executeScript({
            "target": { "tabId": tabId },
            "func": function () {
                // See ../content/content.js
                // eslint-disable-next-line no-undef
                Reedable.FocusIndicatorEngine.getInstance().stop(document);
            }
        });
    }

    if (linkInformation.isEnabled) {
        chrome.scripting.executeScript({
            "target": { "tabId": tabId },
            "func": function () {
                // See ../content/content.js
                // eslint-disable-next-line no-undef
                Reedable.LinkInformationEngine.getInstance().start(document);
            }
        });
    } else {
        chrome.scripting.executeScript({
            "target": { "tabId": tabId },
            "func": function () {
                // See ../content/content.js
                // eslint-disable-next-line no-undef
                Reedable.LinkInformationEngine.getInstance().stop(document);
            }
        });
    }
});