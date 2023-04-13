'use strict';

import { Bullet } from "./Bullet";
import { Player } from "./Player";
const io: any = null;

export class Socket {
    socket: any;
    constructor(game) {
        //this.game = game;
        var self = this;
        var socket = io.connect();
        this.socket = socket;
        var socketBodies = {};

        socket.on('connected', onConnected);
        socket.on('leave', onLeave);
        socket.on('move', onMove);
        socket.on('join', onJoin);
        socket.on('bullet', onBullet);
        socket.on('kill', onKill);

        function onConnected(data) {
            game.player.id = data.socketId;
            for (var i = 0; i<data.game.length; i++) {
                if (data.socketId === data.game[i].socketId) {
                    game.player.id = data.socketId;
                    game.player.position = data.game[i].position;
                } else {
                    onJoin(data.game[i]);
                }
            }

            self.move(game.player);
        }

        function onLeave(data) {
            if (socketBodies[data.socketId]) {
                socketBodies[data.socketId].willDie = true;
                delete socketBodies[data.socketId];
            }
        }

        function onMove(data) {
            if (!socketBodies[data.socketId]) {
                onJoin(data);
            }
            socketBodies[data.socketId].position = data.position;
            socketBodies[data.socketId].lookAngle = data.lookAngle;
            socketBodies[data.socketId].direction = data.direction;

        }

        function onJoin(data) {
            var socketPlayer = new Player(game, data.position);

            socketBodies[data.socketId] = socketPlayer;
            socketBodies[data.socketId].id = data.socketId;
            socketBodies[data.socketId].lookAngle = data.lookAngle;

            game.bodies.push(socketPlayer);
        }

        function onBullet(data) {
            const id = socketBodies[data.socketId];
            game.addBody(new Bullet(game, data.bullet));
        }

        function onKill(data) {
            if (game.player.id == data.socketId) {
                if (game.player)
                    game.player.kill();
            }
            if (socketBodies[data.socketId])
                socketBodies[data.socketId].kill();
        }
    }

    move(player) {
        this.socket.emit('move', {
            position: player.position,
            lookAngle: player.lookAngle,
            direction: player.direction
        });
    }

    shot(bullet) {
        this.socket.emit('bullet', bullet);
    }

    kill(id) {
        this.socket.emit('kill', id);
    }
}