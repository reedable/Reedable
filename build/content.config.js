const path = require("path");

module.exports = {
    "entry": "./src/app/content/content.js",
    "output": {
        "filename": "content.bundle.js",
        "path": path.join(__dirname, "../unpacked/scripts")
    },
    "optimization": {
        "minimize": false
    }
};

console.log(__dirname);