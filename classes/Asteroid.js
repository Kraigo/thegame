'use strict';
class Asteroid extends Basis {
	constructor(game, options) {
		super(game);

		this.size = {
			width: options.width || 48,
			height: options.height || 48
		};

		this.position = {
			x: Math.floor(Math.random()*(this.game.world.width-this.size.width)),
			y: Math.floor(Math.random()*(this.game.world.height-this.size.height))
		};

		this.direction = {
			x: Math.random(),
			y: Math.random()
		};

		this.speed = Math.random() * 2;
		this.speed = 3;
		this.animation.name = 'monster';
		this.health.max = 100;
		this.health.current = 100;
		this.target = options.target || null;
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

		if (this.speed) {
			this.changeAnimation('walk');
			this.position.x += this.direction.x * this.speed;
			this.position.y += this.direction.y * this.speed;

			if (this.target) {
				this.routeToTarget();
			}

		} else if (!this.willDie) {
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