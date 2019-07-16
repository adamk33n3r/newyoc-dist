"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const path = require("path");
const glob = require("glob");
const schedule = require("node-schedule");
const logger_1 = require("src/logger");
class Jobs {
    static init() {
        const files = glob.sync(path.join(__dirname, '*.job.js'));
        for (const file of files) {
            const fileName = path.basename(file);
            logger_1.default('file:', file);
            logger_1.default('JOB:', fileName);
            require(file)(schedule);
        }
    }
}
exports.Jobs = Jobs;
