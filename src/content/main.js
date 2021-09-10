chrome.storage.sync.get(
    ["TextSpacing", "FontOverride", "FocusIndicator"],
    ({TextSpacing, FontOverride, FocusIndicator}) => {

        if (TextSpacing.isEnabled) {
            Reedable.TextSpacing.start(document);
        } else {
            Reedable.TextSpacing.stop(document);
        }

        if (FontOverride.isEnabled) {
            Reedable.FontOverride.start(document);
        } else {
            Reedable.FontOverride.stop(document);
        }

        if (FocusIndicator.isEnabled) {
            Reedable.FocusIndicator.start(document);
        } else {
            Reedable.FocusIndicator.stop(document);
        }
    },
);