'use strict';
class PlayerControl {
	constructor(game) {
		this.game = game;
	}

	update() {
		var _lookAngel = this.game.player.lookAngel;
		this.move();
		this.shot();

		this.rotate();

		if (this.game.player.direction.x || this.game.player.direction.y || _lookAngel !== this.game.player.lookAngel) {
			this.game.socket.move(this.game.player);
		}

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