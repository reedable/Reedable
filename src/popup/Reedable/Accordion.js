window.Reedable = window.Reedable || {};

Reedable.Accordion = Reedable.Accordion || (function () {
    "use strict";

    class Accordion extends Reedable.Controller {

        constructor(node, opts) {
            super(node, opts);

            const headerNode = node.querySelector("[aria-controls]");
            const panelNodeId = headerNode.getAttribute("aria-controls");
            const panelNode = document.getElementById(panelNodeId);

            headerNode.addEventListener("click", async event => {
                await this.toggle(event);
            });

            if (headerNode.getAttribute("aria-expanded") === "true") {
                panelNode.removeAttribute("hidden");
            } else {
                panelNode.setAttribute("hidden", "");
            }
        }

        get isExpanded() {
            return this.$(node => {
                const headerNode = node.querySelector("[aria-controls]");
                return headerNode.getAttribute("aria-expanded") === "true";
            });
        }

        get isCollapsed() {
            return this.$(node => {
                const headerNode = node.querySelector("[aria-controls]");
                return headerNode.getAttribute("aria-expanded") === "false";
            });
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
            return this.$(async node => {
                const headerNode = node.querySelector("[aria-controls]");
                const panelNodeId = headerNode.getAttribute("aria-controls");
                const panelNode = document.getElementById(panelNodeId);

                headerNode.setAttribute("aria-expanded", "false");
                panelNode.setAttribute("hidden", "");

                await this.dispatchEvent(
                    new Reedable.AppEvent("collapse", node, this),
                );

                return node;
            });
        }

        async expand() {
            return this.$(async node => {
                const headerNode = node.querySelector("[aria-controls]");
                const panelNodeId = headerNode.getAttribute("aria-controls");
                const panelNode = document.getElementById(panelNodeId);

                headerNode.setAttribute("aria-expanded", "true");
                panelNode.removeAttribute("hidden");
                await this.dispatchEvent(
                    new Reedable.AppEvent("expand", node, this),
                );

                return node;
            });
        }
    }

    return Accordion;
})();