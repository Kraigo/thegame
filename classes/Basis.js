'use strict';
class Basis {
	constructor(game) {
		this.game = game;
		this.size = {
			width: 16,
			height: 16
		};
		this.position = {x: 0, y: 0};
		this.speed = {x: 0, y: 0};
		this.velocity = {x: 0, y: 0};
		this.gravity = 0.5;
		this.animation = {
			state: 'stand',
			keyframe: 0,
			rate: 5
		};
	}
	render() {
		this.game.screen.beginPath();
		this.game.screen.rect(this.position.x - this.game.camera.x, this.position.y - this.game.camera.y, this.size.width, this.size.height);
		this.game.screen.stroke();
	}
	update() {
	}
	bounceWorld() {
		if (this.position.x + this.size.width > this.game.world.width || this.position.x < 0) {
			this.speed.x = -this.speed.x;
		}
		if (this.position.y + this.size.height > this.game.world.height || this.position.y < 0) {
			this.speed.y = -this.speed.y;
		}
	}
	isOuterWorld() {
		return !(this.position.x > -this.size.width &&
			this.position.x < this.game.world.width &&
			this.position.y > -this.size.height &&
			this.position.y < this.game.world.height)
	}
	fixStuckWorld() {
		if (this.position.x < 0) {
			this.position.x = 0;
			if (this.speed.x < 0) {
				this.speed.x = - this.speed.x;
			}
		} else if (this.position.x + this.size.width > this.game.world.width) {
			this.position.x = this.game.world.width - this.size.width;
			if (this.position.speed > 0) {
				this.speed.x = - this.speed.x;
			}
		}

		if (this.position.y < 0) {
			this.position.y = 0;
			if (this.speed.y < 0) {
				this.speed.y = - this.speed.y;
			}
		} else if (this.position.y + this.size.height > this.game.height) {
			this.position.y = this.game.world.height - this.size.height;
			if (this.position.speed > 0) {
				this.speed.y = - this.speed.y;
			}
		}
	}
	vectorNormalize(p1, p2) {
		// (x1,y2) ==> (x2, y2)
		var vx = p2.x + this.game.camera.x - p1.x - this.size.width/2;
		var vy = p2.y + this.game.camera.y - p1.y - this.size.height/2;
		var dxy = Math.sqrt(vx*vx + vy*vy);
		return {x: vx/dxy, y: vy/dxy}
	}

	vectorAngle(p1, p2) {
		var angleRadians = Math.atan2(p2.y - p1.y, p2.x - p1.x);
		return Math.atan2(p2.y - p1.y, p2.x - p1.x) * 180 / Math.PI;
	}
	brotherColliding() {
		var inst = this.constructor;
		for (var i=0, body; i<this.game.bodies.length; i++) {
			body = this.game.bodies[i];
			if (body instanceof inst && this.game.colliding(this, body)) {

				if ((this.speed.x > 0 && this.position.x < body.position.x) ||
					(this.speed.x < 0 && this.position.x > body.position.x)) {

					this.speed.x = -this.speed.x;
					body.speed.x = -body.speed.x;

					this.position.x += this.speed.x;
					body.position.x += body.speed.x;

				} else if ((this.speed.y > 0 && this.position.y < body.position.y) ||
					(this.speed.y < 0 && this.position.y > body.position.y)) {

					this.speed.y = -this.speed.y;
					body.speed.y = -body.speed.y;

					this.position.y += this.speed.y;
					body.position.y += body.speed.y;
				}		

			}
		}
	}
	changeAnimation(animName) {
		if (this.animation.state != animName) {
			this.animation.state = animName;
			this.animation.keyframe = 0;
		}
	}
}