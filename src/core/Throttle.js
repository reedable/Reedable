/**
 * Provides function throttling.
 *
 * Usage
 * =====
 *
 *  import {Throttle} from "./Throttle";
 *
 *  const throttledFn = Throttle.leading(() => {
 *      console.log("Hello");
 *  });
 *
 *  for (var i = 0; i < 1000000; i++) {
 *      throttledFn();
 *  }
 *
 * In the above example, even though we call the throttledFn in
 * a tight loop, we do not print 1000000 "Hello" to the console.
 * It prints "Hello" only every 400ms (default delay).
 *
 *
 * Function execution timing
 * =========================
 *
 * Throttling will reduce a large number of successive calls into
 * a regularly spaced, fewer number of calls. The actual function
 * calls are separated by the delay specified by the argument.
 *
 * Throttle.leading and Throttle.trailing are similar, but the key
 * difference is that Throttle.leading will honor the very first
 * function call, while the Throttle.trailing does not.
 *
 * Consider the following hypothetical scenarios. The user calls
 * the same function in a continuous stream with very little rest
 * in between.
 *
 * Each broken pipe represents a function call. The ones with an
 * arrow below are the calls that are executed.
 *
 *
 *
 * Throttle.leading
 * ----------------
 *
 *   ||||| || || |||||| ||  |||| ||||| ||
 *   ^             ^             ^
 *   |             |             |
 *   | <--delay--> | <--delay--> |
 *   |             |             |
 *
 *
 * Throttle.trailing
 * -----------------
 *
 *   ||||| || || |||||| ||  |||| ||||| ||
 *               ^             ^
 *               |             |
 *   <--delay--> | <--delay--> |
 *               |             |
 *
 */
export class Throttle {

    static leading(...args) {
        return leading(...args);
    }

    static trailing(...args) {
        return trailing(...args);
    }
}

function noop() {
}

function leading(fn = noop, delay = 400) {
    let ts = 0;
    let promise;

    return function () {
        const _this = this;
        const _args = arguments;

        if (Date.now() - ts > delay) {
            ts = Date.now();
            promise = new Promise((resolve) => {
                resolve(fn.apply(_this, _args));
            });
        }

        return promise;
    };
}

function trailing(fn = noop, delay = 400) {
    let promise;
    let done;
    let _this = null;
    let _args = null;

    return function () {
        _this = this;
        _args = arguments;

        if (promise) {
            return promise;
        }

        promise = new Promise((resolve) => {
            done = resolve;
            setTimeout(done, delay);
        }).then(() => {
            promise = null;
            return fn.apply(_this, _args);
        });

        return promise;
    };
}