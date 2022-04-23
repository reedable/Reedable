import {OperationCancellationError} from "./OperationCancellationError";
import {describe, it} from "@jest/globals";

describe("OperationCancellationError", function () {

    it("sets empty message when not args are passed", () => {
        const sut = new OperationCancellationError();
        expect(sut.message).toBe("");
    });

    it("sets method name as message", () => {
        const sut = new OperationCancellationError("hello");
        expect(sut.message).toBe("hello");
    });
});
