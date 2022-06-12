import { Engine } from "../../modules/Reedable-core/content/Engine";
import {Sync} from "../../modules/Reedable-core/Storage";

export class ColorOverrideEngine extends Engine {

    static getInstance() {

        if (!this.instance) {
            this.instance = new ColorOverrideEngine();
        }

        return this.instance;
    }

    constructor() {
        super("colorOverride");
    }

    _filterNode(node) {
        return (node.tagName === "IMG");
    }

    async start(documentFragment) {

        await super.start(documentFragment);

        const pref = await Sync.get(this.engineName);
        const colorOverride = pref[this.engineName];
        const { filterInvert, filterContrast } = colorOverride;

        if (filterInvert || filterContrast) {


            if (documentFragment) {

                const filter = [
                    filterInvert && `invert(${filterInvert})`,
                    filterContrast && `contrast(${filterContrast})`
                ].join(" ");

                const html = documentFragment.querySelector("html");
                html.dataset.reedableFilter = html.style.filter;
                html.style.filter = filter;
            }
        }
    }

    async stop(documentFragment) {

        await super.stop(documentFragment);

        if (documentFragment) {

            const html = documentFragment.querySelector("html");

            if (html) {
                html.style.filter = html.dataset.reedableFilter;
                delete html.dataset.reedableFilter;
            }
        }
    }

    async _processNode(node, colorOverride) {

        const { reedableFilter } = node.dataset;
        const { filterInvert } = colorOverride;

        if (typeof reedableFilter !== "undefined") {
            await this._restoreNode(node);
        }

        return (async () => {

            const { filter } = node.style;

            node.dataset.reedableFilter = filter;

            if (filterInvert) {
                node.style.filter = `invert(${filterInvert})`;
            }
        })();
    }

    async _restoreNode(node) {

        return (async () => {

            const { reedableFilter } = node.dataset;

            delete node.dataset.reedableFilter;

            node.style.filter = reedableFilter || "";
        })();
    }
}
