import {ControllerRegistry} from "./ControllerRegistry";
import {NodeManager} from "./NodeManager";

export class Controller {

    constructor(node, opts = {}) {
        const controller = ControllerRegistry.getController(node);

        if (controller) {
            try {
                controller.destroy();
            } catch (e) {
                console.error("Error while calling destroy", e);
            }
        }

        this.opts = JSON.parse(JSON.stringify(opts));
        this.nodeManager = new NodeManager();
        this.node$ = this.$(node);
        ControllerRegistry.register(this);
    }

    destroy() {
        this.nodeManager.destroy();
        ControllerRegistry.deregister(this);
    }

    $(node) {
        return this.nodeManager.register(node);
    }

    connect(selectorInitializerMap = {}) {
        return Object.keys(selectorInitializerMap).map((selector) => {
            const nodeList = this.node$.querySelectorAll(selector);
            const initializer = selectorInitializerMap[selector];

            return Array.from(nodeList).map((node) => {
                const controller = ControllerRegistry.getController(node);

                if (controller) {
                    console.log(
                        "node is already associated with a " +
                        "different controller. Did you forget " +
                        "to de-register it?", node, controller
                    );
                } else {
                    return initializer(node);
                }
            });
        });
    }
}