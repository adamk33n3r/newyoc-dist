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
let StreamController = class StreamController {
    constructor() {
        this.slack = new slack_1.Slack();
    }
    index(req, res) {
        if (req.body.name !== 'default') {
            return;
        }
        switch (req.body.call) {
            case 'publish':
                const silent = req.body.silent;
                const channel = req.body.channel;
                if (typeof silent === 'undefined' || silent === null) {
                    const who = req.body.who || 'Someone';
                    const title = req.body.title || 'something';
                    this.slack.sendMessage(config_1.default.slack.webhook, {
                        channel: channel || '#random',
                        text: `${who} started streaming *${title}*!\nCome join the party: https://yoc.adam-keenan.com/stream`,
                    });
                }
                break;
            default: break;
        }
        res.send();
    }
};
__decorate([
    routing_1.POST('/'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], StreamController.prototype, "index", null);
StreamController = __decorate([
    routing_1.Controller('/stream'),
    __metadata("design:paramtypes", [])
], StreamController);
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = new StreamController();
//# sourceMappingURL=/home/akeenan/projects/newyoc/server/server/src/api/services/stream.js.map