const path = require("path");

module.exports = {
    "entry": "./src/app/background/background.js",
    "output": {
        "filename": "background.bundle.js",
        "path": path.join(__dirname, "../unpacked/scripts")
    },
    "optimization": {
        "minimize": false
    }
};

console.log(__dirname);