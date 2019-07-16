"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("../utils");
function handleMessageAction(payload) {
    switch (payload.callback_id) {
        case 'quote':
            const saidBy = payload.message.user;
            const quote = payload.message.text;
            const timestamp = new Date(+(payload.message.ts.split('.')[0] + '000'));
            utils_1.launchQuoteDialog(payload.trigger_id, timestamp, saidBy, quote);
            break;
        default:
            break;
    }
}
exports.handleMessageAction = handleMessageAction;
