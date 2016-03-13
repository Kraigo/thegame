var server_port = process.env.OPENSHIFT_NODEJS_PORT || 8080;
var server_ip_address = server_ip_address || 'localhost';

var express = require('express');
var app = express();
var server = require('http').createServer(app).listen(server_port, server_ip_address);
var io = require('socket.io')(server);

var game = require('./game');

app.use(express.static('public'));


io.sockets.on('connection', function(socket) {
    game.init(io, socket);
});