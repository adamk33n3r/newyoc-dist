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
const teamspeak_1 = require("./teamspeak");
const slack_1 = require("./slack");
const stream_1 = require("./stream");
const api_ai_1 = require("./api-ai");
const miner_1 = require("./miner");
const routing_1 = require("src/decorators/routing");
let ServicesRouter = class ServicesRouter {
};
ServicesRouter = __decorate([
    routing_1.Router({
        path: '/services',
        controllers: [
            teamspeak_1.default,
            slack_1.default,
            stream_1.default,
            api_ai_1.default,
            miner_1.default,
        ],
    }),
    __metadata("design:paramtypes", [])
], ServicesRouter);
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = new ServicesRouter();
//# sourceMappingURL=/home/akeenan/projects/newyoc/server/server/src/api/services/index.js.map