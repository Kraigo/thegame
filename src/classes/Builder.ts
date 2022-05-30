import { Basis } from "./Basis";
import { ViewPosition } from "./utils/view-position";

export class Builder extends Basis {
    view: ViewPosition;
    material: { sx: number; sy: number; };

	constructor(game) {
		super(game, {});

		this.view = new ViewPosition({
			width: 24,
			height: 24,
			// x: 0,
			// y: 0,
			// sx: 0,
			// sy: 0
		});
		this.speed = 3;
		this.material = {
			sx: 0,
			sy: 0
		};

		this.addActivity();
	}

	update() {
		this.view.sx = (this.game.mouse.x + this.game.camera.x) - (this.game.mouse.x + this.game.camera.x) % this.view.width;
		this.view.sy = (this.game.mouse.y + this.game.camera.y) - (this.game.mouse.y + this.game.camera.y) % this.view.width;
		this.move();
	}
	render () {


		this.game.screen.beginPath();
		this.game.screen.strokeStyle = 'black';
		this.game.screen.rect(this.view.sx - this.game.camera.x, this.view.sy - this.game.camera.y, this.view.width, this.view.height);
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
		this.game.screen.rect(this.game.camera.width - 240 + this.material.sx, this.game.camera.height - 360 + this.material.sy, this.view.width, this.view.height);
		this.game.screen.stroke();


	}
	move() {

		var x = this.view.sx;
		var y = this.view.sy;

		if (this.game.keyboard.isPressed('A')) {
			this.view.x -= this.speed;
		} else if (this.game.keyboard.isPressed('D')) {
			this.view.x += this.speed;
		}

		if (this.game.keyboard.isPressed('W')) {
			this.view.y -= this.speed;
		} else if (this.game.keyboard.isPressed('S')) {
			this.view.y += this.speed;
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
				x = x - (x % self.view.width);
				y = y - (y % self.view.height);

				self.material.sx = x;
				self.material.sy = y;
				console.log(self.material.sx, self.material.sy);
			} else {
				self.game.stage.build({
					x:self.view.sx,
					y: self.view.sy,
					sx: self.material.sx,
					sy: self.material.sy
				});
			}
		});

		document.addEventListener('keydown', function(e) {

			if (keyboard.isClicked('SPACE', e.keyCode)) {
				self.game.stage.addSolid(self.view.sx, self.view.sy, 24, 24);
				// self.game.stage.simplifySolid();
			}

			if (keyboard.isClicked('C', e.keyCode)) {
				self.game.stage.clean();
			}

			if (keyboard.isClicked('R', e.keyCode)) {
				self.game.stage.remove(self.view.sx, self.view.sy);
			}

			if (keyboard.isClicked('1', e.keyCode)) {
				// self.game.stage.simplifySolid();
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