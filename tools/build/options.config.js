const path = require("path");

module.exports = {
    "mode": "none",
    "entry": "./src/options/options.js",
    "output": {
        "filename": "options.bundle.js",
        "path": path.join(__dirname, "../../unpacked/scripts")
    },
    "optimization": {
        "minimize": false
    }
};