import {deep} from "../deep";
import {jest} from "@jest/globals";

export function deepSpy(object) {
    return deep(object, (value, parent, key) => {
        if (typeof value === "function") {
            return jest.spyOn(parent, key);
        }

        return value;
    });
}

export function deepRestore(mockObject) {
    deep(mockObject, (value) => {
        if (typeof value === "function") {
            try {
                value.mockRestore();
            } catch (e) {
                console.log(e);
            }
        }
    });
}