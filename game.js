var io;

exports.init = function(sio, socket) {
	io = sio;

	socket.emit('connected', {'text': 'You are connected!'});

	socket.on('move', move);
	// socket.on('hostJoinRoom', hostJoinRoom);

	// socket.on('hostStartRoom', hostStartRoom);
	

	// socket.on('hostStartRound', hostStartRound);
	// socket.on('hostRoundCollect', hostRoundCollect);

	// socket.on('hostLeaveRoom', hostLeaveRoom);
	// socket.on('disconnect', hostLeaveRoom);

};

function move(data) {
	console.log(data);
}