chrome.storage.sync.get(
    ["textSpacing", "fontOverride", "focusIndicator"],
    ({textSpacing, fontOverride, focusIndicator}) => {

        if (textSpacing.isEnabled) {
            Reedable.TextSpacing.start(document);
        } else {
            Reedable.TextSpacing.stop(document);
        }

        if (fontOverride.isEnabled) {
            Reedable.FontOverride.start(document);
        } else {
            Reedable.FontOverride.stop(document);
        }

        if (focusIndicator.isEnabled) {
            Reedable.FocusIndicator.start(document);
        } else {
            Reedable.FocusIndicator.stop(document);
        }
    },
);