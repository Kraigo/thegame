'use strict';

import { Game } from "./Game";

export class PlayerControl {
	constructor(
        private game: Game
    ) {

		// setInterval(function() {
		// 	if (game.player) {
		// 		game.socket.move(game.player);

		// 		if (!game.player.willDie && game.player.health.current <= 0) {
		// 			this.game.socket.kill(this.id);
		// 		}
		// 	}
		// }, 1000/20)
	}

	update() {

		this.move();
		this.shot();
		this.rotate();

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
		this.game.player.shooting.start = (this.game.mouse.isPressed('LEFT') || this.game.keyboard.isPressed('SPACE'));
	}
	rotate() {
		this.game.player.lookAngel = this.game.player.vectorAngle(
			{x: this.game.player.view.x - this.game.camera.x + this.game.player.view.width/2, y: this.game.player.view.y - this.game.camera.y + this.game.player.view.width/2},
			{x: this.game.mouse.x, y: this.game.mouse.y});
	}
}