"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
// Routes
const routing_1 = require("src/decorators/routing");
const services_1 = require("./services");
const miner_1 = require("./miner");
const quotes_1 = require("./quotes");
let AppRouter = class AppRouter {
};
AppRouter = __decorate([
    routing_1.Router({
        path: '/api',
        routers: [
            services_1.default,
        ],
        controllers: [
            miner_1.default,
            quotes_1.default,
        ],
    })
], AppRouter);
exports.default = new AppRouter();
