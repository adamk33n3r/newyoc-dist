"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const request = require("request-promise-native");
const utils_1 = require("../utils");
function handleDialogSubmission(payload) {
    switch (payload.callback_id) {
        case 'quote':
            const submissionPayload = payload;
            const teamId = submissionPayload.team.id;
            const saidBy = submissionPayload.submission.saidBy;
            const quote = submissionPayload.submission.quote;
            const quotedBy = submissionPayload.user.id;
            const channel = submissionPayload.channel.id;
            const timestamp = new Date(+submissionPayload.state);
            utils_1.saveNewQuote(teamId, saidBy, quote, quotedBy, channel, timestamp).then((newQuote) => {
                newQuote.get().then((quoteSnap) => {
                    console.log('New Quote Created:', quoteSnap.data());
                });
                request.post(submissionPayload.response_url, {
                    json: {
                        response_type: 'ephemeral',
                        text: `Successfully quoted <@${saidBy}>`,
                    },
                });
            });
            break;
        default:
            break;
    }
}
exports.handleDialogSubmission = handleDialogSubmission;
