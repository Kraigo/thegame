'use strict';
class Asteroid extends Basis {
	constructor(game, options) {
		super(game);

		this.size = {
			width: options.width || 24,
			height: options.height || 24
		}

		this.position = {
			x: Math.floor(Math.random()*(this.game.world.width-this.size.width)),
			y: Math.floor(Math.random()*(this.game.world.height-this.size.height))
		}
		this.speed = {
			x: Math.random() * 2 - 1,
			y: Math.random() * 2 - 1
		}
	}
	render() {
		this.game.screen.beginPath();
		this.game.screen.rect(this.position.x - this.game.camera.x, this.position.y - this.game.camera.y, this.size.width, this.size.height);
		this.game.screen.stroke();
	}
	update() {
		this.bounceWorld();
		this.brotherColliding();

		this.fixStuckWorld();

		this.position.x += this.speed.x;
		this.position.y += this.speed.y;
	}
}