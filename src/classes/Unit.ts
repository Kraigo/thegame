import { Basis, BasisParams } from "./Basis";
import { Bonus } from "./Bonus";
import { Bullet } from "./Bullet";
import { Game } from "./Game";
import { SpriteAnimationName, SpriteAnimationState } from "./Sprite";
import { getRandomInt } from "./utils/index";
import { Shooting } from "./utils/shootings";

export interface UnitParams extends BasisParams {

}

export class Unit extends Basis {
    id: any;
    shooting: Shooting;
    bonuses: Bonus[];

	constructor(game: Game, params: UnitParams = {}) {
		super(game, params);
		this.id = null;
		this.speed = 3;
		this.index = 1;
		this.health.current = 90;
        this.bonuses = [];

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
		this.animation.name = SpriteAnimationName.player;
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
		this.faceContacts();
	}
	move() {
		if (this.direction.x || this.direction.y) {
			this.stepMove(this.direction.x * this.speed, this.direction.y * this.speed);	
			this.changeAnimation(SpriteAnimationState.walk);
		} else {
			this.changeAnimation(SpriteAnimationState.stand);
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

			let bulletParams = {
				x: this.view.x + this.view.width/2,
				y: this.view.y + this.view.height/2,
				direction: this.directionTo({
					x: this.game.mouse.x + this.game.camera.x,
					y: this.game.mouse.y + this.game.camera.y,
					width: 0,
					height: 0
				}),
				damage: getRandomInt(this.attack.damageMin, this.attack.damageMax),
				owner: this.game.player
			}
			var bullet = new Bullet(this.game, bulletParams);

			this.game.addBody(bullet);

		}

	}

    removeBonus(bonus) {
        bonus.make(this, bonus.effect, true);

        this.bonuses.splice(this.bonuses.indexOf(bonus), 1);
    }
    addBonus(bonus) {
        // if (bonus instanceof Bonus) {

		// 	bonus.make(this, bonus.effect);

		// 	if (!bonus.permanent) {
		// 		this.bonuses.push(bonus);

		// 		if (bonus.time) {
		// 			setTimeout(() => {
		// 				this.removeBonus(bonus);
		// 			}, bonus.time)
		// 		}
		// 	}
        // }
    }

}