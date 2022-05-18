import { Sync } from "../../modules/Reedable-core/Storage";
import { TextSpacingEngine } from "./TextSpacingEngine";
import { FontOverrideEngine } from "./FontOverrideEngine";
import { FocusIndicatorEngine } from "./FocusIndicatorEngine";
import { LinkInformationEngine } from "./LinkInformationEngine";

window.Reedable = { TextSpacingEngine, FontOverrideEngine, FocusIndicatorEngine, LinkInformationEngine };

Sync.get("textSpacing", "fontOverride", "focusIndicator", "linkInformation").then(

    ({ textSpacing, fontOverride, focusIndicator, linkInformation }) => {

        console.log({ textSpacing, fontOverride, focusIndicator, linkInformation });

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
    }
);