import Registry from "./Registry.js";

export default class Controller {

    constructor(node, opts = {}) {
        const controller = Registry.getController(node);

        if (controller) {
            try {
                controller.destructor();
            } catch (e) {
                console.error("Error while calling destructor", e);
            }
        }

        this.opts = JSON.parse(JSON.stringify(opts));
        this.nodeRef = new WeakRef(node);
        this.eventListenerSetMap = new Map();

        Registry.register(this);
    }

    destructor() {
        Registry.deregister(this);

        this.eventListenerSetMap.forEach((eventListenerSet, node) => {
            eventListenerSet.forEach(({eventName, eventListener}) => {
                node.removeEventListener(eventName, eventListener);
            });
        });

        this.eventListenerSetMap.clear();
    }

    $(node = this.nodeRef.deref()) {
        const addEventListener = (eventName, eventListener) => {
            if (node) {
                const eventListenerSet =
                    this.eventListenerSetMap.get(node) || new Set();

                node.addEventListener(eventName, eventListener);
                eventListenerSet.add({eventName, eventListener});
                this.eventListenerSetMap.set(node, eventListenerSet);
            }
        };

        const init = (selectorInitMap = {}) => {
            if (node) {
                return Object.keys(selectorInitMap).map((selector) => {
                    const nodeList = node.querySelectorAll(selector);
                    const initializer = selectorInitMap[selector];

                    return Array.from(nodeList).map((node) => {
                        try {
                            const controller = Registry.getController(node);

                            if (controller) {

                                //
                                // TODO Figure out a better way to handle this.
                                //

                                console.log(
                                    "node is already associated with a " +
                                    "different controller. Did you forget " +
                                    "to de-register it?", node, controller,
                                );
                            } else {
                                return initializer(node);
                            }
                        } catch (cause) {
                            console.error(
                                "Error while calling initializer for",
                                selector,
                                cause,
                            );
                        }
                    });
                });
            }
        };

        return {addEventListener, init};
    }
}