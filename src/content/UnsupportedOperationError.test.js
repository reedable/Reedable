require("./UnsupportedOperationError");

describe("UnsupportedOperationError", function () {

    it("sets empty message when not args are passed", () => {
        const error = new Reedable.UnsupportedOperationError();
        expect(error.message).toBe("");
    });

    it("sets method name as message", () => {
        const error = new Reedable.UnsupportedOperationError("hello");
        expect(error.message).toBe("hello()");
    });

    it("sets method name with arguments as message", () => {
        const error = new Reedable.UnsupportedOperationError("hello", "foo", "bar");
        expect(error.message).toBe("hello(foo, bar)");
    });
});
