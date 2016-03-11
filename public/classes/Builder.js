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

		this.material = '';

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
				this.material = 'wall_1';
			} else if (this.game.keyboard.isPressed('2')) {
				this.material = 'wall_2';
			} else if (this.game.keyboard.isPressed('3')) {
				this.material = 'wall_3';
			} else if (this.game.keyboard.isPressed('4')) {
				this.material = 'wall_4';
			} else if (this.game.keyboard.isPressed('5')) {
				this.material = 'wall_5';
			} else if (this.game.keyboard.isPressed('6')) {
				this.material = 'wall_6';
			} else if (this.game.keyboard.isPressed('7')) {
				this.material = 'wall_7';
			} else if (this.game.keyboard.isPressed('8')) {
				this.material = 'wall_8';
			} else if (this.game.keyboard.isPressed('9')) {
				this.material = 'wall_9';
			}
		}

		if (this.game.keyboard.isPressed('G')) {
			if (this.game.keyboard.isPressed('1')) {
				this.material = 'wall_10';
			} else if (this.game.keyboard.isPressed('2')) {
				this.material = 'wall_11';
			} else if (this.game.keyboard.isPressed('3')) {
				this.material = 'wall_12';
			} else if (this.game.keyboard.isPressed('4')) {
				this.material = 'wall_13';
			} else if (this.game.keyboard.isPressed('5')) {
				this.material = 'wall_14';
			} else if (this.game.keyboard.isPressed('6')) {
				this.material = 'wall_15';
			}
		}

		if (this.game.keyboard.isPressed('C')) {
			this.game.stage.clean();
		}

		if (this.game.point.isPressed('LEFT')) {
			this.game.stage.build([this.material, x, y]);
		}

	}
}