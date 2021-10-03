import Controller from "./Controller.js";

export default class App extends Controller {

    constructor(doc, opts) {
        super(doc, opts);

        this.whenContentLoaded = new Promise((resolve) => {
            this.$(doc).addEventListener("DOMContentLoaded", resolve);
        });
    }

    async start(selectorInitMap = {}) {
        await this.whenContentLoaded;
        return this.$().init(selectorInitMap);
    }
}