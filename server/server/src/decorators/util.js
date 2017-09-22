"use strict";
/**
 * Checks the request body for token. Responds with 404 if not equal
 */
function CheckToken(token) {
    return (target, propertyKey, descriptor) => {
        const origFn = descriptor.value;
        // Must not bind this
        // tslint:disable-next-line
        descriptor.value = function (req, res) {
            if (req.headers['token'] !== token && req.body.token !== token) {
                res.status(404).send();
            }
            else {
                origFn.call(this, req, res);
            }
        };
    };
}
exports.CheckToken = CheckToken;
function Required(...params) {
    return (target, propertyKey, descriptor) => {
        const origFn = descriptor.value;
        // Must not bind this
        // tslint:disable-next-line
        descriptor.value = function (req, res) {
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
    };
}
exports.Required = Required;
//# sourceMappingURL=/home/akeenan/projects/newyoc/server/server/src/decorators/util.js.map