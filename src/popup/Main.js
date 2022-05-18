import {AccordionGroup} from "../../modules/Reedable-core/ui/widgets/AccordionGroup";
import {Controller} from "../../modules/Reedable-core/ui/Controller";

import {FontOverrideAccordion} from "./FontOverrideAccordion";
import {TextSpacingAccordion} from "./TextSpacingAccordion";
import {FocusIndicatorAccordion} from "./FocusIndicatorAccordion";
import {LinkInformationAccordion} from "./LinkInformationAccordion";

export class Main extends Controller {

    constructor(node, opts) {
        super(node, opts);

        const [
            [fontOverrideAccordion],
            [textSpacingAccordion],
            [focusIndicatorAccordion],
            [linkInformationAccordion]
        ] = this.connect({
            // Since ES6, this should execute in insertion order except
            // for number like keys (which would not be a valid selector).
            "#fontOverride.Accordion": (n) => new FontOverrideAccordion(n),
            "#textSpacing.Accordion": (n) => new TextSpacingAccordion(n),
            "#focusIndicator.Accordion": (n) => new FocusIndicatorAccordion(n),
            "#linkInformation.Accordion": (n) => new LinkInformationAccordion(n),
            ".AccordionGroup": (n) => new AccordionGroup(n, {
                "isSinglePanelMode": true,
            }),
        });

        chrome.storage.sync.get(["reedable"], async ({reedable}) => {
            const {
                fontOverride,
                textSpacing,
                focusIndicator,
                linkInformation
            } = reedable;

            if (fontOverride && fontOverride.isExpanded) {
                await fontOverrideAccordion.expand();
            }

            if (textSpacing && textSpacing.isExpanded) {
                await textSpacingAccordion.expand();
            }

            if (focusIndicator && focusIndicator.isExpanded) {
                await focusIndicatorAccordion.expand();
            }

            if (linkInformation && linkInformation.isExpanded) {
                await linkInformationAccordion.expand();
            }
        });

        const viewPreferenceAccordionGroupNode =
            node.querySelector("#viewPreference.AccordionGroup");

        if (viewPreferenceAccordionGroupNode) {

            chrome.storage.sync.get(["reedable"], async ({reedable}) => {

                const onCollapse = (customEvent) => {
                    const target = customEvent && customEvent.target;
                    const id = target && target.id;

                    reedable[id] = reedable[id] || {};
                    reedable[id].isExpanded = false;
                    chrome.storage.sync.set({reedable});
                };

                const onExpand = (customEvent) => {
                    const target = customEvent && customEvent.target;
                    const id = target && target.id;

                    reedable[id] = reedable[id] || {};
                    reedable[id].isExpanded = true;
                    chrome.storage.sync.set({reedable});
                };

                this.$(viewPreferenceAccordionGroupNode)
                    .addEventListener("collapse", onCollapse);

                this.$(viewPreferenceAccordionGroupNode)
                    .addEventListener("expand", onExpand);
            });

        }//end of if (viewPreferenceAccordionGroupNode)
    }
}