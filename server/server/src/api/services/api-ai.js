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
const routing_1 = require("src/decorators/routing");
const util_1 = require("src/decorators/util");
const teamspeak_1 = require("src/services/teamspeak");
const config_1 = require("src/config");
let ApiAIController = class ApiAIController {
    index(req, res) {
        const ts = this.initTeamSpeak(res);
        ts.login(config_1.default.teamspeak.username, config_1.default.teamspeak.password)
            .then(() => ts.getOnlineClients())
            .then((online) => {
            let message;
            if (online.length > 0) {
                const clientNames = online.map((client) => client.client_nickname);
                let clients = clientNames.join(', ');
                clients = clients.replace(/(.*),/, '$1, and');
                message = clients + ' ' + (online.length === 1 ? 'is' : 'are') + ' online.';
            }
            else {
                message = 'Nobody is online right now.';
            }
            res.json({
                speech: message,
                displayText: message,
                source: 'yoc',
            });
            ts.close();
        })
            .catch((error) => {
            console.error(error);
            res.status(500).send(error);
        });
    }
    initTeamSpeak(res) {
        return new teamspeak_1.TeamSpeak(config_1.default.teamspeak.url, (error) => {
            res.status(500).json({ status: false, error: error });
        });
    }
};
__decorate([
    routing_1.POST(),
    util_1.CheckToken('this is a token'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], ApiAIController.prototype, "index", null);
ApiAIController = __decorate([
    routing_1.Controller('/api-ai')
], ApiAIController);
exports.default = new ApiAIController();
