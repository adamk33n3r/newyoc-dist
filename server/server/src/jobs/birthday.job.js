"use strict";
const request = require("request-promise-native");
const moment = require("moment");
const logger_1 = require("src/logger");
const slack_1 = require("../services/slack");
const config_1 = require("../config");
const ManagementClient = require('auth0').ManagementClient;
module.exports = (scheduler) => {
    const slack = new slack_1.Slack();
    logger_1.default('scheduling birthday job');
    scheduler.scheduleJob('0 0 9 * * *', () => {
        logger_1.default('birthday job running...');
        if (!(config_1.default.auth0 && config_1.default.auth0.client_id && config_1.default.auth0.client_secret)) {
            console.error('no auth0 config can\'t send birthday messages');
            return;
        }
        request.post({
            url: 'https://adamk33n3r.auth0.com/oauth/token',
            headers: { 'Content-Type': 'application/json' },
            body: {
                grant_type: 'client_credentials',
                client_id: config_1.default.auth0.client_id,
                client_secret: config_1.default.auth0.client_secret,
                audience: 'https://adamk33n3r.auth0.com/api/v2/'
            },
            json: true,
        }).then((response) => {
            const management = new ManagementClient({
                token: response.access_token,
                domain: 'adamk33n3r.auth0.com',
            });
            const today = moment();
            management.getUsers()
                .then((users) => {
                return users.filter((user) => {
                    const birthday = moment(user.user_metadata.birthday, [
                        'MM/DD/YYYY',
                        'MM/DD',
                    ]);
                    birthday.year(today.year());
                    return birthday.isSame(today, 'day');
                });
            })
                .then((users) => {
                if (users.length === 0) {
                    console.log('BIRTHDAYS: No birthdays today :(');
                    return;
                }
                for (const user of users) {
                    const meta = user.user_metadata;
                    const name = meta.slack || meta.name || `${meta.given_name} ${meta.family_name}` || user.name;
                    console.log('BIRTHDAYS: Birthday boy:', name, meta.birthday);
                    slack.sendMessage(config_1.default.slack.webhook, {
                        channel: config_1.default.birthdayChannel,
                        text: `:tada::confetti_ball::birthday: Happy Birthday to ${name}!!! :birthday::confetti_ball::tada:`,
                    });
                }
            }).catch((err) => console.error(err));
        });
    });
};
//# sourceMappingURL=../../../../src/jobs/birthday.job.js.map