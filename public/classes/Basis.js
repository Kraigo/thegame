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
		this.look = {x: 0, y: 0}
		this.lookAngel = 0;
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
		this.density = 0;
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
	colliding(b1, b2) {
		var dx = b1.x - b2.x;
		var dy = b1.y - b2.y;
		var distance = Math.sqrt(dx * dx + dy * dy);

		return (distance < b1.r + b2.r);
	}
	collidingSqr(body) {
		return !(this.position.x + this.size.width < body.position.x ||
			this.position.y + this.size.height < body.position.y ||
			this.position.x > body.position.x + body.size.width ||
			this.position.y > body.position.y + body.size.height);
	}
	collidingBody(body) {
		return (this != body && this.colliding(
					{x: this.position.x, y: this.position.y, r: this.size.width/2},
					{x: body.position.x, y: body.position.y, r: body.size.width/2})
				);
	}
	brotherColliding() {
		var inst = this.constructor;

		for (var i=0, body; i<this.game.bodies.length; i++) {
			body = this.game.bodies[i];
			if (body instanceof inst && this.collidingBody(body)) {


				//var dirTo = this.directionTo(body);
				//var range = this.size.width/2 + body.size.width/2;
                //
				//this.position.x += -dirTo.x * range * body.density;
				//this.position.y += -dirTo.y * range * body.density;
				//body.position.x -= -dirTo.x * range * this.density;
				//body.position.y -= -dirTo.y * range * this.density;
                //
				//return;

				if (this.position.x < body.position.x) {
					var diff = (this.position.x + this.size.width - body.position.x ) / 2 * body.density;
					this.position.x -= diff;
					body.position.x += diff;
				} else if (this.position.x > body.position.x) {
					var diff = (body.position.x - this.position.x + this.size.width) / 2 * body.density;
					this.position.x += diff;
					body.position.x -= diff;
				}


				if (this.position.y < body.position.y) {
					var diff = (this.position.y + this.size.height - body.position.y ) / 2 * body.density;
					this.position.y -= diff;
					body.position.y += diff;
				} else if (this.position.y > body.position.y) {
					var diff = (body.position.y - this.position.y + this.size.height) / 2 * body.density;
					this.position.y += diff;
					body.position.y -= diff;
				}

			}
		}
	}
	isOuterCamera() {
		return !this.collidingSqr(this)
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
	directionTo(body) {
		// (x1,y2) ==> (x2, y2)
		var vx = (body.position.x + body.size.width/2) - (this.position.x + this.size.width/2);
		var vy = (body.position.y + body.size.height/2) - (this.position.y + this.size.height/2);
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

	//isReach(body) {
	//	return (this != body && this.colliding(
	//			{x: this.position.x, y: this.position.y, r: this.size.width/2},
	//			{x: body.position.x, y: body.position.y, r: this.attack.range + this.size.width/2}));
	//}
	faceBarrier(bounce) {

		for (var i = 0, item; i < this.game.stage.levelSolid.length; i++) {


			item = {
				position: {
					x: this.game.stage.levelSolid[i].x,
					y: this.game.stage.levelSolid[i].y
				},
				size: {
					width: this.game.stage.levelSolid[i].width,
					height: this.game.stage.levelSolid[i].height
				}
			};

			var collided = false;

			if (this.collidingSqr(item)) {


				var acenter = { x: this.position.x + this.size.width / 2, y: this.position.y + this.size.height / 2 };
				var bcenter = { x: item.position.x + item.size.width / 2, y: item.position.y + item.size.height / 2 };
				var d = { x: acenter.x - bcenter.x, y: acenter.y - bcenter.y };

				if (Math.abs(d.x) > item.size.width/2 ) {
					this.position.x += Math.sign(d.x) * this.speed;
				}

				if (Math.abs(d.y) > item.size.height/2 ) {
					this.position.y += Math.sign(d.x) * this.speed;
				}


				//var direction = this.directionTo(item);
				//var range = this.size.width/2 + item.size.width/2;

				//this.position.x += -direction.x * range * 0.1;
				//this.position.y += -direction.y * range * 0.1;
				//this.direction.x = 0;
				//this.direction.y = 0;

				//this.game.screen.beginPath();
				//this.game.screen.moveTo(this.position.x + this.size.width/2 - this.game.camera.x, this.position.y + this.size.height/2 - this.game.camera.y);
				//this.game.screen.lineTo(item.position.x + item.size.width/2 - this.game.camera.x, item.position.y + item.size.height/2 - this.game.camera.y);
				//this.game.screen.strokeStyle = 'red';
				//this.game.screen.stroke();
				//this.game.screen.strokeStyle= '#000';

				//this.position.x += -direction.x * range * 0.1;
				//this.position.y += -direction.y * range * 0.1;
				collided = true;

			}

			if (bounce && collided) {


				var acenter = { x: this.position.x + this.size.width / 2, y: this.position.y + this.size.height / 2 };
				var bcenter = { x: item.position.x + item.size.width / 2, y: item.position.y + item.size.height / 2 };
				var d = { x: acenter.x - bcenter.x, y: acenter.y - bcenter.y };

				if (Math.abs(d.x) > item.size.width/2 ) {
					this.direction.x = -this.direction.x;
				}

				if (Math.abs(d.y) > item.size.height/2 ){
					this.direction.y = -this.direction.y;
				}

				this.position.x += this.direction.x*this.speed;
				this.position.y += this.direction.y*this.speed;

				//if ((this.position.x < item.position.x && this.direction.x > 0) || (this.position.x > item.position.x && this.direction.x < 0)) {
				//	this.direction.x = -this.direction.x;
				//} else if ((this.position.y < item.position.y && this.direction.y > 0) || (this.position.y > item.position.y && this.direction.y < 0)) {
				//	this.direction.y = -this.direction.y;
				//}
			}

		}
	}

}