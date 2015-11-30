'use strict';
class Bullet extends Basis {
	constructor(game, position, direction) {
		super(game);
		this.size.width = 24;
		this.size.height = 24;
		this.position.x = position.x - this.size.width/2;
		this.position.y = position.y - this.size.height/2;
		this.direction = direction;
		this.speed = 5;
		this.animation.name = 'bullet';
	}
	update() {
		this.bounceWorld();
		this.fixStuckWorld();

		if (this.isOuterWorld()) {
			this.game.removeBody(this);
		}

		if (this.game.timer % this.selfRemove == 0) {
			this.game.removeBody(this)
		}
		
		for (var i=0, body; i<this.game.bodies.length; i++) {
			body = this.game.bodies[i];

			if (!body.willDie && body instanceof Asteroid && this.game.colliding(this, body)) {
				this.game.killBody(this);
				this.game.killBody(body);
			}
		}
		this.position.x += this.direction.x * this.speed;
		this.position.y += this.direction.y * this.speed;
	}
	render() {

		// this.game.screen.beginPath();
		// this.game.screen.rect(this.position.x - this.game.camera.x, this.position.y - this.game.camera.y, this.size.width, this.size.height);
		// this.game.screen.stroke();

		var angle = this.vectorAngle(
			{x: this.position.x - this.game.camera.x, y: this.position.y - this.game.camera.y},
			{x: this.position.x - this.game.camera.x + this.direction.x * this.speed, y: this.position.y - this.game.camera.y + this.direction.y * this.speed});
		this.game.sprite.draw(this, angle);
	}
}