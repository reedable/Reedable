import {AspectPorxyFactory, Porxy, WeakRefPorxyFactory} from "../Porxy";

export class NodeManager {

    constructor() {
        this._nodeEventListenerSetMap = new Map();
    }

    destroy() {

        for (let node$ of this._nodeEventListenerSetMap.keys()) {
            const eventListenerSet = this._nodeEventListenerSetMap.get(node$);

            for (let {eventName, eventListener} of eventListenerSet) {
                node$.removeEventListener(eventName, eventListener);
            }
        }
    }

    register(node) {

        if (node instanceof Porxy) {
            return node;
        }

        const nodeWeakRefProxy = WeakRefPorxyFactory.create(node);
        const node$ = AspectPorxyFactory.create(nodeWeakRefProxy, {
            "addEventListener": {
                "after": (eventName, eventListener) => {
                    const eventListenerSet =
                        this._nodeEventListenerSetMap.get(node$) ||
                        new Set();

                    this._nodeEventListenerSetMap.set(node$, eventListenerSet);
                    eventListenerSet.add({eventName, eventListener});
                }
            },
            "removeEventListener": {
                "after": (eventName, eventListener) => {
                    const eventListenerSet =
                        this._nodeEventListenerSetMap.get(node$);

                    if (eventListenerSet) {
                        for (let item of eventListenerSet) {
                            if (item.eventName === eventName &&
                                (
                                    item.eventListener === eventListener ||
                                    typeof eventListener === "undefined"
                                )
                            ) {
                                eventListenerSet.delete(item);
                            }
                        }
                    }
                }
            }
        });

        return node$;
    }
}