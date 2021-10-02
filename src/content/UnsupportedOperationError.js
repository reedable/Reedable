window.Reedable = window.Reedable || {};

Reedable.UnsupportedOperationError = Reedable.UnsupportedOperationError || (function () {
    "use strict";

    class UnsupportedOperationError extends Error {
        constructor(name, ...args) {
            if (arguments.length) {
                super(`${name}(${(args || []).join(", ")})`);
            } else {
                super();
            }
        }
    }

    return UnsupportedOperationError;

})(Reedable);