export default class Registry {

    static nodeControllerMap = new WeakMap();

    static register(controller) {
        const node = controller.nodeRef.deref();

        if (node) {
            this.nodeControllerMap.set(node, controller);
        }

        return Registry;
    }

    static deregister(controller) {
        const node = controller.nodeRef.deref();

        if (node) {
            this.nodeControllerMap.delete(node);
        }

        return Registry;
    }

    static querySelector(selector) {
        const node = document.querySelector(selector);

        if (node) {
            return this.nodeControllerMap.get(node);
        }
    }

    static querySelectorAll(selector) {
        const nodeList = document.querySelectorAll(selector);

        return Array.from(nodeList).map(node => {
            return this.nodeControllerMap.get(node);
        });
    }

    static getController(node) {
        if (typeof node === "string") {
            return this.querySelector(node);
        }

        return this.nodeControllerMap.get(node);
    }
}
