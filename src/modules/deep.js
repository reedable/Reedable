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
