import {TextSpacingEngine} from "./TextSpacingEngine";
import {FontOverrideEngine} from "./FontOverrideEngine";
import {FocusIndicatorEngine} from "./FocusIndicatorEngine";
import {Sync} from "../../modules/Reedable-core/Storage";

window.Reedable = {
    TextSpacingEngine,
    FontOverrideEngine,
    FocusIndicatorEngine
};

Sync.get("textSpacing", "fontOverride", "focusIndicator").then(
    ({textSpacing, fontOverride, focusIndicator}) => {

        console.log({textSpacing, fontOverride, focusIndicator});

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
    }
);