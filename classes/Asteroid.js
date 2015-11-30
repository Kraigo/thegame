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
		this.animation.name = 'monster';
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
	update() {
		this.bounceWorld();
		this.brotherColliding();

		this.fixStuckWorld();

		if (!this.willDie && this.speed > 0) {
			this.changeAnimation('walk');
		} else {
			this.changeAnimation('stand');
		}

		this.position.x += this.direction.x * this.speed;
		this.position.y += this.direction.y * this.speed;

		var directToPlayer = this.vectorNormalize(this.position, {x: this.game.player.position.x - this.game.camera.x, y: this.game.player.position.y - this.game.camera.y,});

		this.direction.x += (directToPlayer.x - this.direction.x)*0.05;
		this.direction.y += (directToPlayer.y - this.direction.y)*0.05;

		//if (this.position.x < this.game.player.position.x) this.direction.x += 0.01 ;
		//else this.direction.x -= 0.01;
		//if (this.position.y < this.game.player.position.y) this.direction.y += 0.01;
		//else this.direction.y -= 0.01;
	}
}