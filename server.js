var server_port = process.env.PORT || 8080;

var express = require('express');
var app = express();
var server = require('http').createServer(app).listen(server_port);
var io = require('socket.io')(server);

var game = require('./game');

app.use(express.static('public'));


io.sockets.on('connection', function(socket) {
    game.init(io, socket);
});