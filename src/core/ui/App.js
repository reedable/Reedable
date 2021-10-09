import {Controller} from "./Controller";
import {DOM} from "./DOM";

export class App extends Controller {

    constructor(doc, opts) {
        super(doc, opts);
    }

    async start(selectorInitializerMap = {}) {
        await DOM.when(this.node$).ready;
        return this.connect(selectorInitializerMap);
    }
}