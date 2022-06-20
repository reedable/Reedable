const path = require("path");

module.exports = {
    "mode": "none",
    "entry": "./src/scripts/content/content.js",
    "output": {
        "filename": "content.bundle.js",
        "path": path.join(__dirname, "../../target/scripts")
    },
    "optimization": {
        "minimize": false
    }
};