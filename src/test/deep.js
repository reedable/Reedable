export function deep(object, callback, parent, key) {
    if (typeof object === "object" && object !== null) {
        return Object.keys(object).reduce((result, key) => {
            result[key] = deep(object[key], callback, object, key);
            return result;
        }, {});
    } else {
        return callback(object, parent, key);
    }
}

export function deepMock(object) {
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