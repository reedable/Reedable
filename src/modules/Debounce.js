/**
 * Provides function debouncing.
 *
 * Usage
 * =====
 *
 *  import Debounce from "./Debounce";
 *
 *  const debouncedFn = Debounce.trailing(() => {
 *      console.log("Hello");
 *  });
 *
 *  for (var i = 0; i < 1000000; i++) {
 *      debouncedFn();
 *  }
 *
 * In above example, even though we call the debouncedFn in
 * a tight loop, we only print "Hello" once at the very end.
 * This is because each successive call is executed well below
 * the 400ms threshold (default delay).
 *
 *
 * Function execution timing
 * =========================
 *
 * Debouncing will reduce a large number of successive calls, and
 * only when there is a sufficiently large break in the activity
 * (specified by the delay parameter) that we execute the actual
 * function call.
 *
 * Debounce.leading and Debounce.trailing are similar, but they key
 * difference is that Debounce.leading will execute the first of the
 * successive call to the debounced function, whereas the
 *
 * Consider the following hypothetical scenarios. The user calls
 * the same function in three bursts. Five times in the first series,
 * followed by three in the second series, and seven times in the
 * third series, with enough pause in between to clear the delay.
 *
 * Each broken pipe represents a function call. The ones with an
 * arrow below are the calls that are executed.
 *
 *
 * Debounce.leading
 * ----------------
 *
 *  First call in each series is executed immediately.
 *
 *  || ||| <--delay--> || | <--delay--> |||||||
 *  ^                  ^                ^
 *  |                  |                |
 *  |                  |                |
 *  |                  |                |
 *
 *
 * Debounce.trailing
 * -----------------
 *
 *  Last call in each series is executed after a period of delay.
 *
 *  || ||| <--delay--> || | <--delay--> ||||||| <--delay-->
 *       ^                ^                   ^
 *       |                |                   |
 *       +------------+   +------------+      +------------+
 *                    |                |                   |
 *
 */
export default {leading, trailing};

function noop() {
}

function leading(fn = noop, delay = 400) {
    let ts = 0;
    let promise;

    return function () {
        const _this = this;
        const _args = arguments;

        if (Date.now() - ts > delay) {
            promise = new Promise((resolve) => {
                resolve(fn.apply(_this, _args));
            });
        }

        ts = Date.now();

        return promise;
    };
}

function trailing(fn = noop, delay = 400) {
    let tid;
    let promise;
    let done;
    let _this = null;
    let _args = null;

    return function () {
        _this = this;
        _args = arguments;

        if (promise) {
            clearTimeout(tid);
            tid = setTimeout(done, delay);
            return promise;
        }

        promise = new Promise((resolve) => {
            done = resolve;
            tid = setTimeout(done, delay);
        }).then(() => {
            promise = null;
            return fn.apply(_this, _args);
        });

        return promise;
    };
}
