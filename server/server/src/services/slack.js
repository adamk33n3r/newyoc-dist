"use strict";
const request = require("request-promise-native");
class Slack {
    sendMessage(url, payload) {
        if (typeof payload === 'string') {
            payload = { text: payload };
        }
        payload.link_names = true;
        return request.post({
            url,
            resolveWithFullResponse: true,
            form: {
                payload: JSON.stringify(payload).replace(/\\\\/g, '\\'),
            },
        });
    }
    sendInvite(token, email) {
        return request.post({
            url: 'https://ye-olde-chums.slack.com/api/users.admin.invite',
            resolveWithFullResponse: true,
            form: {
                token,
                email,
                resend: true,
            },
        });
    }
}
exports.Slack = Slack;
