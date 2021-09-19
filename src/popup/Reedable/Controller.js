window.Reedable = window.Reedable || {};

Reedable.Controller = Reedable.Controller || (function () {
    "use strict";

    class Controller {

        static registry = new WeakMap();

        static $(selectorOrNode) {

            if (typeof selectorOrNode === "string") {
                const node = document.querySelector(selectorOrNode);
                return this.registry.get(node);
            }

            return this.registry.get(selectorOrNode);
        }

        constructor(node, opts = {}) {
            this.opts = JSON.parse(JSON.stringify(opts));
            this.nodeRef = new WeakRef(node);
            this.eventListenerSetMap = {};

            Controller.registry.set(node, this);
            node.controller = this;
        }

        on(name, callback) {
            let eventListenerSet = this.eventListenerSetMap[name];

            if (!eventListenerSet) {
                eventListenerSet = this.eventListenerSetMap[name] = new Set();
            }

            eventListenerSet.add(callback);
        }

        off(name, callback) {
            if (name && typeof name === "string") {
                delete this.eventListenerSetMap[name];
            } else if (name && typeof name === "function") {
                this.eventListenerSetMap.forEach(eventListenerSet => {
                    eventListenerSet.delete(callback);
                });
            }

            if (name && callback) {
                const eventListenerSet = this.eventListenerSetMap[name];
                eventListenerSet.delete(callback);
            }
        }

        async dispatchEvent(customEvent) {
            if (customEvent && customEvent.name) {
                const name = customEvent.name;
                const eventListenerSet = this.eventListenerSetMap[name];

                if (eventListenerSet) {
                    const promiseList = Array.from(eventListenerSet).map(
                        listener => {
                            try {
                                return Promise.resolve(listener(customEvent));
                            } catch (e) {
                                return Promise.reject(e);
                            }
                        },
                    );

                    return Promise.all(promiseList);
                }
            }
        }
    }

    return Controller;
})();
