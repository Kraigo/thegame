'use strict';
class Player extends Basis {
	constructor(game) {
		super(game);

		this.speed = 3;
		this.size.width = 48;
		this.size.height = 48;
		this.position.x = game.world.width/2 - this.size.width/2;
		this.position.y = game.world.height/2 - this.size.height/2;
		this.shooting = {
			bullet: 1,
			rate: 3,
			reload: 0
		};
		this.attack = {
			damageMin: 20,
			damageMax: 50,
			range: 10
		};
		this.animation.name = 'player';

	}
	render() {	
		this.game.screen.beginPath();
		this.game.screen.arc(this.position.x + this.size.width/2 - this.game.camera.x, this.position.y + this.size.height/2 - this.game.camera.y, (this.size.width + this.size.height) / 6, 0 ,2*Math.PI);
		this.game.screen.fillStyle="rgba(0,0,0,0.2)";
		this.game.screen.fill();

		var angle = this.vectorAngle(
			{x: this.position.x - this.game.camera.x + this.size.width/2, y: this.position.y - this.game.camera.y + this.size.width/2},
			{x: this.game.point.x, y: this.game.point.y});
		this.game.sprite.draw(this, angle);

		this.healthBar();
		this.faceBarrier();
	}
	update() {

		//for (var i=0, body; i<this.game.bodies.length; i++) {
		//	body = this.game.bodies[i];
		//	if (body instanceof Asteroid && this.game.collidingBody(this, body)) {
		//		console.log('loose');
		//	}
		//}
		if (this.game.keyboard.isPressed('W') || this.game.keyboard.isPressed('S') || this.game.keyboard.isPressed('A') || this.game.keyboard.isPressed('D')) {
			this.changeAnimation('walk');
		} else {
			this.changeAnimation('stand');
		}

		this.shot();
		this.move();
	}
	move() {
		this.direction.x = 0;
		this.direction.y = 0;

		if (this.game.keyboard.isPressed('A')) {
			this.direction.x = -1;
		} else if (this.game.keyboard.isPressed('D')) {
			this.direction.x = 1;
		}

		if (this.game.keyboard.isPressed('W')) {
			this.direction.y = -1;
		} else if (this.game.keyboard.isPressed('S')) {
			this.direction.y = 1;
		}

		this.position.x += this.direction.x * this.speed;
		this.position.y += this.direction.y * this.speed;
	}
	shot() {
		if (!this.shooting.bullet && ++this.shooting.reload >= 60 / this.shooting.rate) {
			this.shooting.bullet = 1;
			this.shooting.reload = 0;
		}


		if(this.shooting.bullet && (this.game.point.isPressed('LEFT') || this.game.keyboard.isPressed('SPACE'))) {
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
			this.game.addBody(new Bullet(this.game, bulletParams));
		}

	}
}