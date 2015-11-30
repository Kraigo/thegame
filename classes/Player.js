'use strict';
class Player extends Basis {
	constructor(game, options) {
		super(game);

		this.acceleration = {x: 3, y: 3};
		this.size.width = 48;
		this.size.height = 48;
		this.position.x = game.world.width/2 - this.size.width/2;
		this.position.y = game.world.height/2 - this.size.height/2;
		this.shooting = {
			bullet: 1,
			valocity: 5,
			rate: 5,
			reload: 0
		};
	}
	render() {	
		// this.game.screen.beginPath();
		// this.game.screen.arc(this.position.x + this.size.width/2 - this.game.camera.x, this.position.y + this.size.height/2 - this.game.camera.y, (this.size.width + this.size.height) / 4, 0 ,2*Math.PI);
		// this.game.screen.stroke();

		var angle = this.vectorAngle(
			{x: this.position.x - this.game.camera.x, y: this.position.y - this.game.camera.y},
			{x: this.game.point.x, y: this.game.point.y});
		this.game.sprite.draw('player', this, angle);
	}
	update() {

		for (var i=0, body; i<this.game.bodies.length; i++) {
			body = this.game.bodies[i];
			if (body instanceof Asteroid && this.game.colliding(this, body)) {
				console.log('loose');
			}
		}
		this.shot();
		this.move();
	}
	move() {
		if (this.game.keyboard.isPressed('A') && this.position.x > 0) {
			this.position.x -= this.acceleration.x;
		} else if (this.game.keyboard.isPressed('D') && this.position.x + this.size.width < this.game.world.width) {
			this.position.x += this.acceleration.x;
		}

		if (this.game.keyboard.isPressed('W') && this.position.y > 0) {
			this.position.y -= this.acceleration.y;
		} else if (this.game.keyboard.isPressed('S') && this.position.y + this.size.height < this.game.world.height) {
			this.position.y += this.acceleration.y;
		}

		if (this.game.keyboard.isPressed('W') || this.game.keyboard.isPressed('S') || this.game.keyboard.isPressed('A') || this.game.keyboard.isPressed('D')) {
			this.changeAnimation('walk');
		} else {	
			this.changeAnimation('stand');
		}
	}
	shot() {

		if (!this.bullet && ++this.shooting.reload >= 60 / this.shooting.rate) {
			this.bullet = 1;
			this.shooting.reload = 0;
		}


		if(this.bullet && this.game.point.isPressed('LEFT')) {
			this.bullet = 0;

			var shotDirection = this.vectorNormalize(this.position, this.game.point);
			shotDirection.x *= this.shooting.valocity;
			shotDirection.y *= this.shooting.valocity;

			this.game.addBody(new Bullet(this.game, {x: this.position.x + this.size.width/2, y: this.position.y + this.size.height/2}, shotDirection))
		}

	}
}