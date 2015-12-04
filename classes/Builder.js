'use strict';

class Builder {
	constructor(game) {
		//super(game)
		this.game = game;
		this.size = {
			width: 24,
			height: 24
		};
		this.position = {
			x: 0,
			y: 0,
			sx: 0,
			sy: 0
		};
		this.speed = 3;

	}

	update() {
		this.position.sx = (this.game.point.x + this.game.camera.x) - (this.game.point.x + this.game.camera.x) % this.size.width;
		this.position.sy = (this.game.point.y + this.game.camera.y) - (this.game.point.y + this.game.camera.y) % this.size.width;
		this.move();
	}
	render () {


		this.game.screen.beginPath();
		this.game.screen.rect(this.position.sx - this.game.camera.x, this.position.sy - this.game.camera.y, this.size.width, this.size.height);
		this.game.screen.stroke();
	}
	move() {

		var x = this.position.sx;
		var y = this.position.sy;

		if (this.game.keyboard.isPressed('A')) {
			this.position.x -= this.speed;
		} else if (this.game.keyboard.isPressed('D')) {
			this.position.x += this.speed;
		}

		if (this.game.keyboard.isPressed('W')) {
			this.position.y -= this.speed;
		} else if (this.game.keyboard.isPressed('S')) {
			this.position.y += this.speed;
		}

		if (this.game.keyboard.isPressed('F')) {
			if (this.game.keyboard.isPressed('1')) {
				this.game.stage.build(['floor_1', x, y]);
			} else if (this.game.keyboard.isPressed('2')) {
				this.game.stage.build(['floor_2', x, y]);
			} else if (this.game.keyboard.isPressed('3')) {
				this.game.stage.build(['floor_3', x, y]);
			} else if (this.game.keyboard.isPressed('4')) {
				this.game.stage.build(['floor_4', x, y]);
			} else if (this.game.keyboard.isPressed('5')) {
				this.game.stage.build(['floor_5', x, y]);
			} else if (this.game.keyboard.isPressed('6')) {
				this.game.stage.build(['floor_6', x, y]);
			} else if (this.game.keyboard.isPressed('7')) {
				this.game.stage.build(['floor_7', x, y]);
			} else if (this.game.keyboard.isPressed('8')) {
				this.game.stage.build(['floor_8', x, y]);
			} else if (this.game.keyboard.isPressed('9')) {
				this.game.stage.build(['floor_9', x, y]);
			}
		}

		if (this.game.keyboard.isPressed('C')) {
			this.game.stage.clean();
		}

	}
}