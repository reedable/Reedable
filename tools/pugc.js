const fs = require("fs");
const pug = require("pug");

const options = {
};

const ifn = process.argv[2];

if (!ifn) {
    console.error(ifn);
    return 100;
}

const ofn = ifn.replace(/\.[^\.]+$/, ".html");

function getStats(xfn) {

    return new Promise((resolve, reject) => {

        fs.stat(xfn, (err, stats) => {
            if (err) {
                reject(err);
            }
            resolve(stats);
        });
    });
}

function renderFile(ofn, ifn, options) {

    const html = pug.renderFile(ifn, options);

    return new Promise((resolve, reject) => {
        fs.writeFile(ofn, html, err => {
            if (err) {
                reject(err);
            } else {
                resolve(ofn);
            }
        });
    });
}

getStats(ifn).then(iStats => {

    return getStats(ofn).then(oStats => {

        // Compare iStats.mtime vs oStats.mtime
        console.log(iStats.mtime, oStats.mtime);

    }, err => {

        if (err.code !== "ENOENT") {
            return Promise.reject(err);
        }
    });
}).then(() => {

    // At this point, either the output file is created or outdated
    return renderFile(ofn, ifn, options);

}).catch(err => {

    console.error(err);
});

