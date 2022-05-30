var server_port = process.env.PORT || 8080;

var express = require('express');
var app = express();
var server = require('http');
var io = require('socket.io')(server);

var game = require('./controller/game');

app.use(express.static('public'));
app.use(express.static('dist'));

server.createServer(app).listen(server_port, function() {
    console.log(`server started at port ${server_port}`)
})


// io.sockets.on('connection', function(socket) {
//     game.init(io, socket);
// });