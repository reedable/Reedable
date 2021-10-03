window.Reedable = window.Reedable || {};

Reedable.UnsupportedOperationError = Reedable.UnsupportedOperationError || (function ({}) {

    class UnsupportedOperationError extends Error {
        constructor(...args) {
            super(...args);
        }
    }

    return UnsupportedOperationError;

})(Reedable);