'use strict';
class Bullet extends Basis {
	constructor(game, params, owner) {
		super(game);
		this.size.width = 24;
		this.size.height = 24;
		this.position.x = params.x - this.size.width/2;
		this.position.y = params.y - this.size.height/2;
		this.direction = params.direction;
		this.speed = 5;
		this.animation.name = 'bullet';
		this.attack.damage = params.damage;
		this.owner = owner;
		this.timer = this.game.timer;
	}
	update() {
		if (this.isOuterCamera()) {
			this.game.removeBody(this);
		}
		
		for (var i=0, body; i<this.game.bodies.length; i++) {
			body = this.game.bodies[i];

			//if (!this.willDie && !body.willDie && body instanceof Asteroid && this.collidingBody(this, body)) {
			//	this.kill();
			//	this.speed = 0;
			//	body.hit(this.attack.damage);
			//}

			if (!this.willDie && !body.willDie && this.owner !== body && !(body instanceof Bullet) && this.collidingBody(body)) {
				this.kill();
				this.speed = 0;
				body.hit(this.attack.damage);
			}
		}
		this.position.x += this.direction.x * this.speed;
		this.position.y += this.direction.y * this.speed;


		this.faceBarrier(true);

		if (this.game.timer > this.timer + 100) {
			this.kill();
			this.speed = 0;
		}
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