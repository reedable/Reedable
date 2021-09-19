import Registry from "./Registry.js";

export default class Controller {

    constructor(node, opts = {}) {
        this.opts = JSON.parse(JSON.stringify(opts));
        this.nodeRef = new WeakRef(node);
        Registry.register(this);
    }

    $(callback) {
        const node = this.nodeRef.deref();

        if (node) {
            if (typeof callback === "function") {
                return callback(node);
            }
        }
    }
}