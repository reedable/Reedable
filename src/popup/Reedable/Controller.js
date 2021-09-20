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

    $(node) {
        const addEventListener = (eventName, eventListener) => {
            const eventListenerSet =
                this.eventListenerSetMap.get(node) || new Set();

            node.addEventListener(eventName, eventListener);
            eventListenerSet.add({eventName, eventListener});
            this.eventListenerSetMap.set(node, eventListenerSet);
        };

        return {addEventListener};
    }
}