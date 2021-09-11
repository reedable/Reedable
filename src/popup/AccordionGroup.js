window.Reedable = window.Reedable || {};

window.Reedable.AccordionGroup = window.Reedable.AccordionGroup || (function () {
    "use strict";

    class AccordionGroup {

        constructor(node, opts = {}) {
            this.node = node;
            this.opts = JSON.parse(JSON.stringify(opts));

            const headerNodes = this.getHeaders();
            headerNodes.forEach(headerNode => {
                const panelNode = this.getPanel(headerNode);
                headerNode.addEventListener("click", event => {
                    this.toggle(event);
                });

                if (headerNode.getAttribute("aria-expanded") === "true") {
                    panelNode.removeAttribute("hidden");
                } else {
                    panelNode.setAttribute("hidden", "");
                }
            });
        }

        toggle(event) {
            const target = event && event.target;
            const button = target.closest("button");
            const ariaExpanded = button.getAttribute("aria-expanded");

            if (ariaExpanded === "true") {
                this.collapse(button);
            } else {
                this.expand(button);
            }
        }

        collapse(headerNode) {
            const panelNode = this.getPanel(headerNode);
            headerNode.setAttribute("aria-expanded", "false");
            panelNode.setAttribute("hidden", "");
        }

        expand(headerNode) {
            const panelNode = this.getPanel(headerNode);
            headerNode.setAttribute("aria-expanded", "true");
            panelNode.removeAttribute("hidden");
        }

        getHeaders() {
            return this.node.querySelectorAll("[aria-controls]");
        }

        getPanel(headerNode) {
            const panelId = headerNode.getAttribute("aria-controls");
            return document.getElementById(panelId);
        }

        collapseAll() {
            const headerNodeList = this.getHeaders();
            headerNodeList.forEach(headerNode => {
                this.collapse(headerNode);
            });
        }

        expandAll() {
            const headerNodeList = this.getHeaders();
            headerNodeList.forEach(headerNode => {
                this.expand(headerNode);
            });
        }
    }

    return AccordionGroup;
})();