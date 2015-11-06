'use strict';
class Bullet extends Basis {
	constructor(game, position, speed) {
		super(game);
		this.size.width = 2;
		this.size.height = 2;
		this.position.x = position.x - this.size.width/2;
		this.position.y = position.y - this.size.height/2;
		this.speed = speed;
	}
	update() {
		this.bounceWorld();

		if (this.isOuterWorld()) {
			this.game.removeBody(this);	
		}

		for (var i=0, body; i<this.game.bodies.length; i++) {
			body = this.game.bodies[i];
			if (body instanceof Asteroid && this.game.colliding(this, body)) {
				this.game.removeBody([body, this]);
			}
		}
		this.position.x += this.speed.x;
		this.position.y += this.speed.y;
	}
}