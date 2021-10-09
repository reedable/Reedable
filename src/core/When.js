import {OperationCancellationError} from "./errors/OperationCancellationError";

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
export class When {

    constructor() {
        this.prepare();
    }

    prepare() {
        this._ctorComplete = new Promise(ctorComplete => {
            this._promise = new Promise((resolve, reject) => {
                this._resolve = resolve;
                this._reject = reject;
                ctorComplete();
            });
        });

        return this;
    }

    /**
     * Resets the status of the object by rejecting the previously
     * constructed promise with OperationCancellationError. Creates
     * a new promise in its place.
     *
     * @returns {Promise<When>}
     */
    async reset(reason = "promise was discarded by the caller") {
        await this._ctorComplete;
        this._reject(new OperationCancellationError(reason));
        return this.prepare();
    }

    async resolve(...args) {
        await this._ctorComplete;
        this._resolve(...args);
    }

    async reject(...args) {
        await this._ctorComplete;
        this._reject(...args);
    }

    get ready() {
        return this._ctorComplete.then(() => this._promise);
    }
}