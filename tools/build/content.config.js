const path = require("path");

module.exports = {
    "mode": "none",
    "entry": "./src/content/content.js",
    "output": {
        "filename": "content.bundle.js",
        "path": path.join(__dirname, "../../unpacked/scripts")
    },
    "optimization": {
        "minimize": false
    }
};