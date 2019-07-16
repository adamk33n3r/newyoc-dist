"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// Add current dir to the module path so we can import from root
require('app-module-path').addPath(__dirname);
const server_1 = require("./src/server");
const server = new server_1.Server();
server.config(null);
server.printRoutes();
