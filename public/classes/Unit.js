'use strict';
class Unit extends Basis {
	constructor(game, params) {
		params = params || {};
		super(game, params);
		this.id = null;
		this.speed = 3;

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
		this.contacts = [];
		this.animation.name = 'player';
	}
	render() {
		this.game.screen.beginPath();
		this.game.screen.arc(this.view.x + this.view.width/2 - this.game.camera.x, this.view.y + this.view.height/2 - this.game.camera.y, (this.view.width + this.view.height) / 6, 0 ,2*Math.PI);
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

		let enterContacts = this.faceBodies();

		for(var i = 0; i < enterContacts.length; i++) {
			enterContacts[i].body.onEnter(this);
		}

		let leaveContacts = this.contacts.filter(c => !enterContacts.some(e => e.body == c));

		for (var i = 0; i < leaveContacts.length; i++) {
			leaveContacts[i].onLeave(this);
		}

		this.contacts = enterContacts.map(c => c.body);


	}
	move() {
		if (this.direction.x || this.direction.y) {
			this.stepMove(this.direction.x * this.speed, this.direction.y * this.speed);	
			this.changeAnimation('walk');
		} else {
			this.changeAnimation('stand');
		}
		this.fixStuck();
	}


	shot() {
		if (!this.shooting.bullet && ++this.shooting.reload >= 60 / this.shooting.rate) {
			this.shooting.bullet = 1;
			this.shooting.reload = 0;
		}


		if(this.shooting.bullet && this.shooting.start) {
			this.shooting.bullet = 0;


			var bulletParams = {
				x: this.view.x + this.view.width/2,
				y: this.view.y + this.view.height/2,
				direction: this.directionTo({
					view: {
						x: this.game.mouse.x + this.game.camera.x,
						y: this.game.mouse.y + this.game.camera.y
					},
					view: {
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