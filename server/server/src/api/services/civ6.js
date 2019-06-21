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
const routing_1 = require("src/decorators/routing");
const slack_1 = require("src/services/slack");
const config_1 = require("src/config");
let Civ6Controller = class Civ6Controller {
    constructor() {
        this.slack = new slack_1.Slack();
    }
    index(req, res) {
        const gameName = req.body.value1;
        const playerName = req.body.value2;
        const turnNumber = req.body.value3;
        this.slack.sendMessage(config_1.default.slack.webhook, {
            channel: '#civ6turns',
            text: `It is now ${playerName}'s turn (${turnNumber}) in ${gameName}`,
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
};
__decorate([
    routing_1.POST('/'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], Civ6Controller.prototype, "index", null);
Civ6Controller = __decorate([
    routing_1.Controller('/civ6')
], Civ6Controller);
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = new Civ6Controller();
