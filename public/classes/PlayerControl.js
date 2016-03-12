'use strict';
class PlayerControl {
	constructor(game) {
		this.game = game;
	}

	update() {

		this.animate();
		this.move();
		this.shot();

	}
	animate() {
		if (this.game.keyboard.isPressed('W') || this.game.keyboard.isPressed('S') || this.game.keyboard.isPressed('A') || this.game.keyboard.isPressed('D')) {
			this.game.player.changeAnimation('walk');
		} else {
			this.game.player.changeAnimation('stand');
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

		if (player.direction.x || player.direction.y) {
			this.game.socket.move(player.position);
		}
	}
	shot() {
		if (this.game.point.isPressed('LEFT') || this.game.keyboard.isPressed('SPACE')) {
			this.game.player.shooting.start = true;
		} else {
			this.game.player.shooting.start = false;
		}
	}
}