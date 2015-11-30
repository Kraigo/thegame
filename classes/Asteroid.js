'use strict';
class Asteroid extends Basis {
	constructor(game, options) {
		super(game);

		this.size = {
			width: options.width || 48,
			height: options.height || 48
		};

		this.position = {
			x: Math.floor(Math.random()*(this.game.world.width-this.size.width)),
			y: Math.floor(Math.random()*(this.game.world.height-this.size.height))
		};

		this.speed = {
			x: Math.random() * 2 - 1,
			y: Math.random() * 2 - 1
		};
	}
	render() {
		// this.game.screen.beginPath();
		// this.game.screen.rect(this.position.x - this.game.camera.x, this.position.y - this.game.camera.y, this.size.width, this.size.height);
		// this.game.screen.stroke();
		this.changeAnimation('walk');

		var angle = this.vectorAngle(
			{x: this.position.x - this.game.camera.x, y: this.position.y - this.game.camera.y},
			{x: this.position.x - this.game.camera.x + this.speed.x, y: this.position.y - this.game.camera.y + this.speed.y});
		this.game.sprite.draw('monster', this, angle);
	}
	update() {
		this.bounceWorld();
		this.brotherColliding();

		this.fixStuckWorld();

		this.position.x += this.speed.x;
		this.position.y += this.speed.y;

		if (this.position.x < this.game.player.position.x) this.speed.x += 0.01;
		else this.speed.x -= 0.01
		if (this.position.y < this.game.player.position.y) this.speed.y += 0.01;
		else this.speed.y -= 0.01
	}
}