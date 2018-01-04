"use strict";
function renameFunction(fn, newName, args = {}) {
    const renamedFunction = fn.toString().replace(/function \w+/, 'function ' + newName);
    const argNames = Object.keys(args);
    const argVals = argNames.map(argName => args[argName]);
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
                origFn.call(this, req, res);
            }
        };
        // Rename function to original
        descriptor.value = renameFunction(descriptor.value, origFn.name, { origFn, token });
    };
}
exports.CheckToken = CheckToken;
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
                origFn.call(this, req, res);
            }
            else {
                res.status(400).send(`Required params: ${params.join(',')}`);
            }
        };
        // Rename function to original
        descriptor.value = renameFunction(descriptor.value, origFn.name, { origFn, params });
    };
}
exports.Required = Required;
