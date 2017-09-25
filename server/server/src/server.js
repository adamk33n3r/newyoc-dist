"use strict";
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const express = require("express");
const logger = require("morgan");
const path = require("path");
const errorHandler = require("errorhandler");
const methodOverride = require("method-override");
const mongoose = require("mongoose");
require("reflect-metadata");
const Table = require('cli-table');
const socket_1 = require("./services/socket");
const jobs_1 = require("./jobs");
// routes
const router_1 = require("./api/router");
// interfaces
// import { IUser } from './interfaces/user'; // import IUser
// models
// import { IModel } from './models/model'; // import IModel
// import { IUserModel } from './models/user'; // import IUserModel
// schemas
// import { userSchema } from './schemas/user'; // import userSchema
/**
 * The server.
 *
 * @class Server
 */
class Server {
    // private model: IModel; // an instance of IModel
    /**
     * Constructor.
     *
     * @class Server
     * @constructor
     */
    constructor() {
        // instance defaults
        // this.model = Object(); // initialize this to an empty object
        // create expressjs application
        this.app = express();
    }
    /**
     * Configure application
     *
     * @class Server
     * @method config
     */
    config(socket) {
        if (socket) {
            new socket_1.Socket(socket);
        }
        // Add static paths
        this.app.use(express.static('./src/public'));
        // Mount logger
        this.app.use(logger('dev'));
        // Mount json form parser
        this.app.use(bodyParser.json());
        // Mount query string parser
        this.app.use(bodyParser.urlencoded({
            extended: true,
        }));
        // Mount cookie parker
        this.app.use(cookieParser('i am so secret'));
        // Mount override
        this.app.use(methodOverride());
        // Use native promises
        mongoose.Promise = Promise;
        // Connect to mongoose
        // const connection: mongoose.Connection = mongoose.createConnection(Server.MONGODB_CONNECTION);
        // Create models
        // this.model.user = connection.model<IUserModel>('User', userSchema);
        // Catch 404 and forward to error handler
        this.app.use((err, req, res, next) => {
            err.status = 404;
            next(err);
        });
        // Error handling
        this.app.use(errorHandler());
        this.routes();
        // Jobs
        if (socket) {
            jobs_1.Jobs.init();
        }
    }
    printRoutes() {
        const stack = this.app._router.stack;
        const table = new Table({ head: ['VERB', 'PATH', 'METHOD'] });
        this.getRoutesFromStack(stack, table);
        console.log(table.toString());
    }
    /**
     * Create and return Router.
     *
     * @class Server
     * @method config
     * @return void
     */
    routes() {
        const router = Reflect.getMetadata('$router.router', router_1.default);
        const routePath = Reflect.getMetadata('$router.path', router_1.default);
        this.app.use(routePath, router);
        const pathToClient = path.join(__dirname, '../../../client/src');
        this.app.use(express.static(pathToClient));
        // tslint:disable-next-line
        this.app.get('*', function catchAll(req, res) {
            res.sendFile(path.join(pathToClient, 'index.html'));
        });
    }
    getRoutesFromStack(stack, table, path = '') {
        for (const layer of stack) {
            if (layer.name === 'router') {
                // console.log(layer, layer.regexp, layer.handle.stack);q
                // console.log(layer.)
                let routerPath = layer.regexp.toString();
                routerPath = routerPath
                    .replace('/^', '')
                    .replace('\\/?(?=\\/|$)/i', '')
                    .replace('\\/', '/');
                this.getRoutesFromStack(layer.handle.stack, table, path + routerPath);
            }
            else if (layer.route) {
                const methodName = layer.route.stack[0].handle.name.replace('bound ', '');
                const httpMethod = layer.route.stack[0].method.toUpperCase();
                const fullPath = path + layer.route.path;
                table.push([httpMethod, fullPath, methodName]);
            }
        }
    }
}
Server.MONGODB_CONNECTION = 'mongodb://eon.adam-keenan.net:27272/newyoc';
exports.Server = Server;
