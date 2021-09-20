import AccordionGroup from "./Reedable/AccordionGroup.js";
import Registry from "./Reedable/Registry.js";
import TextSpadingAccordion from "./TextSpacingAccordion.js";

document.addEventListener("DOMContentLoaded", function () {

    document.querySelectorAll(".AccordionGroup").forEach(
        accordionGroupNode => {
            new AccordionGroup(accordionGroupNode, {
                "isSinglePanelMode": true,
            });
        },
    );

    chrome.storage.sync.get(["reedable"], async ({reedable}) => {

        const viewPreferenceAccordionGroupNode =
            document.querySelector("#viewPreference.AccordionGroup");

        const textSpacingAccordionNode =
            document.querySelector("#textSpacing.Accordion");

        new TextSpadingAccordion(textSpacingAccordionNode);

        if (viewPreferenceAccordionGroupNode) {

            viewPreferenceAccordionGroupNode.addEventListener(
                "collapse",
                customEvent => {
                    const target = customEvent && customEvent.target;
                    const id = target && target.id;

                    reedable[id] = reedable[id] || {};
                    reedable[id].isExpanded = false;
                    chrome.storage.sync.set({reedable});
                },
            );

            viewPreferenceAccordionGroupNode.addEventListener(
                "expand",
                customEvent => {
                    const target = customEvent && customEvent.target;
                    const id = target && target.id;

                    reedable[id] = reedable[id] || {};
                    reedable[id].isExpanded = true;
                    chrome.storage.sync.set({reedable});
                },
            );
        }

        if (reedable.fontOverride && reedable.fontOverride.isExpanded) {
            const fontOverrideAccordionNodeController =
                Registry.getController("#fontOverride.Accordion");

            if (fontOverrideAccordionNodeController) {
                await fontOverrideAccordionNodeController.expand();
            }
        }

        if (reedable.textSpacing && reedable.textSpacing.isExpanded) {
            const textSpacingAccordionNodeController =
                Registry.getController("#textSpacing.Accordion");

            if (textSpacingAccordionNodeController) {
                await textSpacingAccordionNodeController.expand();
            }
        }

        if (reedable.focusIndicator && reedable.focusIndicator.isExpanded) {
            const focusIndicatorAccordionNodeController =
                Registry.getController("#focusIndicator.Accordion");

            if (focusIndicatorAccordionNodeController) {
                await focusIndicatorAccordionNodeController.expand();
            }
        }
    });
});