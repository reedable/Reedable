import {Accordion} from "./Accordion";
import {Controller} from "../Controller";
import {ControllerRegistry} from "../ControllerRegistry";

export class AccordionGroup extends Controller {

    constructor(node, opts) {
        super(node, opts);

        this.connect({
            ".Accordion": (n) => new Accordion(n)
        });

        if (opts.isSinglePanelMode) {
            this.node$.addEventListener("click", (event) => {
                this.collapseOthers(event);
            });
        }
    }

    collapseOthers(event) {
        const target = event && event.target;
        const targetAccordionNode = target && target.closest(".Accordion");
        const targetAccordion = ControllerRegistry.getController(targetAccordionNode);

        if (targetAccordion && targetAccordion.isExpanded) {
            this.node$.querySelectorAll(".Accordion").forEach((accordionNode) => {
                if (accordionNode !== targetAccordionNode) {
                    const accordion = ControllerRegistry.getController(accordionNode);

                    if (accordion.isExpanded) {
                        accordion.collapse();
                    }
                }
            });
        }
    }

    getAccordionNodeList() {
        return this.node$.querySelectorAll(".Accordion");
    }

    async collapse() {
        this.node$.querySelectorAll(".Accordion").forEach((accordionNode) => {
            const accordion = ControllerRegistry.getController(accordionNode);
            accordion.collapse();
        });
    }

    async expand() {
        this.node$.querySelectorAll(".Accordion").forEach((accordionNode, i) => {
            const accordion = ControllerRegistry.getController(accordionNode);

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