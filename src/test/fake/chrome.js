function noop() {
}

// fake chrome
export default window.chrome = {
    "storage": {
        "sync": {
            "get": noop,
            "set": noop,
        },
    },
};