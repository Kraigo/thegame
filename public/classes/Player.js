'use strict';
class Player extends Basis {
	constructor(game, params) {
		params = params || {};
		super(game);

		this.id = null;
		this.speed = 3;
		this.size.width = 48;
		this.size.height = 48;
		this.position.x = params.x || game.world.width/2 - this.size.width/2;
		this.position.y = params.y || game.world.height/2 - this.size.height/2;
		this.shooting = {
			start: false,
			bullet: 1,
			rate: 3,
			reload: 0
		};
		this.attack = {
			damageMin: 5,
			damageMax: 10,
			range: 10
		};
		this.animation.name = 'player';
	}
	render() {
		this.game.screen.beginPath();
		this.game.screen.arc(this.position.x + this.size.width/2 - this.game.camera.x, this.position.y + this.size.height/2 - this.game.camera.y, (this.size.width + this.size.height) / 6, 0 ,2*Math.PI);
		this.game.screen.fillStyle="rgba(0,0,0,0.2)";
		this.game.screen.fill();
		this.game.sprite.draw(this, this.lookAngel);

		this.healthBar();
	}
	update() {

		//for (var i=0, body; i<this.game.bodies.length; i++) {
		//	body = this.game.bodies[i];
		//	if (body instanceof Asteroid && this.game.collidingBody(this, body)) {
		//		console.log('loose');
		//	}
		//}

		this.shot();
		this.move();

	}
	move() {
		this.faceBarrier();

		if (this.direction.x || this.direction.y) {
			this.position.x += this.direction.x * this.speed;
			this.position.y += this.direction.y * this.speed;
			this.changeAnimation('walk');
		} else {
			this.changeAnimation('stand');
		}

	}
	shot() {
		if (!this.shooting.bullet && ++this.shooting.reload >= 60 / this.shooting.rate) {
			this.shooting.bullet = 1;
			this.shooting.reload = 0;
		}


		if(this.shooting.bullet && this.shooting.start) {
			this.shooting.bullet = 0;


			var bulletParams = {
				x: this.position.x + this.size.width/2,
				y: this.position.y + this.size.height/2,
				direction: this.directionTo({
					position: {
						x: this.game.point.x + this.game.camera.x,
						y: this.game.point.y + this.game.camera.y
					},
					size: {
						width: 0,
						height: 0
					}
				}),
				damage: this.getRandomInt(this.attack.damageMin, this.attack.damageMax)
			};

			this.game.addBody(new Bullet(this.game, bulletParams, this.game.player));

		}

	}
}