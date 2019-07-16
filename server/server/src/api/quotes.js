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
const slack_1 = require("src/services/slack");
let QuotesController = class QuotesController {
    index(req, res) {
        let query = firebase.firestore().collection(`teams/${req.query.teamId}/quotes`)
            .orderBy('timestamp', 'desc');
        if (req.query.user) {
            query = query.where('said_by', '==', req.query.user);
        }
        const slack = new slack_1.Slack();
        query.get().then((quotes) => {
            slack.getAllUsers().then((users) => {
                if (users.ok) {
                    const members = users.members;
                    res.json(quotes.docs.map((qSnap) => {
                        const data = qSnap.data();
                        const said_by_name = `@${members.find((member) => member.id === data.said_by).profile.display_name}`;
                        const quoted_by_name = `@${members.find((member) => member.id === data.quoted_by).profile.display_name}`;
                        const quote = data.quote.replace(/(?:<@(\w+)>)+/g, (_match, userId) => {
                            const userName = users.members.find((member) => member.id === userId).profile.display_name;
                            return `@${userName}`;
                        });
                        return Object.assign({}, data, { id: qSnap.id, quote,
                            said_by_name,
                            quoted_by_name, timestamp: data.timestamp.toDate().getTime() });
                    }));
                }
                else {
                    res.status(500).json(users);
                }
            });
        });
    }
};
__decorate([
    routing_1.GET(),
    util_1.Required('teamId'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], QuotesController.prototype, "index", null);
QuotesController = __decorate([
    routing_1.Controller('/quotes')
], QuotesController);
exports.default = new QuotesController();
