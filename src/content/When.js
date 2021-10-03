window.Reedable = window.Reedable || {};

/**
 * Usage
 *
 *  const whenDocument = new When();
 *
 *  if (document.body) {
 *      whenDocument.resolve();
 *  } else {
 *      document.addEventListener("DOMContentLoaded", () => {
 *          whenDocument.resolve();
 *      });
 *  }
 *
 *  setTimeout(() => {
 *      whenDocument.reject(); // after 30 sec, give up
 *  }, 30000);
 *
 *  await whenDocument.ready;
 *
 *  //.... do whatever you do when the document is ready
 */
Reedable.When = Reedable.When || (function (
    {
        OperationCancellationError,
    },
) {

    return class When {

        constructor() {
            this.reset();
        }

        /**
         * Returns true if the underlying promise has settled.
         * Otherwise, false.
         *
         * @returns {boolean}
         */
        get isSettled() {
            return this._isSettled;
        }

        /**
         * Returns true if the underlying promise has settled and
         * the promise was resolved (i.e. fulfilled).
         *
         * If the underlying promise was rejected, it returns
         * false.
         *
         * If the promise has not settled, it returns undefined.
         *
         * @returns {boolean}
         */
        get isResolved() {
            return this._isResolved;
        }

        /**
         * Returns true if the underlying promise has settled and
         * the promise was rejected.
         *
         * If the underlying promise was resolved, it returns
         * false.
         *
         * If the promise has not settled, it returns undefined.
         *
         * @returns {boolean}
         */
        get isRejected() {
            return this._isRejected;
        }

        /**
         * Returns true if the underlying promise has settled and
         * the promise was rejected with CancellationError.
         *
         * If the underlying promise was resolved, it returns
         * false. If the underlying promise rejected for any other
         * rasons, it returns false.
         *
         * If the promise has not settled, it returns undefined.
         *
         * @returns {boolean}
         */
        get isCancelled() {
            return this._isCancelled;
        }

        cancel(reason = "promise was discarded by the caller") {

            // If someone calls reset on a previously constructed When object,
            // we discard the previous state by rejecting the promise before
            // creating a brand new one in its place.

            if (this._ctorCompletion) {

                if (this._reject) {
                    this._reject(new OperationCancellationError(reason));
                } else {

                    // If we get here, that means someone constructed an
                    // When object, but before the object is fully formed,
                    // they called cancel method on it. For example,
                    //
                    //  new When().cancel();
                    //
                    // While this is syntactically valid, if someone is
                    // doing this, they really do not understand what When
                    // object is or how to use it. Teach them a lesson.

                    throw new Error(
                        "When instance object cannot be cancelled before " +
                        "it is fully constructed"
                    );
                }
            }//end of if (this._ctorCompletion)

            this._isSettled = true;
            this._isResolved = false;
            this._isRejected = false;
            this._isCancelled = true;
        }

        /**
         * Resets the status of the previously constructed promise. If there
         * was a pending promise, it is rejected with CancellationError.
         *
         * @returns {Promise<When>}
         */
        async reset() {

            this.cancel();

            this._isSettled = false;
            delete this._isResolved;
            delete this._isRejected;
            delete this._isCancelled;

            // By the time this._ctorCompletion is resolved, it is guaranteed
            // that we have this._resolve and this._reject functions assigned.
            this._ctorCompletion = new Promise(ctorComplete => {
                this._promise = new Promise((resolve, reject) => {
                    this._resolve = resolve;
                    this._reject = reject;
                    ctorComplete(); //resolves this._ctorCompletion
                });
            });

            return this;
        }

        async resolve(...args) {
            await this._ctorCompletion;
            this._resolve(...args);
            this._isSettled = true;
            this._isResolved = true;
            this._isRejected = false;
            this._isCancelled = false;
        }

        async reject(...args) {
            await this._ctorCompletion;
            this._reject(...args);
            this._isSettled = true;
            this._isResolved = false;
            this._isRejected = true;
            this._isCancelled = false;
        }

        get ready() {
            return this._ctorCompletion.then(() => this._promise);
        }
    };

})(Reedable);