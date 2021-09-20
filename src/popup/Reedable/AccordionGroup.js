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
            const targetAccordionController =
                Registry.getController(targetAccordionNode);

            if (targetAccordionController &&
                targetAccordionController.isExpanded) {

                node.querySelectorAll(".Accordion").forEach(
                    accordionNode => {
                        if (accordionNode !== targetAccordionNode) {
                            const accordionController =
                                Registry.getController(accordionNode);

                            if (accordionController.isExpanded) {
                                accordionController.collapse();
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
                    const accordionController =
                        Registry.getController(accordionNode);
                    accordionController.collapse();
                },
            );
        }
    }

    async expand() {
        const node = this.nodeRef.deref();

        if (node) {
            node.querySelectorAll(".Accordion").forEach(
                (accordionNode, i) => {
                    const accordionController =
                        Registry.getController(accordionNode);

                    if (accordionController) {
                        if (!this.opts.isSinglePanelMode || i === 0) {
                            accordionController.expand();
                        } else if (this.opts.isSinglePanelMode) {
                            accordionController.collapse();
                        }
                    }
                },
            );
        }
    }
}