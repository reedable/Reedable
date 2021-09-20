import AccordionGroup from "./Reedable/AccordionGroup.js";
import Controller from "./Reedable/Controller.js";

import FontOverrideAccordion from "./FontOverrideAccordion.js";
import TextSpacingAccordion from "./TextSpacingAccordion.js";
import FocusIndicatorAccordion from "./FocusIndicatorAccordion.js";

export default class Main extends Controller {

    constructor(node, opts) {
        super(node, opts);

        const [
            [fontOverrideAccordion],
            [textSpacingAccordion],
            [focusIndicatorAccordion],
        ] = this.$(node).init({
            // Since ES6, this should execute in insertion order except
            // for number like keys (which would not be a valid selector).
            "#fontOverride.Accordion": (n) => new FontOverrideAccordion(n),
            "#textSpacing.Accordion": (n) => new TextSpacingAccordion(n),
            "#focusIndicator.Accordion": (n) => new FocusIndicatorAccordion(n),
            ".AccordionGroup": (n) => new AccordionGroup(n, {
                "isSinglePanelMode": true,
            }),
        });

        chrome.storage.sync.get(["reedable"], async ({reedable}) => {
            const {fontOverride, textSpacing, focusIndicator} = reedable;

            if (fontOverride && fontOverride.isExpanded) {
                await fontOverrideAccordion.expand();
            }

            if (textSpacing && textSpacing.isExpanded) {
                await textSpacingAccordion.expand();
            }

            if (focusIndicator && focusIndicator.isExpanded) {
                await focusIndicatorAccordion.expand();
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