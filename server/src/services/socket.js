"use strict";
const logger_1 = require("src/logger");
const request = require("request-promise-native");
const sockets_1 = require("../../shared/constants/sockets");
class Socket {
    constructor(socket) {
        this.socket = socket;
        this.socket.on('connection', (sock) => {
            logger_1.default('a fine user connected', sock.handshake.address);
            sock.on('disconnect', () => {
                logger_1.default('user disconnected', sock.handshake.address);
                this.socket.emit(sockets_1.Chat.Disconnect, sock.user);
            });
            sock.on(sockets_1.Chat.Connect, (user) => {
                logger_1.default(sockets_1.Chat.Connect, user);
                sock.user = user;
                this.socket.emit(sockets_1.Chat.Connect, user);
            });
            sock.on(sockets_1.Chat.Message, (msg) => {
                logger_1.default(sockets_1.Chat.Message, msg);
                this.socket.emit(sockets_1.Chat.Message, msg);
            });
        });
        setInterval(() => {
            request('http://eon.adam-keenan.net:8081/stats.json', {
                json: true,
            })
                .then((body) => {
                const rtmp = body.rtmp;
                const streams = rtmp.servers[0][0].live.streams;
                let foundStream = false;
                for (const stream of streams) {
                    if (stream.name === 'default') {
                        this.socket.emit('stream:viewerCount', stream.nclients - 1);
                        foundStream = true;
                        break;
                    }
                }
                if (!foundStream) {
                    this.socket.emit('stream:viewerCount', 0);
                }
            })
                .catch((e) => {
            });
        }, 10000);
    }
}
exports.Socket = Socket;
//# sourceMappingURL=/home/akeenan/projects/newyoc/server/server/src/services/socket.js.map
