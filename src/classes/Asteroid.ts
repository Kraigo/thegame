import { Game } from "./Game";
import { SpriteAnimationName } from "./Sprite";
import { Unit, UnitParams } from "./Unit";

export interface AsteroidParams extends UnitParams {
    target?: Unit;
}

export class Asteroid extends Unit {
    target?: Unit;

    path: any[];

	constructor(game: Game, params: AsteroidParams) {
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
		this.view.width = 48;
		this.view.height = 48;

		this.speed = Math.random() * 2;
		this.speed = 2;
		this.animation.name = SpriteAnimationName.monster;
		this.target = params.target || null;
		this.density = 0.03;
		this.path = [];
		this.createCollider();
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

		

		this.faceContacts();

		let collisions = this.faceBodies();

		if (collisions.length) {
			for (var i = 0, collision; i < collisions.length; i++) {
				collision = collisions[i];
				if (collision.body instanceof Unit) {					
					this.stepMove(-collision.response.overlapV.x * 0.3, -collision.response.overlapV.y * 0.3);
				}
			}
		}


		if (this.willAttack || this.canAttack(this.target)) {
			this.willAttack = true;
			this.changeAnimation('attack');

			if (this.animation.end) {
				this.willAttack = false;

				if (this.canAttack(this.target)) {
					console.log('hit you');
					this.target.hit(this.getRandomInt(this.attack.damageMin, this.attack.damageMax));
				}

				this.changeAnimation('stand');
			}
		}			
		else if (this.target) {
				this.path = this.game.stage.path(this, this.target);
				if (this.path.length) {
					for (var i = 0, pointView; i < this.path.length; i ++) {
						pointView = this.path[i];

						if (!this.collidingView(pointView)) {
							this.direction = this.directionTo(pointView);
							this.move();
							this.routeTo(pointView);
							this.changeAnimation('walk');
							break;

						}

					}

				} 
			} else {
				this.path = [];
				this.changeAnimation('stand');
			}


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
			// view: {
			// 	x: this.target.view.x,
			// 	y: this.target.view.y
			// },
			// view: {
			// 	width: this.view.width,
			// 	height: this.view.height
			// },

			view: {
				x: this.target.view.x,
				y: this.target.view.y,
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
			this.game.screen.strokeStyle = 'yellow';
			this.game.screen.beginPath();
			for(var i = 0; i < this.path.length; i++) {
				let x = this.path[i].x - this.game.camera.x;
				let y = this.path[i].y - this.game.camera.y;

				if (i === 0) {
					this.game.screen.moveTo(x, y);
				} else{							
					this.game.screen.lineTo(x, y);
				}
			}
			
			this.screen.stroke();
		}
	}
}