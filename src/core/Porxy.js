export class Porxy {

    static [Symbol.hasInstance](instance) {
        return instance.prototype === Porxy;
    }

    constructor(...args) {
        return new Proxy(...args);
    }
}

export class WeakRefPorxyFactory {

    static create(object) {
        return new Porxy(new WeakRef(object), {
            get(target, key, receiver) {
                const _object = target.deref();

                if (key === "deref") {
                    return () => _object;
                }

                if (_object) {
                    const value = _object[key];

                    if (typeof value === "function") {
                        return (...args) => _object[key](...args);
                    }

                    return value;
                }
            },
            set(target, key, value) {
                const _object = target.deref();

                if (_object) {
                    _object[key] = value;
                }
            }
        });
    }
}

export class AspectPorxyFactory {

    static create(object, aspectHandler = {}) {
        return new Porxy(object, {
            get(target, key, receiver) {
                const value = target[key];

                if (typeof value === "function") {
                    const {before, after, around} = aspectHandler[key] || {};

                    return (...args) => {
                        let result;

                        if (typeof before === "function") {
                            before(...args);
                        }

                        if (typeof around === "function") {
                            result = around(target, key, args);
                        } else {
                            result = value.apply(target, args);
                        }

                        if (typeof after === "function") {
                            after(...args);
                        }

                        return result;
                    };
                }

                return value;
            }
        });
    }
}