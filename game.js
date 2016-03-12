exports.init = function(io, socket) {

	//socket.emit('connected', {socketId: socket.id});
	socket.broadcast.emit('join', {socketId: socket.id});

	socket.on('move', function(data) {
		socket.broadcast.emit('move', {socketId: socket.id, position: data});
	});
	// socket.on('hostJoinRoom', hostJoinRoom);

	// socket.on('hostStartRoom', hostStartRoom);
	

	// socket.on('hostStartRound', hostStartRound);
	// socket.on('hostRoundCollect', hostRoundCollect);

	// socket.on('hostLeaveRoom', hostLeaveRoom);
	// socket.on('disconnect', hostLeaveRoom);

};