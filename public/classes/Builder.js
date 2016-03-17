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
		this.material = {
			sx: 0,
			sy: 0
		};

		this.addActivity();
	}

	update() {
		this.position.sx = (this.game.point.x + this.game.camera.x) - (this.game.point.x + this.game.camera.x) % this.size.width;
		this.position.sy = (this.game.point.y + this.game.camera.y) - (this.game.point.y + this.game.camera.y) % this.size.width;
		this.move();
	}
	render () {


		this.game.screen.beginPath();
		this.game.screen.strokeStyle = 'black';
		this.game.screen.rect(this.position.sx - this.game.camera.x, this.position.sy - this.game.camera.y, this.size.width, this.size.height);
		this.game.screen.stroke();

		this.game.screen.beginPath();
		this.game.screen.fillStyle = 'white';
		this.game.screen.fillRect(this.game.camera.width - 240, this.game.camera.height - 360, 240, 360);
		this.game.screen.stroke();

		this.game.screen.drawImage(
			this.game.stage.image,
			0,
			0,
			240,
			360,
			this.game.camera.width - 240,
			this.game.camera.height - 360,
			240,
			360
		);

		this.game.screen.beginPath();
		this.game.screen.strokeStyle = 'red';
		this.game.screen.rect(this.game.camera.width - 240 + this.material.sx, this.game.camera.height - 360 + this.material.sy, this.size.width, this.size.height);
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
		var game = this.game;

		document.addEventListener('mousedown', function(e) {
			if (e.x > game.camera.width - 240 && e.y > game.camera.height - 360) {
				var x = e.x - (game.camera.width - 240);
				var y = e.y - (game.camera.height - 360);
				x = x - (x % self.size.width);
				y = y - (y % self.size.height);

				self.material.sx = x;
				self.material.sy = y;
				console.log(self.material.sx, self.material.sy);
			} else {
				self.game.stage.build({
					x:self.position.sx,
					y: self.position.sy,
					sx: self.material.sx,
					sy: self.material.sy
				});
			}
		});

		document.addEventListener('keydown', function(e) {

			if (keyboard.isClicked('SPACE', e.keyCode)) {
				self.game.stage.addSolid(self.position.sx, self.position.sy);
				self.game.stage.simplifySolid();
			}

			if (keyboard.isClicked('C', e.keyCode)) {
				self.game.stage.clean();
			}

			if (keyboard.isClicked('R', e.keyCode)) {
				self.game.stage.remove(self.position.sx, self.position.sy);
			}

			if (keyboard.isClicked('1', e.keyCode)) {
				self.game.stage.simplifySolid();
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