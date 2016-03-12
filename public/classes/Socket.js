'use strict';
class Socket {
    constructor(game) {
        this.game = game;
        this.io = io.connect('http://localhost:8080');

        var socketBodies = {};

        this.io.on('move', onMove);
        this.io.on('join', onJoin);

        function onMove(data) {

            if (!socketBodies[data.socketId]) {
                onJoin(data);
            }
            socketBodies[data.socketId].position = data.position;
        }

        function onJoin(data) {
            var socketPlayer = new Player(game, {x: 100, y: 100});

            console.log(data.socketId + ' connected');

            socketBodies[data.socketId] = socketPlayer;
            game.bodies.push(socketPlayer);
        }
    }

    move(position) {
        this.io.emit('move', position);
    }

}