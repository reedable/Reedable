/**
 * Given a function, returns an asynchronous function that throttles the
 * function execution. If the returned function is called in quick succession,
 * only the first one within a specified time period is executed, and the later
 * calls are discarded.
 *
 * This function is useful when throttling the user input where only the first
 * input matters. For example, if there is a resource intensive operation that
 * can be invoked by the user (mouse click, enter key, etc). In order to avoid
 * overloading the system, the only the first mouse click is honored and the
 * rest are ignored.
 *
 * Usage)
 *
 *  function doSomethingExpensive() {
 *      for (let i = 0; i < 100000000; i++) {
 *          ....
 *      }
 *  }
 *
 *  var _doSomethingExpensive = throttle(doSomethingExpensive, 400);
 *
 *  _doSomethingExpensive(); //only the first one per 400ms is executed
 *  _doSomethingExpensive();
 *  _doSomethingExpensive();
 *  _doSomethingExpensive();
 */
export default function throttle(func, delay = 400) {

    if (typeof func !== "function") {
        throw new TypeError("throttle function is required");
    }

    let ts = 0;
    let promise = null;

    return function () {
        const _this = this;

        if (promise === null || Date.now() - ts > delay) {
            ts = Date.now();

            promise = new Promise((resolve, reject) => {
                try {
                    resolve(func.apply(_this, arguments));
                } catch (e) {
                    reject(e);
                }
            });
        }

        return promise;
    };
}
