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
        new socket_1.Socket(socket);
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
        jobs_1.Jobs.init();
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
        const pathToClient = path.join(__dirname, '../../../client');
        this.app.use(express.static(pathToClient));
        this.app.get('*', (req, res) => {
            res.sendFile(path.join(pathToClient, 'index.html'));
        });
    }
}
Server.MONGODB_CONNECTION = 'mongodb://eon.adam-keenan.net:27272/newyoc';
exports.Server = Server;
//# sourceMappingURL=/home/akeenan/projects/newyoc/server/server/src/server.js.map
