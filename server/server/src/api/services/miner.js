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
const request = require("request-promise-native");
const routing_1 = require("src/decorators/routing");
const util_1 = require("src/decorators/util");
const config_1 = require("src/config");
let MinerController = class MinerController {
    payout(req, res) {
        this.coinHiveForwarder('stats/payout', res);
    }
    site(req, res) {
        this.coinHiveForwarder('stats/site', res);
    }
    balance(req, res) {
        this.coinHiveForwarder('user/balance', res, { name: req.query.user }, (response) => {
            response.balance = response.balance / 100;
            return response;
        });
    }
    coinHiveForwarder(endpoint, res, params = {}, then = response => response) {
        params.secret = config_1.default.coinhive.secret;
        return request.get(`https://api.coin-hive.com/${endpoint}`, {
            qs: params,
            json: true,
        })
            .then(then)
            .then((response) => {
            res.send(response);
        });
    }
};
__decorate([
    routing_1.GET(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], MinerController.prototype, "payout", null);
__decorate([
    routing_1.GET(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], MinerController.prototype, "site", null);
__decorate([
    routing_1.GET(),
    util_1.Required('user'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], MinerController.prototype, "balance", null);
MinerController = __decorate([
    routing_1.Controller('/miner'),
    __metadata("design:paramtypes", [])
], MinerController);
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = new MinerController();
