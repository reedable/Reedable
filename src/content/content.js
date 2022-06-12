import { Sync } from "../../modules/Reedable-core/Storage";
import { TextSpacingEngine } from "./TextSpacingEngine";
import { FontOverrideEngine } from "./FontOverrideEngine";
import { FocusIndicatorEngine } from "./FocusIndicatorEngine";
import { LinkInformationEngine } from "./LinkInformationEngine";
import { ColorOverrideEngine } from "./ColorOverrideEngine";

window.Reedable = { TextSpacingEngine, FontOverrideEngine, FocusIndicatorEngine, LinkInformationEngine };

Sync.get(
    "textSpacing",
    "fontOverride",
    "focusIndicator",
    "linkInformation",
    "colorOverride"
).then(

    ({
        textSpacing,
        fontOverride,
        focusIndicator,
        linkInformation,
        colorOverride
    }) => {

        console.log({
            textSpacing,
            fontOverride,
            focusIndicator,
            linkInformation,
            colorOverride
        });

        if (textSpacing.isEnabled) {
            TextSpacingEngine.getInstance().start(document);
        } else {
            TextSpacingEngine.getInstance().stop(document);
        }

        if (fontOverride.isEnabled) {
            FontOverrideEngine.getInstance().start(document);
        } else {
            FontOverrideEngine.getInstance().stop(document);
        }

        if (focusIndicator.isEnabled) {
            FocusIndicatorEngine.getInstance().start(document);
        } else {
            FocusIndicatorEngine.getInstance().stop(document);
        }

        if (linkInformation.isEnabled) {
            LinkInformationEngine.getInstance().start(document);
        } else {
            LinkInformationEngine.getInstance().stop(document);
        }

        if (colorOverride.isEnabled) {
            ColorOverrideEngine.getInstance().start(document);
        } else {
            ColorOverrideEngine.getInstance().stop(document);
        }
    }
);