export function deep(value, callback, parent, key) {
    if (value && Array.isArray(value)) {
        return value.map((e, i) => {
            return deep(e, callback, value, i);
        });
    } else if (typeof value === "object" && value !== null) {
        return Object.keys(value).reduce((result, key) => {
            result[key] = deep(value[key], callback, value, key);
            return result;
        }, {});
    } else {
        if (typeof callback === "function") {
            return callback(value, parent, key);
        } else {
            return value;
        }
    }
}
