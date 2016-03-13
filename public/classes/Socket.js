'use strict';
class Socket {
    constructor(game) {
        //this.game = game;
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
                    game.player.position = data.game[i].position;
                } else {
                    onJoin(data.game[i]);
                }
            }
        }

        function onLeave(data) {
            socketBodies[data.socketId].willDie = true;
            delete socketBodies[data.socketId];
        }

        function onMove(data) {

            if (!socketBodies[data.socketId]) {
                onJoin(data);
            }
            socketBodies[data.socketId].position = data.position;
            socketBodies[data.socketId].lookAngel = data.lookAngel;

        }

        function onJoin(data) {
            var socketPlayer = new Player(game, data.position);

            socketBodies[data.socketId] = socketPlayer;
            socketBodies[data.socketId].id = data.socketId;
            socketBodies[data.socketId].lookAngel = data.lookAngel;

            game.bodies.push(socketPlayer);
        }

        function onBullet(data) {
            game.addBody(new Bullet(game, data.bullet, socketBodies[data.socketId]));
        }

        function onKill(data) {
            socketBodies[data.socketId].kill();
        }
    }

    move(player) {
        this.socket.emit('move', {
            position: player.position,
            lookAngel: player.lookAngel
        });
    }

    shot(bullet) {
        this.socket.emit('bullet', bullet);
    }

    kill(id) {
        this.socket.emit('kill', id);
    }
}