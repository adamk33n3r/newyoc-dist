"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const request = require("request-promise-native");
const firebase = require("firebase/app");
require("firebase/firestore");
const utils_1 = require("../utils");
function handleBlockActions(payload) {
    const action = payload.actions[0];
    switch (action.type) {
        case 'button':
            switch (action.action_id) {
                case 'quotes:next': {
                    const [pageNumber, selectedUser] = action.value.split(',');
                    utils_1.getQuotesBlocks(payload.team.id, payload.channel.name, selectedUser, +pageNumber + 1).then((blocks) => {
                        request.post(payload.response_url, {
                            json: {
                                replace_original: true,
                                blocks,
                            },
                        });
                    });
                    break;
                }
                case 'quotes:prev': {
                    const [pageNumber, selectedUser] = action.value.split(',');
                    utils_1.getQuotesBlocks(payload.team.id, payload.channel.name, selectedUser, +pageNumber - 1).then((blocks) => {
                        request.post(payload.response_url, {
                            json: {
                                replace_original: true,
                                blocks,
                            },
                        });
                    });
                    break;
                }
                case 'quotes:close':
                    request.post(payload.response_url, {
                        json: {
                            delete_original: true,
                        },
                    });
                    break;
                case 'quotes:share':
                    firebase.firestore().collection(`teams/${payload.team.id}/quotes`).doc(action.value).get()
                        .then((quoteSnap) => {
                        const quote = quoteSnap.data();
                        request.post(payload.response_url, {
                            json: {
                                delete_original: true,
                                response_type: 'in_channel',
                                text: quote,
                                blocks: utils_1.buildQuoteSection(quote, payload.channel.name),
                            },
                        });
                    });
                    break;
                case 'quotes:filter:said_by:clear':
                    utils_1.getQuotesBlocks(payload.team.id, payload.channel.name).then((blocks) => {
                        request.post(payload.response_url, {
                            json: {
                                replace_original: true,
                                blocks,
                            },
                        });
                    });
                    break;
                default:
                    break;
            }
            break;
        case 'users_select':
            switch (action.action_id) {
                case 'quotes:filter:said_by':
                    utils_1.getQuotesBlocks(payload.team.id, payload.channel.name, action.selected_user).then((blocks) => {
                        request.post(payload.response_url, {
                            json: {
                                replace_original: true,
                                blocks,
                            },
                        });
                    });
                    break;
                default:
                    break;
            }
            break;
        default:
            break;
    }
}
exports.handleBlockActions = handleBlockActions;
