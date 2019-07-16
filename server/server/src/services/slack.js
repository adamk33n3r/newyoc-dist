"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const request = require("request-promise-native");
const config_1 = require("src/config");
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
    getAllUsers() {
        return request.get('https://slack.com/api/users.list', {
            headers: {
                'Authorization': 'Bearer ' + config_1.default.slack.clink.token,
            },
        }).then((res) => JSON.parse(res));
    }
    getUser(user) {
        return request.get('https://slack.com/api/users.info', {
            headers: {
                'Authorization': 'Bearer ' + config_1.default.slack.clink.token,
            },
            form: {
                user,
            },
            json: true,
        }).then((res) => JSON.parse(res));
    }
}
exports.Slack = Slack;
