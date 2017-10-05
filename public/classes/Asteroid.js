'use strict';
class Asteroid extends Unit {
	constructor(game, params) {
		super(game, params);
		// this.view = {
		// 	width: params.width,
		// 	height: params.height,
		// 	x: params.x || Math.floor(Math.random()*(this.game.world.width-this.view.width)),
		// 	y: params.y || Math.floor(Math.random()*(this.game.world.height-this.view.height))
		// };

		this.direction = {
			x: Math.random(),
			y: Math.random()
		};
		this.attack.range = 5;

		this.speed = Math.random() * 2;
		this.speed = 3;
		this.animation.name = 'monster';
		this.target = params.target || null;
		this.density = 0.03;
		this.path = [];
	}
	render() {
		this.game.screen.beginPath();
		this.game.screen.arc(this.view.x + this.view.width/2 - this.game.camera.x, this.view.y + this.view.height/2 - this.game.camera.y, (this.view.width + this.view.height) / 6, 0 ,2*Math.PI);
		this.game.screen.fillStyle="rgba(0,0,0,0.2)";
		this.game.screen.fill();

		var angle = this.vectorAngle(
			{x: this.view.x - this.game.camera.x, y: this.view.y - this.game.camera.y},
			{x: this.view.x - this.game.camera.x + this.look.x, y: this.view.y - this.game.camera.y + this.look.y});
		this.game.sprite.draw(this, angle);
		this.healthBar();

		if(this.game.debug) {
			this.renderPath();
		}
	}
	update() {

		if (this.target) {
			var path = this.game.stage.path(this, this.target);
			if (path.length) {
				for (var i = 0, pointView; i < path.length; i ++) {
					pointView = {
						x: path[i][0],
						y: path[i][1],
						width: 0,
						height: 0
					};

					if (!this.collidingSqr({view: pointView})) {
						this.direction = this.directionTo(pointView);
						this.move();
						this.routeTo(pointView);
						// if (direction.x || direction.y) {
						// 	// this.stepMove(direction.x * this.speed, direction.y * this.speed);
						// 	this.move();
						// 	this.routeTo(pointView);
						// }
						break;

					}

				}

			} 
		}
		//this.bounceWorld();
		// this.brotherColliding();
		//this.fixStuckWorld();


		// if (this.willDie) {

		// }
		// else if (this.willAttack || this.isReach(this.target)) {
		// 	this.willAttack = true;
		// 	this.changeAnimation('attack');

		// 	if (this.animation.end) {
		// 		this.willAttack = false;

		// 		if (this.isReach(this.target)) {
		// 			console.log('hit you');
		// 			this.target.hit(this.getRandomInt(this.attack.damageMin, this.attack.damageMax));
		// 		}

		// 		this.changeAnimation('stand');
		// 	}
		// }
		// else if (this.speed) {
		// 	if (this.target) {
		// 		this.routeToTarget();
		// 	}
		// 	this.changeAnimation('walk');

		// 	this.faceBarrier();
		// 	this.view.x += this.direction.x * this.speed;
		// 	this.view.y += this.direction.y * this.speed;



		// }
		// else {
		// 	this.changeAnimation('stand');
		// }

	}

	routeTo(view) {
		var direction = this.directionTo(view);
		this.look.x += (direction.x - this.look.x) * this.rotationSpeed;
		this.look.y += (direction.y - this.look.y) * this.rotationSpeed;
	}

	routeToTarget() {
		var direction = this.directionTo({
			view: {
				x: this.target.view.x,
				y: this.target.view.y
			},
			view: {
				width: this.view.width,
				height: this.view.height
			}
		});

		this.direction.x += (direction.x - this.direction.x) * this.rotationSpeed;
		this.direction.y += (direction.y - this.direction.y) * this.rotationSpeed;
		this.look.x += (direction.x - this.look.x) * this.rotationSpeed;
		this.look.y += (direction.y - this.look.y) * this.rotationSpeed;
	}


	renderPath() {
		if (this.path.length) {
			for(var i = 0; i < this.path.length; i++) {
				let x = this.path[i][0];
				let y = this.path[i][1];
				this.game.screen.fillStyle = 'yellow';
				this.game.screen.fillRect(
					x - this.game.camera.x,
					y - this.game.camera.y,
					this.game.stage.size.width,
					this.game.stage.size.height)
			}
		}
	}
}