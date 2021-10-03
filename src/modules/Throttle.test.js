import Throttle from "./Throttle";

describe("Throttle", function () {

    beforeEach(() => {
        jest.useFakeTimers();
    });

    afterEach(() => {
        jest.useRealTimers();
    });

    describe("Missing argument to", function () {

        it("Throttle.trailing() returns a Promise for noop if no function was provided", (done) => {
            const sut = Throttle.trailing();

            sut().then((result) => {
                expect(result).toBe(undefined);
            }, (e) => {
                throw e;
            }).then(done, done);

            jest.advanceTimersByTime(400);
        });

        it("Throttle.leading() returns a Promise for noop if no function was provided", (done) => {
            const sut = Throttle.leading();

            sut().then((result) => {
                expect(result).toBe(undefined);
            }, (e) => {
                throw e;
            }).then(done, done);

            jest.advanceTimersByTime(400);
        });
    });

    describe("Function that throws an Error passed to", function () {

        it("Throttle.trailing() returns a function that returns the Error as a Promise rejection", (done) => {
            const fn = jest.fn(() => {
                throw "Hello, world!";
            });
            const sut = Throttle.trailing(function () {
                fn();
            });

            sut().then(() => {
                throw new Error("We should not get here.");
            }, (e) => {
                expect(e).toBe("Hello, world!");
            }).then(done, done);

            jest.advanceTimersByTime(400);
        });

        it("Throttle.leading() returns a function that returns the Error as a Promise rejection", (done) => {
            const fn = jest.fn(() => {
                throw "Hello, world!";
            });
            const sut = Throttle.leading(function () {
                fn();
            });

            sut().then(() => {
                throw new Error("We should not get here.");
            }, (e) => {
                expect(e).toBe("Hello, world!");
            }).then(done, done);

            jest.advanceTimersByTime(400);
        });
    });

    describe("Throttle.trailing creates a throttled function, which", function () {

        it("executes every 400ms at the end of consecutive calls", async () => {
            const all = [];
            const fn = jest.fn(v => v);
            const sut = Throttle.trailing(function (value) {
                return fn(value);
            });

            all.push(sut("Hello, One!")
                .then(result => expect(result).toBe("Hello, Four!"))
            );
            expect(fn.mock.calls.length).toBe(0);

            // 101ms since the first call
            // 101ms since the last call
            jest.advanceTimersByTime(101);
            await new Promise(x => x());
            all.push(sut("Hello, Two!")
                .then(result => expect(result).toBe("Hello, Four!"))
            );
            expect(fn.mock.calls.length).toBe(0);

            // 202ms since the first call
            // 101ms since the last call
            jest.advanceTimersByTime(101);
            await new Promise(x => x());
            all.push(sut("Hello, Three!")
                .then(result => expect(result).toBe("Hello, Four!"))
            );
            expect(fn.mock.calls.length).toBe(0);

            // 303ms since the first call
            // 101ms since the last call
            jest.advanceTimersByTime(101);
            await new Promise(x => x());
            all.push(sut("Hello, Four!")
                .then(result => expect(result).toBe("Hello, Four!"))
            );
            expect(fn.mock.calls.length).toBe(0);

            // 404ms since the first call
            // 101ms since the last call
            jest.advanceTimersByTime(101);
            await new Promise(x => x());
            all.push(sut("Hello, Five!")
                .then(result => expect(result).toBe("Hello, Eight!"))
            );
            expect(fn.mock.calls.length).toBe(1);

            // 505ms since the first call
            // 101ms since the last call
            jest.advanceTimersByTime(101);
            await new Promise(x => x());
            all.push(sut("Hello, Six!")
                .then(result => expect(result).toBe("Hello, Eight!"))
            );
            expect(fn.mock.calls.length).toBe(1);

            // 606ms since the first call
            // 101ms since the last call
            jest.advanceTimersByTime(101);
            await new Promise(x => x());
            all.push(sut("Hello, Seven!")
                .then(result => expect(result).toBe("Hello, Eight!"))
            );
            expect(fn.mock.calls.length).toBe(1);

            // 707ms since the first call
            // 101ms since the last call
            jest.advanceTimersByTime(101);
            await new Promise(x => x());
            all.push(sut("Hello, Eight!")
                .then(result => expect(result).toBe("Hello, Eight!"))
            );
            expect(fn.mock.calls.length).toBe(1);

            // 808ms since the first call
            // 101ms since the last call
            jest.advanceTimersByTime(101);
            await new Promise(x => x());
            all.push(sut("Hello, Nine!")
                .then(result => expect(result).toBe("Hello, Nine!"))
            );
            expect(fn.mock.calls.length).toBe(2);

            //
            // Enough time elapses...
            //

            // 1209ms since the first call
            // 401ms since the last call
            jest.advanceTimersByTime(401);
            await new Promise(x => x());
            expect(fn.mock.calls.length).toBe(3);

            return Promise.all(all);
        });
    });

    describe("Throttle.leading creates a throttled function, which", function () {

        it("executes every 400ms at the start of consecutive calls", async () => {
            const all = [];
            const fn = jest.fn(v => v);
            const sut = Throttle.leading(function (value) {
                return fn(value);
            });

            all.push(sut("Hello, One!")
                .then(result => expect(result).toBe("Hello, One!")));
            expect(fn.mock.calls.length).toBe(1);

            // 101ms since the first call
            // 101ms since the last call
            jest.advanceTimersByTime(101);
            await new Promise(x => x());
            all.push(sut("Hello, Two!")
                .then(result => expect(result).toBe("Hello, One!")));
            expect(fn.mock.calls.length).toBe(1);

            // 202ms since the first call
            // 101ms since the last call
            jest.advanceTimersByTime(101);
            await new Promise(x => x());
            all.push(sut("Hello, Three!")
                .then(result => expect(result).toBe("Hello, One!")));
            expect(fn.mock.calls.length).toBe(1);

            // 303ms since the first call
            // 101ms since the last call
            jest.advanceTimersByTime(101);
            await new Promise(x => x());
            all.push(sut("Hello, Four!")
                .then(result => expect(result).toBe("Hello, One!")));
            expect(fn.mock.calls.length).toBe(1);

            // 404ms since the first call
            // 101ms since the last call
            jest.advanceTimersByTime(101);
            await new Promise(x => x());
            all.push(sut("Hello, Five!")
                .then(result => expect(result).toBe("Hello, Five!")));
            expect(fn.mock.calls.length).toBe(2);

            // 505ms since the first call
            // 101ms since the last call
            jest.advanceTimersByTime(101);
            await new Promise(x => x());
            all.push(sut("Hello, Six!")
                .then(result => expect(result).toBe("Hello, Five!")));
            expect(fn.mock.calls.length).toBe(2);

            // 606ms since the first call
            // 101ms since the last call
            jest.advanceTimersByTime(101);
            await new Promise(x => x());
            all.push(sut("Hello, Seven!")
                .then(result => expect(result).toBe("Hello, Five!")));
            expect(fn.mock.calls.length).toBe(2);

            // 707ms since the first call
            // 101ms since the last call
            jest.advanceTimersByTime(101);
            await new Promise(x => x());
            all.push(sut("Hello, Eight!")
                .then(result => expect(result).toBe("Hello, Five!")));
            expect(fn.mock.calls.length).toBe(2);

            // 808ms since the first call
            // 101ms since the last call
            jest.advanceTimersByTime(101);
            await new Promise(x => x());
            all.push(sut("Hello, Nine!")
                .then(result => expect(result).toBe("Hello, Nine!")));
            expect(fn.mock.calls.length).toBe(3);

            return Promise.all(all);
        });
    });
});