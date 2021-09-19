window.Reedable = window.Reedable || {};

Reedable.AppEvent = Reedable.AppEvent || (function () {
    "use strict";

    class AppEvent {

        constructor(name, target, controller) {
            Object.assign(this, {
                name, target, controller
            });
        }
    }

    return AppEvent;
})();