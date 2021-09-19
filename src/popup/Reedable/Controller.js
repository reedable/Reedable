import Registry from "./Registry.js";

export default class Controller {

    constructor(node, opts = {}) {
        this.opts = JSON.parse(JSON.stringify(opts));
        this.nodeRef = new WeakRef(node);
        this.eventListenerSetMap = {};
        Registry.register(this);
    }

    async $(callback) {
        const node = this.nodeRef.deref();

        if (node) {
            if (typeof callback === "function") {
                await callback(node);
            }
        }
    }

    async dispatchEvent(appEvent) {
        if (appEvent && appEvent.name) {
            const eventName = appEvent.name;
            const eventListenerSet = this.eventListenerSetMap[eventName];

            if (eventListenerSet) {
                const promiseList = Array.from(eventListenerSet).map(
                    eventListener => {
                        try {
                            return Promise.resolve(eventListener(appEvent));
                        } catch (e) {
                            return Promise.reject(e);
                        }
                    },
                );

                return Promise.all(promiseList);
            }
        }
    }

    on(eventName, eventListener) {
        let eventListenerSet = this.eventListenerSetMap[eventName];

        if (!eventListenerSet) {
            eventListenerSet = this.eventListenerSetMap[eventName] = new Set();
        }

        eventListenerSet.add(eventListener);
    }

    off(eventName, eventListener) {

        if (eventName && eventListener) {
            const eventListenerSet = this.eventListenerSetMap[eventName];
            eventListenerSet.delete(eventListener);

        } else if (eventName && typeof eventName === "string") {

            // If we receive eventName only. Remove all eventListeners
            // observing this eventName.
            delete this.eventListenerSetMap[eventName];

        } else if (eventName && typeof eventName === "function") {

            // If we receive eventListener function as the only argument,
            // iterate through the map and remove the eventListener for all
            // event names and remove the matching function from all of them.
            this.eventListenerSetMap.forEach(eventListenerSet => {
                eventListenerSet.delete(eventName);
            });
        }
    }
}