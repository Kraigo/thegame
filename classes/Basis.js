'use strict';
class Basis {
	constructor(game) {
		this.game = game;
		this.size = {
			width: 16,
			height: 16,
			radius: 16
		};
		this.position = {x: 0, y: 0};
		this.direction = {x: 0, y: 0};
		this.view = {x: 0, y: 0};
		this.speed = 0;
		this.velocity = 0;
		this.gravity = 0.5;
		this.animation = {
			name: null,
			state: 'stand',
			keyframe: 0,
			rate: 5,
			end: false
		};
		this.health = {
			max: 100,
			current: 100
		};

		this.attack = {
			damageMin: 1,
			damageMax: 2,
			range: 0
		};

		this.willDie = false;
		this.willAttack = false;
		this.rotationSpeed = 0.05;
	}
	render() {
		this.game.screen.beginPath();
		this.game.screen.rect(this.position.x - this.game.camera.x, this.position.y - this.game.camera.y, this.size.width, this.size.height);
		this.game.screen.stroke();
	}
	healthBar() {
		var healthBar = {
			x: this.position.x - this.game.camera.x,
			y: this.position.y - this.game.camera.y-5,
			height: 3,
			width: this.size.width * (this.health.current / this.health.max)
		};
		this.game.screen.beginPath();
		this.game.screen.rect(healthBar.x, healthBar.y, this.size.width, healthBar.height);
		this.game.screen.fillStyle = 'red';
		this.game.screen.fillRect(healthBar.x, healthBar.y, healthBar.width, healthBar.height);
		this.game.screen.stroke();
	}
	update() {
	}
	colliding(b1,b2) {
		var dx = b1.x - b2.x;
		var dy = b1.y - b2.y;
		var distance = Math.sqrt(dx * dx + dy * dy);

		return (distance < b1.r + b2.r);
	}
	collidingSqr(b1,b2) {
		return !(b1 == b2 ||
			b1.x + b1.width <= b2.x ||
			b1.y + b1.height <= b2.y ||
			b1.x >= b2.x + b2.width ||
			b1.y >= b2.y + b2.height);
	}
	collidingBody(b1,b2) {
		return (b1 != b2 && this.colliding(
					{x: b1.position.x, y: b1.position.y, r: b1.size.width/2},
					{x: b2.position.x, y: b2.position.y, r: b2.size.width/2})
				);
	}
	brotherColliding() {
		var inst = this.constructor;
		var intensity = 0.03;

		for (var i=0, body; i<this.game.bodies.length; i++) {
			body = this.game.bodies[i];
			if (body instanceof inst && this.collidingBody(this, body)) {

				if (this.position.x < body.position.x) {
					var diff = (this.position.x + this.size.width - body.position.x ) / 2 * intensity;
					this.position.x -= diff;
					body.position.x += diff;
				} else if (this.position.x > body.position.x) {
					var diff = (body.position.x - this.position.x + this.size.width) / 2 * intensity;
					this.position.x += diff;
					body.position.x -= diff;
				}


				if (this.position.y < body.position.y) {
					var diff = (this.position.y + this.size.height - body.position.y ) / 2 * intensity;
					this.position.y -= diff;
					body.position.y += diff;intensity
				} else if (this.position.y > body.position.y) {
					var diff = (body.position.y - this.position.y + this.size.height) / 2 * intensity;
					this.position.y += diff;
					body.position.y -= diff;
				}

			}
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
			if (this.direction.x < 0) {
				this.direction.x = - this.direction.x;
			}
		} else if (this.position.x + this.size.width > this.game.world.width) {
			this.position.x = this.game.world.width - this.size.width;
			if (this.direction.x > 0) {
				this.direction.x = - this.direction.x;
			}
		}

		if (this.position.y < 0) {
			this.position.y = 0;
			if (this.direction.y < 0) {
				this.direction.y = - this.direction.y;
			}
		} else if (this.position.y + this.size.height > this.game.world.height) {
			this.position.y = this.game.world.height - this.size.height;
			if (this.direction.y > 0) {
				this.direction.y = - this.direction.y;
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
	getRandomInt(min, max) {
		return Math.floor(Math.random() * (max - min + 1)) + min;
	}

	//vectorAngle(vector) {
	//	var angleRad = Math.acos( vector.x / Math.sqrt(vector.x*vector.x + vector.y*vector.y) );
	//	return angleRad * 180 / Math.PI;
	//}

	changeAnimation(animName) {
		if (this.animation.state != animName) {
			this.animation.state = animName;
			this.animation.keyframe = 0;
			this.animation.end = false;
		}
	}
	kill() {
		this.willDie = true;
		this.changeAnimation('die');
	}

	hit(damage) {
		this.health.current -= damage;
		if (this.health.current <= 0) {
			this.health.current = 0;
			this.kill();
		}
	}

	isReach(body) {
		return (this != body && this.colliding(
				{x: this.position.x, y: this.position.y, r: this.size.width/2},
				{x: body.position.x, y: body.position.y, r: this.attack.range + this.size.width/2}));
	}
	faceBarrier(bounce) {
		for (var i = 0, item; i < this.game.stage.levelSolid.length; i++) {
			item = {
				x: this.game.stage.levelSolid[i].x,
				y: this.game.stage.levelSolid[i].y,
				width: this.game.stage.size.width,
				height: this.game.stage.size.height
			};
			var collided = false;

			// if (this.collidingSqr({
			// 			x: this.position.x,
			// 			y: this.position.y,
			// 			width: this.size.width,
			// 			height: this.size.height
			// 		}, {
			// 			x: this.game.stage.levelSolid[i].x + this.game.stage.size.width / 2,
			// 			y: this.game.stage.levelSolid[i].y + this.game.stage.size.height / 2,
			// 			width: this.game.stage.size.width / 4,
			// 			height: this.game.stage.size.height / 4
			// 		})) {

			// 	if (this.position.x < item.x) {
			// 		this.position.x = item.x+this.size.width;
			// 		if (this.direction.x > 0) {
			// 			this.direction.x = 0 ;
			// 		}
			// 	} else if (this.position.x > item.x) {
			// 		this.position.x =  item.x + item.width;
			// 		if (this.direction.x < 0) {
			// 			this.direction.x = 0;
			// 		}
			// 	}

			// 	if (this.position.y < item.y) {
			// 		this.position.y = item.y+this.size.height;
			// 		if (this.direction.y > 0) {
			// 			this.direction.y = 0 ;
			// 		}
			// 	} else if (this.position.y > item.y) {
			// 		this.position.y =  item.y + item.height;
			// 		if (this.direction.y < 0) {
			// 			this.direction.y = 0;
			// 		}
			// 	}

			// }


			// continue;

			if (this.collidingSqr({
						x: this.position.x + this.direction.x * this.speed,
						y: this.position.y,
						width: this.size.width,
						height: this.size.height
					}, item)) {
				if (!bounce) this.direction.x = 0;
				collided = true;
			}

			if (this.collidingSqr({
						x: this.position.x,
						y: this.position.y + this.direction.y * this.speed,
						width: this.size.width,
						height: this.size.height
					}, item)) {
				if (!bounce) this.direction.y = 0;
				collided = true;
			}

			if (bounce && collided) {
				if ((this.position.x < item.x && this.direction.x > 0) || (this.position.x > item.x && this.direction.x < 0)) {
					this.direction.x = -this.direction.x;
				} else if ((this.position.y < item.y && this.direction.y > 0) || (this.position.y > item.y && this.direction.y < 0)) {
					this.direction.y = -this.direction.y;
				}
			}

		}
	}
}