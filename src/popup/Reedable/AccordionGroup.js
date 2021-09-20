import Accordion from "./Accordion.js";
import Controller from "./Controller.js";
import Registry from "./Registry.js";

export default class AccordionGroup extends Controller {

    constructor(node, opts) {
        super(node, opts);

        Array.from(node.querySelectorAll(".Accordion")).map(
            accordionNode => new Accordion(accordionNode),
        );

        if (this.opts.isSinglePanelMode) {
            this.$(node).addEventListener("click", event => {
                this.collapseOthers(event);
            });
        }
    }

    collapseOthers(event) {
        const node = this.nodeRef.deref();

        if (node) {
            const target = event && event.target;
            const targetAccordionNode = target && target.closest(".Accordion");
            const targetAccordionNodeController =
                Registry.getController(targetAccordionNode);

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
        }
    }

    getAccordionNodeList() {
        const node = this.nodeRef.deref();

        if (node) {
            return node.querySelectorAll(".Accordion");
        }
    }

    async collapse() {
        const node = this.nodeRef.deref();

        if (node) {
            node.querySelectorAll(".Accordion").forEach(
                accordionNode => {
                    const accordionNodeController =
                        Registry.getController(accordionNode);
                    accordionNodeController.collapse();
                },
            );
        }
    }

    async expand() {
        const node = this.nodeRef.deref();

        if (node) {
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
        }
    }
}