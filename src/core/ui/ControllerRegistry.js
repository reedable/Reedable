export class ControllerRegistry {

    static nodeControllerMap = new WeakMap();

    static register(controller) {
        const node = controller.node$.deref();

        if (node) {
            this.nodeControllerMap.set(node, controller);
        }

        return ControllerRegistry;
    }

    static deregister(controller) {
        const node = controller.node$.deref();

        if (node) {
            this.nodeControllerMap.delete(node);
        }

        return ControllerRegistry;
    }

    static getController(node) {

        if (node && typeof node.deref === "function") {
            node = node.deref();
        }

        return this.nodeControllerMap.get(node);
    }
}
