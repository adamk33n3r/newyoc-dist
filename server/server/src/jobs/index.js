"use strict";
const path = require("path");
const glob = require("glob");
const schedule = require("node-schedule");
class Jobs {
    static init() {
        const files = glob.sync(path.join(__dirname, '*.job.js'));
        for (const file of files) {
            const fileName = path.basename(file);
            console.log('file:', file);
            console.log('JOB:', fileName);
            require(file)(schedule);
        }
    }
}
exports.Jobs = Jobs;
