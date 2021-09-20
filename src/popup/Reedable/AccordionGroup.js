import Accordion from "./Accordion.js";
import Controller from "./Controller.js";
import Registry from "./Registry.js";

export default class AccordionGroup extends Controller {

    constructor(node, opts) {
        super(node, opts);

        this.$(node).init({
            ".Accordion": (n) => new Accordion(n)
        });

        // TODO Consider doing this as maxOpenPanel and minOpenPanel
        if (this.opts.isSinglePanelMode) {
            this.$(node).addEventListener("click", (event) => {
                this.collapseOthers(event);
            });
        }
    }

    collapseOthers(event) {
        const node = this.nodeRef.deref();

        if (node) {
            const target = event && event.target;
            const targetAccordionNode = target && target.closest(".Accordion");
            const targetAccordion = Registry.getController(targetAccordionNode);

            if (targetAccordion && targetAccordion.isExpanded) {
                node.querySelectorAll(".Accordion").forEach((accordionNode) => {
                    if (accordionNode !== targetAccordionNode) {
                        const accordion = Registry.getController(accordionNode);

                        if (accordion.isExpanded) {
                            accordion.collapse();
                        }
                    }
                });
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
            node.querySelectorAll(".Accordion").forEach((accordionNode) => {
                const accordion = Registry.getController(accordionNode);
                accordion.collapse();
            });
        }
    }

    async expand() {
        const node = this.nodeRef.deref();

        if (node) {
            node.querySelectorAll(".Accordion").forEach((accordionNode, i) => {
                const accordion = Registry.getController(accordionNode);

                if (accordion) {
                    if (!this.opts.isSinglePanelMode || i === 0) {
                        accordion.expand();
                    } else if (this.opts.isSinglePanelMode) {
                        accordion.collapse();
                    }
                }
            });
        }
    }
}