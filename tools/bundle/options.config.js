const path = require("path");

module.exports = {
    "mode": "none",
    "entry": "./src/scripts/options/options.js",
    "output": {
        "filename": "options.bundle.js",
        "path": path.join(__dirname, "../../target/scripts")
    },
    "optimization": {
        "minimize": false
    }
};