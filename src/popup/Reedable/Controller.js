window.Reedable = window.Reedable || {};

Reedable.Controller = Reedable.Controller || (function () {
    "use strict";

    class Controller {

        constructor(node, opts = {}) {
            this.opts = JSON.parse(JSON.stringify(opts));
            this.nodeRef = new WeakRef(node);
            this.eventListenerSetMap = {};
            node.controller = this;
        }

        async $(callback) {
            const node = this.nodeRef.deref();

            if (node) {
                if (typeof callback === "function") {
                    await callback(node);
                }
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
    }

    return Controller;
})();
