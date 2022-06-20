import {Controller} from "../Controller";

export class Accordion extends Controller {

    constructor(node, opts) {
        super(node, opts);

        const headerNode = node.querySelector("[aria-controls]");
        const panelNodeId = headerNode.getAttribute("aria-controls");
        const panelNode = document.getElementById(panelNodeId);

        this.$(headerNode).addEventListener("click", async (event) => {
            await this.toggle(event);
        });

        if (headerNode.getAttribute("aria-expanded") === "true") {
            panelNode.removeAttribute("hidden");
        } else {
            panelNode.setAttribute("hidden", "");
        }
    }

    get isExpanded() {
        const headerNode = this.node$.querySelector("[aria-controls]");
        return headerNode.getAttribute("aria-expanded") === "true";
    }

    get isCollapsed() {
        const headerNode = this.node$.querySelector("[aria-controls]");
        return headerNode.getAttribute("aria-expanded") === "false";
    }

    async toggle(event) {
        const target = event && event.target;
        const headerNode = target.closest("[aria-controls]");

        if (headerNode.getAttribute("aria-expanded") === "true") {
            return this.collapse();
        } else {
            return this.expand();
        }
    }

    async collapse() {
        const headerNode = this.node$.querySelector("[aria-controls]");
        const panelNodeId = headerNode.getAttribute("aria-controls");
        const panelNode = document.getElementById(panelNodeId);

        headerNode.setAttribute("aria-expanded", "false");
        panelNode.setAttribute("hidden", "");

        this.node$.dispatchEvent(new CustomEvent("collapse", {
            "bubbles": true
        }));

        return this.node$;
    }

    async expand() {
        const headerNode = this.node$.querySelector("[aria-controls]");
        const panelNodeId = headerNode.getAttribute("aria-controls");
        const panelNode = document.getElementById(panelNodeId);

        headerNode.setAttribute("aria-expanded", "true");
        panelNode.removeAttribute("hidden");


        this.node$.dispatchEvent(new CustomEvent("expand", {
            "bubbles": true
        }));

        return this.node$;
    }
}