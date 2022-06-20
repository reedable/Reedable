const path = require("path");

module.exports = {
    "mode": "none",
    "entry": "./src/scripts/background/background.js",
    "output": {
        "filename": "background.bundle.js",
        "path": path.join(__dirname, "../../target/scripts")
    },
    "optimization": {
        "minimize": false
    }
};