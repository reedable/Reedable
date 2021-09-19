import Registry from "./Registry.js";

export default class AppEvent {

    constructor(name, target) {
        Object.assign(this, {name, target});
    }

    getController() {
        return Registry.getController(this.target);
    }
}