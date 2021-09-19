import Accordion from "./Accordion.js";
import Controller from "./Controller.js";
import Registry from "./Registry.js";

export default class AccordionGroup extends Controller {

    constructor(node, opts) {
        super(node, opts);

        const accordionNodeControllerList =
            Array.from(node.querySelectorAll(".Accordion")).map(
                accordionNode => new Accordion(accordionNode),
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
                const targetAccordionNodeController =
                    Registry.getController(node);

                if (targetAccordionNodeController &&
                    targetAccordionNodeController.isExpanded) {

                    node.querySelectorAll(".Accordion").forEach(
                        accordionNode => {
                            if (accordionNode !== targetAccordionNode) {
                                const accordionNodeController =
                                    Registry.getController(accordionNode);

                                if (accordionNodeController.isExpanded) {
                                    accordionNodeController.collapse();
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
                accordionNode => {
                    const accordionNodeController =
                        Registry.getController(accordionNode);
                    accordionNodeController.collapse();
                },
            );
        });
    }

    async expand() {
        return this.$(node => {
            node.querySelectorAll(".Accordion").forEach(
                (accordionNode, i) => {
                    const accordionNodeController =
                        Registry.getController(accordionNode);

                    if (accordionNodeController) {
                        if (!this.opts.isSinglePanelMode || i === 0) {
                            accordionNodeController.expand();
                        } else if (this.opts.isSinglePanelMode) {
                            accordionNodeController.collapse();
                        }
                    }
                },
            );
        });
    }
}