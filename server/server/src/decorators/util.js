"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const crypto = require("crypto");
function renameFunction(fn, newName, closureScope = {}) {
    const renamedFunction = fn.toString().replace(/function \w+/, 'function ' + newName);
    const argNames = Object.keys(closureScope);
    const argVals = argNames.map(argName => closureScope[argName]);
    return new Function(...argNames, 'return ' + renamedFunction)(...argVals);
}
/**
 * Checks the request body for token. Responds with 404 if not equal
 */
function CheckToken(token) {
    return (target, propertyKey, descriptor) => {
        const origFn = descriptor.value;
        // Must not bind this
        // tslint:disable-next-line
        descriptor.value = function checkToken(req, res) {
            if (req.headers['token'] !== token && req.body.token !== token) {
                res.status(404).send();
            }
            else {
                origFn.call(target, req, res);
            }
        };
        // Rename function to original
        descriptor.value = renameFunction(descriptor.value, origFn.name, { target, origFn, token });
    };
}
exports.CheckToken = CheckToken;
function VerifySlackSignature(secret) {
    return (target, propertyKey, descriptor) => {
        const origFn = descriptor.value;
        // Must not bind this
        // tslint:disable-next-line
        descriptor.value = function checkToken(req, res) {
            const timestamp = req.header('X-Slack-Request-Timestamp');
            // Check if request was within a minute
            const curTime = Math.round(new Date().getTime() / 1000);
            if (curTime - +timestamp > 60) {
                res.status(500).send();
                return;
            }
            const rawBody = req.rawBody;
            const sigBase = `v0:${timestamp}:${rawBody}`;
            const hmac = crypto.createHmac('sha256', secret);
            const calcSig = 'v0=' + hmac.update(sigBase).digest('hex');
            const signature = req.header('X-Slack-Signature');
            if (signature !== calcSig) {
                res.status(500).send();
                return;
            }
            origFn.call(target, req, res);
        };
        // Rename function to original
        descriptor.value = renameFunction(descriptor.value, origFn.name, { target, origFn, secret, crypto });
    };
}
exports.VerifySlackSignature = VerifySlackSignature;
function Required(...params) {
    return (target, propertyKey, descriptor) => {
        const origFn = descriptor.value;
        // Must not bind this
        // tslint:disable-next-line
        descriptor.value = function required(req, res) {
            const valid = params.every((param) => {
                return param in req.body || param in req.query;
            });
            if (valid) {
                origFn.call(target, req, res);
            }
            else {
                res.status(400).send(`Required params: ${params.join(',')}`);
            }
        };
        // Rename function to original
        descriptor.value = renameFunction(descriptor.value, origFn.name, { target, origFn, params });
    };
}
exports.Required = Required;
