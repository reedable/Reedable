import {OperationCancellationError} from "./errors/OperationCancellationError";
import {When} from "./When";

describe("When", function () {

    it("resolves the promise with a value", async () => {
        const sut = new When();

        await sut.resolve("Hello");

        expect(await sut.ready).toBe("Hello");
    });

    it("rejects the promise with a value", async () => {
        const sut = new When();

        await sut.reject("Hello");

        try {
            await sut.ready;
        } catch (e) {
            expect(e).toBe("Hello");
            return;
        }

        throw "The promise should have been rejected";
    });

    it("resolves the first promise if the When object is cancelled after it is resolved", async () => {
        const sut = new When();
        const whenReady = sut.ready;

        await sut.resolve("Hello");
        await sut.reset();

        expect(await whenReady).toBe("Hello");
    });

    it("rejects the first promise if the When object is cancelled before it is ever resolved", async () => {
        const sut = new When();
        const whenReady = sut.ready;

        await sut.reset();

        try {
            await whenReady;
        } catch (e) {
            expect(e).toBeInstanceOf(OperationCancellationError);

            return;
        }

        throw "The first promise should have been rejected";
    });
});