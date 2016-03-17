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

		this.addActivity();
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

	}

	addActivity() {

		var self = this;
		var keyboard = this.game.keyboard;

		document.addEventListener('mousedown', function(e) {
			self.game.stage.build([self.material, self.position.sx, self.position.sy]);
		});

		document.addEventListener('keydown', function(e) {
			console.log(1);

			if (keyboard.isPressed('F')) {
				if (keyboard.isClicked('1', e.keyCode)) {
					self.material = 'wall_1';
				} else if (keyboard.isClicked('2', e.keyCode)) {
					self.material = 'wall_2';
				} else if (keyboard.isClicked('3', e.keyCode)) {
					self.material = 'wall_3';
				} else if (keyboard.isClicked('4', e.keyCode)) {
					self.material = 'wall_4';
				} else if (keyboard.isClicked('5', e.keyCode)) {
					self.material = 'wall_5';
				} else if (keyboard.isClicked('6', e.keyCode)) {
					self.material = 'wall_6';
				} else if (keyboard.isClicked('7', e.keyCode)) {
					self.material = 'wall_7';
				} else if (keyboard.isClicked('8', e.keyCode)) {
					self.material = 'wall_8';
				} else if (keyboard.isClicked('9', e.keyCode)) {
					self.material = 'wall_9';
				}
			}

			if (keyboard.isPressed('G')) {
				if (keyboard.isClicked('1', e.keyCode)) {
					self.material = 'wall_10';
				} else if (keyboard.isClicked('2', e.keyCode)) {
					self.material = 'wall_11';
				} else if (keyboard.isClicked('3', e.keyCode)) {
					self.material = 'wall_12';
				} else if (keyboard.isClicked('4', e.keyCode)) {
					self.material = 'wall_13';
				} else if (keyboard.isClicked('5', e.keyCode)) {
					self.material = 'wall_14';
				} else if (keyboard.isClicked('6', e.keyCode)) {
					self.material = 'wall_15';
				} else if (keyboard.isClicked('7', e.keyCode)) {
					self.material = 'wall_16';
				} else if (keyboard.isClicked('8', e.keyCode)) {
					self.material = 'wall_17';
				} else if (keyboard.isClicked('9', e.keyCode)) {
					self.material = 'wall_18';
				} else if (keyboard.isClicked('0', e.keyCode)) {
					self.material = 'wall_19';
				}
			}

			if (keyboard.isClicked('C', e.keyCode)) {
				self.game.stage.clean();
			}

			if (keyboard.isClicked('R', e.keyCode)) {
				self.game.stage.remove(self.position.sx, self.position.sy);
			}
			if (keyboard.isClicked('F3', e.keyCode)) {
				self.game.stage.logLevel();
			}
			if (keyboard.isClicked('F4', e.keyCode)) {
				self.game.stage.loadLevel('1');
			}
		})
	}
}