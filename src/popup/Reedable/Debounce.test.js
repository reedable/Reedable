import Debounce from "./Debounce";

/**
 * What is this thing?
 *
 *   await new Promise(x => x());
 *
 *   It is used to flush pending resolvable promises. We block on a
 *   promise that resolves itself immediately upon construction. If
 *   there were any pending promises in the queue that are eligible
 *   for resolution, they should be resolved first before this one
 *   is fulfilled.
 */
describe("Debounce", function () {

    beforeEach(() => {
        jest.useFakeTimers();
    });

    afterEach(() => {
        jest.useRealTimers();
    });

    describe("Debounce.trailing creates a debounced function, which", function () {

        it("returns a Promise for noop if no function was provided", (done) => {
            const debouncedFn = Debounce.trailing();

            debouncedFn().then((result) => {
                expect(result).toBe(undefined);
            }, (e) => {
                throw e;
            }).then(done, done);

            jest.advanceTimersByTime(400);
        });

        it("returns a Promise", (done) => {
            const fn = jest.fn(() => "Hello, world!");
            const debouncedFn = Debounce.trailing(function () {
                return fn();
            });

            debouncedFn().then((result) => {
                expect(result).toBe("Hello, world!");
            }, (e) => {
                throw e;
            }).then(done, done);

            jest.advanceTimersByTime(400);
        });

        it("rejects a Promise if the underlying function throws an Error", (done) => {
            const fn = jest.fn(() => {
                throw "Hello, world!";
            });
            const debouncedFn = Debounce.trailing(function () {
                return fn();
            });

            debouncedFn().then(() => {
                throw new Error("We should not get here.");
            }, (e) => {
                expect(e).toBe("Hello, world!");
            }).then(done, done);

            jest.advanceTimersByTime(400);
        });

        it("executes only once with 400ms default delay", async () => {
            const all = [];
            const fn = jest.fn(v => v);
            const debouncedFn = Debounce.trailing(function (value) {
                return fn(value);
            });

            // Debounced function is not executed right away.
            all.push(
                debouncedFn("Hello, One!").then(result => {
                    expect(result).toBe("Hello, Three!");
                }),
            );
            expect(fn.mock.calls.length).toBe(0);

            // Debounced function is not executed even if another call follows
            // it immediately.
            all.push(
                debouncedFn("Hello, Two!").then(result => {
                    expect(result).toBe("Hello, Three!");
                }),
            );
            expect(fn.mock.calls.length).toBe(0);

            // Within the delay threshold (default value 400), any successive
            // calls are ignored.
            jest.advanceTimersByTime(100);
            all.push(
                debouncedFn("Hello, Three!").then(result => {
                    expect(result).toBe("Hello, Three!");
                }),
            );
            expect(fn.mock.calls.length).toBe(0);

            // 410ms has passed since the first call.
            // 310ms since the last call.
            // The underlying function should not have been executed yet.
            jest.advanceTimersByTime(310);
            await new Promise(x => x());
            expect(fn.mock.calls.length).toBe(0);

            // 1410ms has passed since the first call.
            // 1310ms since the last call.
            // The underlying function should have been executed with the
            // last execution context and arguments.
            jest.advanceTimersByTime(1000);
            await new Promise(x => x());
            expect(fn.mock.calls.length).toBe(1);

            // 2410ms has passed since the first call.
            // 2310ms since the last call, which already executed.
            // The debounced function remains dormant.
            jest.advanceTimersByTime(2000);
            await new Promise(x => x());
            expect(fn.mock.calls.length).toBe(1);

            // Once the debounced function has executed, then it will allow
            // another execution of the function, following the same rules.
            all.push(
                debouncedFn("Hello, Four!").then(result => {
                    expect(result).toBe("Hello, Four!");
                }),
            );
            expect(fn.mock.calls.length).toBe(1);

            // 2510ms since the first call.
            // 2410ms since the call for previous execution.
            // 100ms since the new call.
            // The new call should not have been executed yet.
            jest.advanceTimersByTime(100);
            await new Promise(x => x());
            expect(fn.mock.calls.length).toBe(1);

            // 2820ms since the first call.
            // 2720ms since the call for previous execution.
            // 410ms since the new call.
            // The new call should have been executed.
            jest.advanceTimersByTime(310);
            await new Promise(x => x());
            expect(fn.mock.calls.length).toBe(2);

            return Promise.all(all);
        });
    });

    describe("Debounce.leading creates a debounced function, which", function () {

        it("returns a Promise for noop if no function was provided", (done) => {
            const debouncedFn = Debounce.leading();

            debouncedFn().then((result) => {
                expect(result).toBe(undefined);
            }, (e) => {
                throw e;
            }).then(done, done);

            jest.advanceTimersByTime(400);
        });

        it("returns a Promise", (done) => {
            const fn = jest.fn(() => "Hello, world!");
            const debouncedFn = Debounce.leading(function () {
                return fn();
            });

            debouncedFn().then((result) => {
                expect(result).toBe("Hello, world!");
            }, (e) => {
                throw e;
            }).then(done, done);

            jest.advanceTimersByTime(400);
        });

        it("rejects a Promise if the underlying function throws an Error", (done) => {
            const fn = jest.fn(() => {
                throw "Hello, world!";
            });
            const debouncedFn = Debounce.leading(function () {
                return fn();
            });

            debouncedFn().then(() => {
                throw new Error("We should not get here.");
            }, (e) => {
                expect(e).toBe("Hello, world!");
            }).then(done, done);

            jest.advanceTimersByTime(400);
        });

        it("executes only once with 400ms default delay", async () => {
            const all = [];
            const fn = jest.fn(v => v);
            const debouncedFn = Debounce.leading(function (value) {
                return fn(value);
            });

            // Debounced function is executed right away.
            all.push(
                debouncedFn("Hello, One!").then(result => {
                    expect(result).toBe("Hello, One!");
                }),
            );
            expect(fn.mock.calls.length).toBe(1);

            // Debounced function is not executed even if another call follows
            // it immediately.
            all.push(
                debouncedFn("Hello, Two!").then(result => {
                    expect(result).toBe("Hello, One!");
                }),
            );
            expect(fn.mock.calls.length).toBe(1);

            // Within the delay threshold (default value 400), any successive
            // calls are ignored.
            jest.advanceTimersByTime(100);
            all.push(
                debouncedFn("Hello, Three!").then(result => {
                    expect(result).toBe("Hello, One!");
                }),
            );
            expect(fn.mock.calls.length).toBe(1);

            // 410ms has passed since the first call.
            // 310ms since the last call.
            jest.advanceTimersByTime(310);
            await new Promise(x => x());
            expect(fn.mock.calls.length).toBe(1);

            // 1410ms has passed since the first call.
            // 1310ms since the last call.
            jest.advanceTimersByTime(1000);
            await new Promise(x => x());
            expect(fn.mock.calls.length).toBe(1);

            // 2410ms has passed since the first call.
            // 2310ms since the last call, which already executed.
            // The debounced function is available once again to execute.
            jest.advanceTimersByTime(2000);
            await new Promise(x => x());
            expect(fn.mock.calls.length).toBe(1);

            // Once the debounced function has executed, then it will allow
            // another execution of the function, following the same rules.
            all.push(
                debouncedFn("Hello, Four!").then(result => {
                    expect(result).toBe("Hello, Four!");
                }),
            );
            expect(fn.mock.calls.length).toBe(2);

            // 2510ms since the first call.
            // 2410ms since the call for previous execution.
            // 100ms since the new call.
            jest.advanceTimersByTime(100);
            await new Promise(x => x());
            expect(fn.mock.calls.length).toBe(2);

            // 2820ms since the first call.
            // 2720ms since the call for previous execution.
            // 410ms since the new call.
            jest.advanceTimersByTime(310);
            await new Promise(x => x());
            expect(fn.mock.calls.length).toBe(2);

            return Promise.all(all);
        });
    });
});