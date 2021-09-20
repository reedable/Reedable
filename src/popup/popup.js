import AccordionGroup from "./Reedable/AccordionGroup.js";
import Registry from "./Reedable/Registry.js";
import TextSpacingAccordion from "./TextSpacingAccordion.js";

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

        new TextSpacingAccordion(textSpacingAccordionNode);

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
            const fontOverrideAccordionController =
                Registry.getController("#fontOverride.Accordion");

            if (fontOverrideAccordionController) {
                await fontOverrideAccordionController.expand();
            }
        }

        if (reedable.textSpacing && reedable.textSpacing.isExpanded) {
            const textSpacingAccordionController =
                Registry.getController("#textSpacing.Accordion");

            if (textSpacingAccordionController) {
                await textSpacingAccordionController.expand();
            }
        }

        if (reedable.focusIndicator && reedable.focusIndicator.isExpanded) {
            const focusIndicatorAccordionController =
                Registry.getController("#focusIndicator.Accordion");

            if (focusIndicatorAccordionController) {
                await focusIndicatorAccordionController.expand();
            }
        }
    });
});