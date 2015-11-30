'use strict';
class Bullet extends Basis {
	constructor(game, position, speed) {
		super(game);
		this.size.width = 24;
		this.size.height = 24;
		this.position.x = position.x - this.size.width/2;
		this.position.y = position.y - this.size.height/2;
		this.speed = speed || {x:0, y:0};
	}
	update() {
		this.bounceWorld();
		this.fixStuckWorld();

		if (this.isOuterWorld()) {
			// Problem!
			// this.game.removeBody(this);
		}

		if (this.game.timer % this.selfRemove == 0) {
			this.game.removeBody(this)
		}
		
		for (var i=0, body; i<this.game.bodies.length; i++) {
			body = this.game.bodies[i];

			if (body instanceof Asteroid && this.game.colliding(this, body)) {

				// this.game.removeBody([body, this]);

				this.speed.x = this.speed.y = 0;
				this.changeAnimation('exploed');
				this.selfRemove = 12;

				// var position = this.position;
				// var exploed = new Bullet(this.game, position);
				// exploed.changeAnimation('exploed');
				// this.game.addBody(exploed);		
			}
		}
		this.position.x += this.speed.x;
		this.position.y += this.speed.y;
	}
	render() {

		// this.game.screen.beginPath();
		// this.game.screen.rect(this.position.x - this.game.camera.x, this.position.y - this.game.camera.y, this.size.width, this.size.height);
		// this.game.screen.stroke();

		var angle = this.vectorAngle(
			{x: this.position.x - this.game.camera.x, y: this.position.y - this.game.camera.y},
			{x: this.position.x - this.game.camera.x + this.speed.x, y: this.position.y - this.game.camera.y + this.speed.y});
		this.game.sprite.draw('bullet', this, angle);
	}
}