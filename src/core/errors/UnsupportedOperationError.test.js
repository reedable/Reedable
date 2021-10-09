import {UnsupportedOperationError} from "./UnsupportedOperationError";
import {describe, it} from "@jest/globals";

describe("UnsupportedOperationError", function () {

    it("sets empty message when not args are passed", () => {
        const sut = new UnsupportedOperationError();
        expect(sut.message).toBe("");
    });

    it("sets method name as message", () => {
        const sut = new UnsupportedOperationError("hello");
        expect(sut.message).toBe("hello");
    });
});
