var gamePlayers = {};

exports.init = function(io, socket) {
	var player = {
		socketId: socket.id,
		position: {
			x: 50,
			y: 50
		},
		lookAngel: 0
	};
	gamePlayers[socket.id] = player;

	var gamePlayersList = Object.keys(gamePlayers).map(function(elm) {
		return gamePlayers[elm];
	});

	socket.emit('connected', {socketId: socket.id, game: gamePlayersList});
	socket.broadcast.emit('join', player);

	socket.on('disconnect', disconnect);
	socket.on('move', move);
	socket.on('bullet', bullet);
	//socket.on('kill', kill);
	// socket.on('hostJoinRoom', hostJoinRoom);

	// socket.on('hostStartRoom', hostStartRoom);
	

	// socket.on('hostStartRound', hostStartRound);
	// socket.on('hostRoundCollect', hostRoundCollect);

	// socket.on('hostLeaveRoom', hostLeaveRoom);
	// socket.on('disconnect', hostLeaveRoom);
	function disconnect() {
		socket.broadcast.emit('leave', {socketId: socket.id});
		delete gamePlayers[socket.id];
	}
	function move(data) {
		gamePlayers[socket.id].position = data.position;
		gamePlayers[socket.id].lookAngel = data.lookAngel;
		socket.broadcast.emit('move', {socketId: socket.id, position: data.position, lookAngel: data.lookAngel});
	}
	function bullet(data) {
		socket.broadcast.emit('bullet', {socketId: socket.id, bullet: data});
	}
	//function kill(data) {
	//	delete gamePlayers[data];
	//	socket.broadcast.emit('kill', {socketId: data});
	//}

};