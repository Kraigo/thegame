import { Basis, BasisParams } from "./Basis";
import { SpriteAnimationName } from "./Sprite";
import { Unit } from "./Unit";
import { Vector, getRandomInt } from "./utils/index";

export interface BulletParams extends BasisParams {
    direction: Vector;
    damage: number;
    owner: Unit;
}

export class Bullet extends Basis {
    owner: Unit;
    timer: number;

    constructor(game, params: BulletParams) {
        const bulletSize = 24;
        super(game, {
            ...params,
            view: {
                width: bulletSize,
                height: bulletSize,
                x: params.view.x - bulletSize / 2,
                y: params.view.y - bulletSize / 2,
                ...params.view,
            },
        });
        this.direction = params.direction;
        this.speed = 5;
        this.animation.name = SpriteAnimationName.bullet;
        this.attack.damageMin = params.damage;
        this.attack.damageMax = params.damage;
        this.owner = params.owner;
        this.timer = this.game.timer;
        this.createCollider();
    }
    update() {
        if (this.isOuterCamera()) {
            this.game.removeBody(this);
        }
        this.faceContacts();


        // for (var i=0, body; i<this.game.bodies.length; i++) {
        // 	body = this.game.bodies[i];

        // 	//if (!this.willDie && !body.willDie && body instanceof Asteroid && this.collidingBody(this, body)) {
        // 	//	this.kill();
        // 	//	this.speed = 0;
        // 	//	body.hit(this.attack.damage);
        // 	//}

        // 	if (!this.willDie && !body.willDie && this.owner !== body && !(body instanceof Bullet) && this.collidingBody(body)) {
        // 		this.kill();
        // 		this.speed = 0;
        // 		body.hit(this.attack.damage);
        // 	}
        // }


        this.stepMove(this.direction.x * this.speed, this.direction.y * this.speed);

        let collided = this.faceBarrier();
        if (collided) {
            // console.log(this.direction);
            // console.log(collided.response.overlapN);
            let reflectVector = collided.response.overlapN;

            if (reflectVector.x != 0) {
                this.direction.x = -this.direction.x;
            }

            if (reflectVector.y != 0) {
                this.direction.y = -this.direction.y;
            }
            // this.direction.x = -reflectVector.x;

            // this.direction.y = -reflectVector.y;
            // let reflectVector = collided.response.overlapV.normalize();
            // this.direction.x = (-reflectVector.x * this.speed);
            // this.direction.y = (-reflectVector.y * this.speed);
            // this.kill();
            // this.speed = 0;
        } else if (this.game.timer > this.timer + 100) {
            this.kill();
            this.speed = 0;
        }
    }
    render() {
        const targetVector = new Vector(
            this.view.x + this.direction.x * this.speed,
            this.view.y + this.direction.y * this.speed
        );
        const angle = this.view.angleTo(targetVector);
        this.game.sprite.draw(this, angle);

        //this.faceBarrier(true);
    }

    onEnter(body) {
        if (body instanceof Unit && body != this.owner) {
            const damage = getRandomInt(this.attack.damageMin, this.attack.damageMax);
            body.hit(damage);
            this.kill();
            this.speed = 0;
        }
    }
}