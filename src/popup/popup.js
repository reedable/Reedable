/**
 * Given a function, returns an asynchronous function that debounces the
 * function execution. If the returned function is called in quick succession,
 * only the last call within the specified delay is executed, and any earlier
 * calls are discarded.
 *
 * The function is useful when debouncing the user input where only the last
 * input matters. Consider, for example, a type-ahead functionality for a
 * Search box. As the user types, we perform the look-up, but if we did the
 * search on every single keystroke synchronously, the page may freeze. By
 * debouncing the type-ahead function, we only execute the user's last query,
 * and not the earlier ones, which become irrelevant as soon as the user types
 * another character into the field.
 *
 * Usage)
 *
 *  function doSomething(foo, bar) {
 *      return foo + bar;
 *  }
 *
 *  const _doSomething = debounce(doSomething, 400);
 *
 *  _doSomething("FOO", "BAR");
 *  _doSomething("FOO", "BAZ");
 *  _doSomething("FOO", "BOO");
 *  _doSomething("FOO", "HOO"); //only the last one per 400ms is executed
 */
function debounce(func, delay = 400) {

    if (typeof func !== "function") {
        throw new TypeError("debounce function is required");
    }

    let tid = null;

    return function () {
        const _this = this;

        return new Promise((resolve, reject) => {
            clearTimeout(tid);

            tid = setTimeout(() => {
                try {
                    resolve(func.apply(_this, arguments));
                } catch (e) {
                    reject(e);
                }
            }, delay);
        });
    };
}

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
function throttle(func, delay = 400) {

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