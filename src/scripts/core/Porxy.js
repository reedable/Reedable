/**
 * Porxy is a Proxy, which we can identify as an instance of Porxy at runtime,
 * i.e.
 *
 *  const p = new Porxy({}, {});
 *  console.log(p instanceof Porxy); //--> true
 *
 * Otherwise, there is really nothing remarkable about Porxy.
 *
 * Why do we need this? If you want to find out, try doing something like this.
 *
 *  const p = new Proxy({}, {});
 *  console.log(p instanceof Proxy);
 *
 * I get an error instead of anything printed in the console when I do this.
 */
export class Porxy {

    static [Symbol.hasInstance](instance) {
        return instance.prototype === Porxy;
    }

    constructor(target, handler) {
        const proxy = new Proxy(target, {
            get(target, key, receiver) {
                if (key === "prototype") {
                    return Porxy;
                }

                return handler.get(target, key, receiver);
            }
        });
        return proxy;
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

export class NoThrowPorxyFactory {

    static create(object, onError = noop) {
        return new Porxy(object, {
            get(target, key, receiver) {
                const value = target[key];

                if (typeof value === "function") {
                    return (...args) => {
                        try {
                            return target[key](...args);
                        } catch (e) {
                            try {
                                onError(e);
                            } catch (x) {
                                // eslint-disable-next-line no-empty
                            }
                        }
                    };
                }

                return value;
            }
        });
    }
}

function noop() {
}