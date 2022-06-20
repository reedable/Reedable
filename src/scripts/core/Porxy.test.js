import {Porxy} from "./Porxy";
import {describe} from "@jest/globals";

describe("Porxy", function () {

    it("is an instanceof Porxy", () => {
        const handler = {
            get(target, key) {
                return target[key];
            }
        };
        const sut = new Porxy({}, handler);

        expect(sut).toBeInstanceOf(Porxy);
    });

    it("acts as a Proxy", () => {
        const handler = {
            get(target, key) {
                return target[key];
            }
        };

        const sut = new Porxy({
            "foo": "FOO"
        }, handler);

        const getSpy = jest.spyOn(handler, "get");

        expect(getSpy).toHaveBeenCalledTimes(0);

        const foo = sut.foo;

        expect(foo).toBe("FOO");
        expect(getSpy).toHaveBeenCalledTimes(1);

        const bar = sut.bar;

        expect(bar).toBe(undefined);
        expect(getSpy).toHaveBeenCalledTimes(2);
    });
});
