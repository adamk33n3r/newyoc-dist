"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
const firebase = require("firebase/app");
require("firebase/firestore");
const routing_1 = require("src/decorators/routing");
const util_1 = require("src/decorators/util");
const teamspeak_1 = require("src/services/teamspeak");
const slack_1 = require("src/services/slack");
const config_1 = require("src/config");
const utils_1 = require("./clink/utils");
const message_action_1 = require("./clink/interactive/message_action");
const dialog_submission_1 = require("./clink/interactive/dialog_submission");
const block_actions_1 = require("./clink/interactive/block_actions");
let SlackController = class SlackController {
    constructor() {
        this.slack = new slack_1.Slack();
    }
    status(req, res) {
        const ts = new teamspeak_1.TeamSpeak(config_1.default.teamspeak.url);
        ts.login(config_1.default.teamspeak.username, config_1.default.teamspeak.password)
            .then(() => {
            ts.getOnlineClients()
                .then((onlineClients) => {
                const connectURL = 'TeamSpeak Server\n<ts3server://ts.adam-keenan.com|Click here to connect!>\n';
                if (onlineClients.length > 0) {
                    res.send({
                        response_type: 'ephemeral',
                        text: connectURL + 'Online users: ' +
                            onlineClients.map((ele) => {
                                return ele.client_nickname;
                            }).join(', '),
                    });
                }
                else {
                    res.send({
                        response_type: 'ephemeral',
                        text: connectURL + 'No one is online at the moment',
                    });
                }
            })
                .catch((err) => res.status(500).send(err));
        })
            .catch((err) => res.status(500).send(err));
    }
    sendMessage(req, res) {
        this.slack.sendMessage(config_1.default.slack.clink.webhook, {
            channel: req.body.channel || '#tcpi',
            text: req.body.text || 'No text provided',
        })
            .then((response) => {
            if (response.body === 'ok') {
                res.json({ success: true, body: response.body });
            }
            else {
                console.error(response);
                res.status(500).send(response);
            }
        })
            .catch((err) => {
            console.error(err);
            res.status(500).send(err);
        });
    }
    roll(req, res) {
        const sides = req.body.text.split(' ')[0];
        if (sides) {
            const result = Math.floor(Math.random() * +sides) + 1;
            if (!result) {
                return res.status(500).send('Sides parameter invalid');
            }
            res.send({
                response_type: 'in_channel',
                text: result,
            });
        }
        else {
            res.status(500).send('Sides parameter invalid');
        }
    }
    sendInvite(req, res) {
        this.slack.sendInvite(config_1.default.slack.token, req.body.email)
            .then((response) => {
            const body = JSON.parse(response.body);
            if (body.ok) {
                res.json({ success: true, body });
            }
            else {
                console.error(body.error);
                res.json({ success: false, body });
            }
        })
            .catch((err) => {
            console.error(err.statusCode);
            res.status(500).send();
        });
    }
    quote(req, res) {
        const text = req.body.text;
        const splits = text.split(' ');
        const matches = splits[0].match(/^<@(\w+)(?:\|(.+?))?>/);
        const saidBy = matches ? matches[1] : undefined;
        const quote = splits.slice(1).join(' ');
        utils_1.launchQuoteDialog(req.body.trigger_id, new Date(), saidBy, quote);
        res.send();
    }
    quotes(req, res) {
        utils_1.getQuotesBlocks(req.body.team_id, req.body.channel_name).then((blocks) => {
            res.send({
                response_type: 'ephemeral',
                blocks,
            });
        });
    }
    randomQuote(req, res) {
        const teamId = req.body.team_id;
        firebase.firestore().collection(`teams/${teamId}/quotes`).get().then((query) => {
            const randIdx = Math.floor(Math.random() * query.size);
            const quote = query.docs[randIdx].data();
            res.send({
                response_type: 'in_channel',
                text: `<@${quote.said_by}>: ${quote.quote}`,
            });
        });
    }
    interactive(req, res) {
        const payload = JSON.parse(req.body.payload);
        switch (payload.type) {
            case 'message_action':
                message_action_1.handleMessageAction(payload);
                break;
            case 'dialog_submission':
                dialog_submission_1.handleDialogSubmission(payload);
                break;
            case 'block_actions':
                block_actions_1.handleBlockActions(payload);
                break;
            default:
                break;
        }
        res.send();
    }
};
__decorate([
    routing_1.POST(),
    util_1.VerifySlackSignature(config_1.default.slack.clink.secret),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], SlackController.prototype, "status", null);
__decorate([
    routing_1.POST(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], SlackController.prototype, "sendMessage", null);
__decorate([
    routing_1.POST(),
    util_1.Required('text'),
    util_1.VerifySlackSignature(config_1.default.slack.clink.secret),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], SlackController.prototype, "roll", null);
__decorate([
    routing_1.POST(),
    util_1.Required('email'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], SlackController.prototype, "sendInvite", null);
__decorate([
    routing_1.POST(),
    util_1.Required('text'),
    util_1.VerifySlackSignature(config_1.default.slack.clink.secret),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], SlackController.prototype, "quote", null);
__decorate([
    routing_1.POST(),
    util_1.VerifySlackSignature(config_1.default.slack.clink.secret),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], SlackController.prototype, "quotes", null);
__decorate([
    routing_1.POST(),
    util_1.VerifySlackSignature(config_1.default.slack.clink.secret),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], SlackController.prototype, "randomQuote", null);
__decorate([
    routing_1.POST(),
    util_1.Required('payload'),
    util_1.VerifySlackSignature(config_1.default.slack.clink.secret),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], SlackController.prototype, "interactive", null);
SlackController = __decorate([
    routing_1.Controller('/slack')
], SlackController);
exports.default = new SlackController();
