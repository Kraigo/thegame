'use strict';
class PlayerControl {
	constructor(game) {
		this.game = game;


		setInterval(function() {
			if (game.player) {
				game.socket.move(game.player);

				if (!game.player.willDie && game.player.health.current <= 0) {
					this.game.socket.kill(this.id);
				}
			}
		}, 1000/20)
	}

	update() {
		// var _lookAngel = this.game.player.lookAngel;
		// var _directionX = this.game.player.direction.x;
		// var _directionY = this.game.player.direction.y;
		this.move();
		this.shot();
		this.rotate();

		// if (this.game.timer % 8 == 0) {
		// 	if (_lookAngel !== this.game.player.lookAngel ||
		// 		_directionX !== this.game.player.direction.x ||
		// 		_directionY !== this.game.player.direction.y) {

				
		// 	}
		// }

	}
	move() {
		var player = this.game.player;

		player.direction.x = 0;
		player.direction.y = 0;

		if (this.game.keyboard.isPressed('A')) {
			player.direction.x = -1;
		} else if (this.game.keyboard.isPressed('D')) {
			player.direction.x = 1;
		}

		if (this.game.keyboard.isPressed('W')) {
			player.direction.y = -1;
		} else if (this.game.keyboard.isPressed('S')) {
			player.direction.y = 1;
		}
	}
	shot() {
		this.game.player.shooting.start = (this.game.point.isPressed('LEFT') || this.game.keyboard.isPressed('SPACE'));
	}
	rotate() {
		this.game.player.lookAngel = this.game.player.vectorAngle(
			{x: this.game.player.position.x - this.game.camera.x + this.game.player.size.width/2, y: this.game.player.position.y - this.game.camera.y + this.game.player.size.width/2},
			{x: this.game.point.x, y: this.game.point.y});
	}
}