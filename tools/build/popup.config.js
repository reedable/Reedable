const path = require("path");

module.exports = {
    "mode": "none",
    "entry": "./src/popup/popup.js",
    "output": {
        "filename": "popup.bundle.js",
        "path": path.join(__dirname, "../unpacked/scripts")
    },
    "optimization": {
        "minimize": false
    }
};