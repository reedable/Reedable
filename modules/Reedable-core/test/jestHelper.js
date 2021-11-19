import {deep} from "../deep";
import {jest} from "@jest/globals";

export function deepSpy(object) {
    return deep(object, (value, parent, key) => {

        if (typeof value === "function") {

            if (typeof parent === "undefined") {
                // deepSpy on class constructor? spyOn static methods
                return Object.getOwnPropertyNames(value).reduce((r, e) => {

                    if (typeof value[e] === "function") {
                        r[e] = jest.spyOn(value, e);
                    }

                    return r;

                }, function () {
                    //noop
                });
            }

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
                //console.log(e);
            }
        }
    });
}