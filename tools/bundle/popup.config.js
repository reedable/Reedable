const path = require("path");

module.exports = {
    "mode": "none",
    "entry": "./src/scripts/popup/popup.js",
    "output": {
        "filename": "popup.bundle.js",
        "path": path.join(__dirname, "../../target/scripts")
    },
    "optimization": {
        "minimize": false
    }
};