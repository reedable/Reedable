function noop() {
}

// fake chrome
export const chrome = {
    "runtime": {
        "getManifest": noop,
        "onActivated": noop,
        "onInstalled": noop
    },
    "scripting": {
        "executeScript": noop
    },
    "storage": {
        "sync": {
            "get": noop,
            "set": noop
        }
    },
    "tabs": {
        "query": noop
    }
};

window.chrome = chrome;