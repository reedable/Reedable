function noop() {
}

// fake chrome
export const chrome = {
    "storage": {
        "sync": {
            "get": noop,
            "set": noop
        }
    }
};

window.chrome = chrome;