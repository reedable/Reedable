import {deep} from "./deep";
import {describe, it} from "@jest/globals";

describe("deep", function () {

    it("returns undefined if nothing is provided", () => {
        expect(deep()).toBe(undefined);
    });

    it("returns a deep clone of the object provided by default", () => {
        const foo = {};
        const bar = {
            "foo": foo
        };
        const obj = {
            "bar": bar,
            "one": 1,
            "two": null,
            "three": [3, "3", "three"],
            "four": NaN,
            "five": undefined
        };

        const clone = deep(obj);
        expect(clone).toEqual(obj);
        expect(clone).not.toBe(obj);
        expect(clone.bar).toEqual(bar);
        expect(clone.bar).not.toBe(bar);
        expect(clone.bar.foo).toEqual(foo);
        expect(clone.bar.foo).not.toBe(foo);
    });
});