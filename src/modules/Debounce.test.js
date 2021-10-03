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

    describe("Missing argument to", function () {

        it("Debounce.trailing() returns a noop function", (done) => {
            const sut = Debounce.trailing();

            sut().then((result) => {
                expect(result).toBe(undefined);
            }, (e) => {
                throw e;
            }).then(done, done);

            jest.advanceTimersByTime(400);
        });

        it("Debounce.leading() returns a noop function", (done) => {
            const sut = Debounce.leading();

            sut().then((result) => {
                expect(result).toBe(undefined);
            }, (e) => {
                throw e;
            }).then(done, done);

            jest.advanceTimersByTime(400);
        });
    });

    describe("Function that throws an Error passed to", function () {

        it("Debounce.trailing() returns a function that returns the Error as a Promise rejection", (done) => {
            const fn = jest.fn(() => {
                throw "Hello, world!";
            });
            const sut = Debounce.trailing(function () {
                return fn();
            });

            sut().then(() => {
                throw new Error("We should not get here.");
            }, (e) => {
                expect(e).toBe("Hello, world!");
            }).then(done, done);

            jest.advanceTimersByTime(400);
        });

        it("Debounce.leading() returns a function that returns the Error as a Promise rejection", (done) => {
            const fn = jest.fn(() => {
                throw "Hello, world!";
            });
            const sut = Debounce.leading(function () {
                return fn();
            });

            sut().then(() => {
                throw new Error("We should not get here.");
            }, (e) => {
                expect(e).toBe("Hello, world!");
            }).then(done, done);

            jest.advanceTimersByTime(400);
        });
    })

    describe("Debounce.trailing creates a debounced function, which", function () {

        it("executes only the last time when each successive call is within the 400ms window", async () => {
            const all = [];
            const fn = jest.fn(v => v);
            const sut = Debounce.trailing(function (value) {
                return fn(value);
            });

            all.push(sut("Hello, One!")
                .then(result => expect(result).toBe("Hello, Nine!")),
            );
            expect(fn.mock.calls.length).toBe(0);

            // 101ms since the first call
            // 101ms since the last call
            jest.advanceTimersByTime(101);
            await new Promise(x => x());
            all.push(sut("Hello, Two!")
                .then(result => expect(result).toBe("Hello, Nine!")),
            );
            expect(fn.mock.calls.length).toBe(0);

            // 202ms since the first call
            // 101ms since the last call
            jest.advanceTimersByTime(101);
            await new Promise(x => x());
            all.push(sut("Hello, Three!")
                .then(result => expect(result).toBe("Hello, Nine!")),
            );
            expect(fn.mock.calls.length).toBe(0);

            // 303ms since the first call
            // 101ms since the last call
            jest.advanceTimersByTime(101);
            await new Promise(x => x());
            all.push(sut("Hello, Four!")
                .then(result => expect(result).toBe("Hello, Nine!")),
            );
            expect(fn.mock.calls.length).toBe(0);

            // 404ms since the first call
            // 101ms since the last call
            jest.advanceTimersByTime(101);
            await new Promise(x => x());
            all.push(sut("Hello, Five!")
                .then(result => expect(result).toBe("Hello, Nine!")),
            );
            expect(fn.mock.calls.length).toBe(0);

            // 505ms since the first call
            // 101ms since the last call
            jest.advanceTimersByTime(101);
            await new Promise(x => x());
            all.push(sut("Hello, Six!")
                .then(result => expect(result).toBe("Hello, Nine!")),
            );
            expect(fn.mock.calls.length).toBe(0);

            // 606ms since the first call
            // 101ms since the last call
            jest.advanceTimersByTime(101);
            await new Promise(x => x());
            all.push(sut("Hello, Seven!")
                .then(result => expect(result).toBe("Hello, Nine!")),
            );
            expect(fn.mock.calls.length).toBe(0);

            // 707ms since the first call
            // 101ms since the last call
            jest.advanceTimersByTime(101);
            await new Promise(x => x());
            all.push(sut("Hello, Eight!")
                .then(result => expect(result).toBe("Hello, Nine!")),
            );
            expect(fn.mock.calls.length).toBe(0);

            // 808ms since the first call
            // 101ms since the last call
            jest.advanceTimersByTime(101);
            await new Promise(x => x());
            all.push(sut("Hello, Nine!")
                .then(result => expect(result).toBe("Hello, Nine!")),
            );
            expect(fn.mock.calls.length).toBe(0);

            //
            // Long enough pause...
            //

            // 1209ms since the first call
            // 401ms since the last call
            jest.advanceTimersByTime(401);
            await new Promise(x => x());
            expect(fn.mock.calls.length).toBe(1);

            return Promise.all(all);
        });

        it("executes only the last of the consecutive calls separated by 400ms pause", async () => {
            const all = [];
            const fn = jest.fn(v => v);
            const sut = Debounce.trailing(function (value) {
                return fn(value);
            });

            all.push(sut("Hello, One!")
                .then(result => expect(result).toBe("Hello, Six!")),
            );
            expect(fn.mock.calls.length).toBe(0);

            // 101ms since the first call
            // 101ms since the last call
            jest.advanceTimersByTime(101);
            await new Promise(x => x());
            all.push(sut("Hello, Two!")
                .then(result => expect(result).toBe("Hello, Six!")),
            );
            expect(fn.mock.calls.length).toBe(0);

            // 202ms since the first call
            // 101ms since the last call
            jest.advanceTimersByTime(101);
            await new Promise(x => x());
            all.push(sut("Hello, Three!")
                .then(result => expect(result).toBe("Hello, Six!")),
            );
            expect(fn.mock.calls.length).toBe(0);

            // 303ms since the first call
            // 101ms since the last call
            jest.advanceTimersByTime(101);
            await new Promise(x => x());
            all.push(sut("Hello, Four!")
                .then(result => expect(result).toBe("Hello, Six!")),
            );
            expect(fn.mock.calls.length).toBe(0);

            // 404ms since the first call
            // 101ms since the last call
            jest.advanceTimersByTime(101);
            await new Promise(x => x());
            all.push(sut("Hello, Five!")
                .then(result => expect(result).toBe("Hello, Six!")),
            );
            expect(fn.mock.calls.length).toBe(0);

            // 505ms since the first call
            // 101ms since the last call
            jest.advanceTimersByTime(101);
            await new Promise(x => x());
            all.push(sut("Hello, Six!")
                .then(result => expect(result).toBe("Hello, Six!")),
            );
            expect(fn.mock.calls.length).toBe(0);

            //
            // Long enough pause...
            //

            // 906ms since the first call
            // 401ms since the last call
            jest.advanceTimersByTime(401);
            await new Promise(x => x());
            all.push(sut("Hello, Seven!")
                .then(result => expect(result).toBe("Hello, Nine!")),
            );
            expect(fn.mock.calls.length).toBe(1);

            // 1007ms since the first call
            // 101ms since the last call
            jest.advanceTimersByTime(101);
            await new Promise(x => x());
            all.push(sut("Hello, Eight!")
                .then(result => expect(result).toBe("Hello, Nine!")),
            );
            expect(fn.mock.calls.length).toBe(1);

            // 1108ms since the first call
            // 101ms since the last call
            jest.advanceTimersByTime(101);
            await new Promise(x => x());
            all.push(sut("Hello, Nine!")
                .then(result => expect(result).toBe("Hello, Nine!")),
            );
            expect(fn.mock.calls.length).toBe(1);

            //
            // Long enough pause...
            //

            // 1209ms since the first call
            // 401ms since the last call
            jest.advanceTimersByTime(401);
            await new Promise(x => x());
            expect(fn.mock.calls.length).toBe(2);

            return Promise.all(all);
        });
    });

    describe("Debounce.leading creates a debounced function, which", function () {

        it("executes only the first time when each successive call is within the 400ms window", async () => {
            const all = [];
            const fn = jest.fn(v => v);
            const sut = Debounce.leading(function (value) {
                return fn(value);
            });

            all.push(sut("Hello, One!")
                .then(result => expect(result).toBe("Hello, One!")),
            );
            expect(fn.mock.calls.length).toBe(1);

            // 101ms since the first call
            // 101ms since the last call
            jest.advanceTimersByTime(101);
            await new Promise(x => x());
            all.push(sut("Hello, Two!")
                .then(result => expect(result).toBe("Hello, One!")),
            );
            expect(fn.mock.calls.length).toBe(1);

            // 202ms since the first call
            // 101ms since the last call
            jest.advanceTimersByTime(101);
            await new Promise(x => x());
            all.push(sut("Hello, Three!")
                .then(result => expect(result).toBe("Hello, One!")),
            );
            expect(fn.mock.calls.length).toBe(1);

            // 303ms since the first call
            // 101ms since the last call
            jest.advanceTimersByTime(101);
            await new Promise(x => x());
            all.push(sut("Hello, Four!")
                .then(result => expect(result).toBe("Hello, One!")),
            );
            expect(fn.mock.calls.length).toBe(1);

            // 404ms since the first call
            // 101ms since the last call
            jest.advanceTimersByTime(101);
            await new Promise(x => x());
            all.push(sut("Hello, Five!")
                .then(result => expect(result).toBe("Hello, One!")),
            );
            expect(fn.mock.calls.length).toBe(1);

            // 505ms since the first call
            // 101ms since the last call
            jest.advanceTimersByTime(101);
            await new Promise(x => x());
            all.push(sut("Hello, Six!")
                .then(result => expect(result).toBe("Hello, One!")),
            );
            expect(fn.mock.calls.length).toBe(1);

            // 606ms since the first call
            // 101ms since the last call
            jest.advanceTimersByTime(101);
            await new Promise(x => x());
            all.push(sut("Hello, Seven!")
                .then(result => expect(result).toBe("Hello, One!")),
            );
            expect(fn.mock.calls.length).toBe(1);

            // 707ms since the first call
            // 101ms since the last call
            jest.advanceTimersByTime(101);
            await new Promise(x => x());
            all.push(sut("Hello, Eight!")
                .then(result => expect(result).toBe("Hello, One!")),
            );
            expect(fn.mock.calls.length).toBe(1);

            // 808ms since the first call
            // 101ms since the last call
            jest.advanceTimersByTime(101);
            await new Promise(x => x());
            all.push(sut("Hello, Nine!")
                .then(result => expect(result).toBe("Hello, One!")),
            );
            expect(fn.mock.calls.length).toBe(1);

            return Promise.all(all);
        });

        it("executes only the first of the consecutive calls separated by 400ms pause", async () => {
            const all = [];
            const fn = jest.fn(v => v);
            const sut = Debounce.leading(function (value) {
                return fn(value);
            });

            all.push(sut("Hello, One!")
                .then(result => expect(result).toBe("Hello, One!")),
            );
            expect(fn.mock.calls.length).toBe(1);

            // 101ms since the first call
            // 101ms since the last call
            jest.advanceTimersByTime(101);
            await new Promise(x => x());
            all.push(sut("Hello, Two!")
                .then(result => expect(result).toBe("Hello, One!")),
            );
            expect(fn.mock.calls.length).toBe(1);

            // 202ms since the first call
            // 101ms since the last call
            jest.advanceTimersByTime(101);
            await new Promise(x => x());
            all.push(sut("Hello, Three!")
                .then(result => expect(result).toBe("Hello, One!")),
            );
            expect(fn.mock.calls.length).toBe(1);

            // 303ms since the first call
            // 101ms since the last call
            jest.advanceTimersByTime(101);
            await new Promise(x => x());
            all.push(sut("Hello, Four!")
                .then(result => expect(result).toBe("Hello, One!")),
            );
            expect(fn.mock.calls.length).toBe(1);

            // 404ms since the first call
            // 101ms since the last call
            jest.advanceTimersByTime(101);
            await new Promise(x => x());
            all.push(sut("Hello, Five!")
                .then(result => expect(result).toBe("Hello, One!")),
            );
            expect(fn.mock.calls.length).toBe(1);

            // 505ms since the first call
            // 101ms since the last call
            jest.advanceTimersByTime(101);
            await new Promise(x => x());
            all.push(sut("Hello, Six!")
                .then(result => expect(result).toBe("Hello, One!")),
            );
            expect(fn.mock.calls.length).toBe(1);

            //
            // Long enough pause...
            //

            // 906ms since the first call
            // 401ms since the last call
            jest.advanceTimersByTime(401);
            await new Promise(x => x());
            all.push(sut("Hello, Seven!")
                .then(result => expect(result).toBe("Hello, Seven!")),
            );
            expect(fn.mock.calls.length).toBe(2);

            // 1007ms since the first call
            // 101ms since the last call
            jest.advanceTimersByTime(101);
            await new Promise(x => x());
            all.push(sut("Hello, Eight!")
                .then(result => expect(result).toBe("Hello, Seven!")),
            );
            expect(fn.mock.calls.length).toBe(2);

            // 1108ms since the first call
            // 101ms since the last call
            jest.advanceTimersByTime(101);
            await new Promise(x => x());
            all.push(sut("Hello, Nine!")
                .then(result => expect(result).toBe("Hello, Seven!")),
            );
            expect(fn.mock.calls.length).toBe(2);

            return Promise.all(all);
        });
    });
});