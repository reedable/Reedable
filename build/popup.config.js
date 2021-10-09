const path = require("path");

module.exports = {
    "entry": "./src/app/popup/popup.js",
    "output": {
        "filename": "popup.bundle.js",
        "path": path.join(__dirname, "../unpacked/scripts")
    },
    "optimization": {
        "minimize": false
    }
};

console.log(__dirname);