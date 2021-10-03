window.Reedable = window.Reedable || {};

Reedable.OperationCancellationError = Reedable.OperationCancellationError || (function ({}) {

    return class OperationCancellationError extends Error {
        constructor(...args) {
            super(...args);
        }
    }
});