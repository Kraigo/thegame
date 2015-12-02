'use strict';
class Asteroid extends Basis {
	constructor(game, params) {
		super(game);

		this.size = {
			width: params.width,
			height: params.height
		};

		this.position = {
			x: Math.floor(Math.random()*(this.game.world.width-this.size.width)),
			y: Math.floor(Math.random()*(this.game.world.height-this.size.height))
		};

		this.direction = {
			x: Math.random(),
			y: Math.random()
		};
		this.attack.range = 5;

		this.speed = Math.random() * 2;
		this.speed = 3;
		this.animation.name = 'monster';
		this.target = params.target || null;
	}
	render() {
		this.game.screen.beginPath();
		this.game.screen.arc(this.position.x + this.size.width/2 - this.game.camera.x, this.position.y + this.size.height/2 - this.game.camera.y, (this.size.width + this.size.height) / 6, 0 ,2*Math.PI);
		this.game.screen.fillStyle="rgba(0,0,0,0.2)";
		this.game.screen.fill();

		var angle = this.vectorAngle(
			{x: this.position.x - this.game.camera.x, y: this.position.y - this.game.camera.y},
			{x: this.position.x - this.game.camera.x + this.direction.x, y: this.position.y - this.game.camera.y + this.direction.y});
		this.game.sprite.draw(this, angle);

		this.healthBar();
	}
	update() {
		this.bounceWorld();
		this.brotherColliding();
		this.fixStuckWorld();


		if (this.willDie) {

		}
		else if (this.willAttack || this.isReach(this.target)) {
			this.willAttack = true;
			this.changeAnimation('attack');

			if (this.animation.end) {
				this.willAttack = false;

				if (this.isReach(this.target)) {
					console.log('hit you');
					this.target.hit(this.getRandomInt(this.attack.damageMin, this.attack.damageMax));
				}

				this.changeAnimation('stand');
			}
		}
		else if (this.speed) {
			this.changeAnimation('walk');
			this.position.x += this.direction.x * this.speed;
			this.position.y += this.direction.y * this.speed;

			if (this.target) {
				this.routeToTarget();
			}

		}
		else {
			this.changeAnimation('stand');
		}

	}

	routeToTarget() {
		var direction = this.vectorNormalize(this.position, {
			x: this.target.position.x - this.game.camera.x + this.target.size.width / 2,
			y: this.target.position.y - this.game.camera.y + this.target.size.height / 2
		});

		this.direction.x += (direction.x - this.direction.x) * 0.05;
		this.direction.y += (direction.y - this.direction.y) * 0.05;
	}
}