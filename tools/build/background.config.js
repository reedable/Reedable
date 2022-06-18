const path = require("path");

module.exports = {
    "mode": "none",
    "entry": "./src/background/background.js",
    "output": {
        "filename": "background.bundle.js",
        "path": path.join(__dirname, "../unpacked/scripts")
    },
    "optimization": {
        "minimize": false
    }
};