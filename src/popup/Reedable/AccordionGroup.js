window.Reedable = window.Reedable || {};

Reedable.AccordionGroup = Reedable.AccordionGroup || (function () {
    "use strict";

    class AccordionGroup extends Reedable.Controller {

        constructor(node, opts) {
            super(node, opts);

            const accordionNodeControllerList =
                Array.from(node.querySelectorAll(".Accordion")).map(
                    accordionNode => new Reedable.Accordion(accordionNode),
                );

            accordionNodeControllerList.forEach(accordionNodeController => {
                accordionNodeController.on("collapse", async appEvent => {
                    await this.dispatchEvent(appEvent);
                });
                accordionNodeController.on("expand", async appEvent => {
                    await this.dispatchEvent(appEvent);
                });
            });

            if (this.opts.isSinglePanelMode) {
                node.addEventListener("click", event => {
                    const target = event && event.target;
                    const targetAccordionNode =
                        target && target.closest(".Accordion");

                    if (targetAccordionNode &&
                        targetAccordionNode.controller &&
                        targetAccordionNode.controller.isExpanded) {

                        node.querySelectorAll(".Accordion").forEach(
                            accordionNode => {
                                if (accordionNode !== targetAccordionNode) {
                                    if (accordionNode.controller.isExpanded) {
                                        accordionNode.controller.collapse();
                                    }
                                }
                            },
                        );
                    }
                });
            }
        }

        getAccordionNodeList() {
            return this.$(node => {
                return node.querySelectorAll(".Accordion");
            });
        }

        async collapse() {
            return this.$(node => {
                node.querySelectorAll(".Accordion").forEach(
                    accordionNode => accordionNode.controller.collapse(),
                );
            });
        }

        async expand() {
            return this.$(node => {
                node.querySelectorAll(".Accordion").forEach(
                    (accordionNode, i) => {
                        if (accordionNode.controller) {
                            if (!this.opts.isSinglePanelMode || i === 0) {
                                accordionNode.controller.expand();
                            } else if (this.opts.isSinglePanelMode) {
                                accordionNode.controller.collapse();
                            }
                        }
                    },
                );
            });
        }
    }

    return AccordionGroup;
})();