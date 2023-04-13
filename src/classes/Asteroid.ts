import { Game } from "./Game";
import { SpriteAnimationName, SpriteAnimationState } from "./Sprite";
import { Unit, UnitParams } from "./Unit";
import { getRandom, getRandomInt } from "./utils/random";
import { Vector } from "./utils/vector";
import { ViewPosition } from "./utils/view-position";

export interface AsteroidParams extends UnitParams {
    target?: Unit;
}

export class Asteroid extends Unit {
    target?: Unit;

    path: ViewPosition[];
    pathInternal = 20;

    constructor(game: Game, params: AsteroidParams) {
        super(game, {
            ...params,
            view: {
                ...params.view,
                width: 48,
                height: 48,
            }
        });
        // this.view = {
        // 	width: params.width,
        // 	height: params.height,
        // 	x: params.x || Math.floor(Math.random()*(this.game.world.width-this.view.width)),
        // 	y: params.y || Math.floor(Math.random()*(this.game.world.height-this.view.height))
        // };

        this.direction = new Vector(Math.random(), Math.random());
        this.attack.range = 5;
        // this.view.width = 48;
        // this.view.height = 48;

        this.speed = Math.random() * 2;
        this.speed = 2;
        this.animation.name = SpriteAnimationName.monster;
        this.target = params.target || null;
        this.density = 0.03;
        this.path = [];
        this.createCollider();
    }

    render() {
        this.drawShadow();
        const angle = this.vectorAngle(
            { x: this.view.x - this.game.camera.x, y: this.view.y - this.game.camera.y },
            { x: this.view.x - this.game.camera.x + this.look.x, y: this.view.y - this.game.camera.y + this.look.y });
        this.game.sprite.draw(this, angle);
        this.healthBar();

        if (this.game.debug) {
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

        if (this.shouldUpdatePath) {
            this.path = this.game.stage.path(this, this.target);
        }

        if (this.willAttack || this.canAttack(this.target)) {
            this.willAttack = true;
            this.changeAnimation(SpriteAnimationState.attack);

            if (this.animation.end) {
                this.willAttack = false;

                if (this.canAttack(this.target)) {
                    console.log('hit you');
                    this.target.hit(getRandomInt(this.attack.damageMin, this.attack.damageMax));
                }

                this.changeAnimation(SpriteAnimationState.stand);
            }
        }
        else if (this.target) {
            for (let pointView of this.path) {
                // if (this.collidingView(pointView)) {
                //     this.path.splice( this.path.indexOf(pointView),1)
                // }
                if (!this.collidingView(pointView)) {
                    this.direction = this.view.directionToVector(pointView);
                    this.move();
                    this.routeTo(pointView);
                    this.changeAnimation(SpriteAnimationState.walk);
                    break;
                }
            }

            // if (this.path.length) {
            //     for (var i = 0, pointView; i < this.path.length; i++) {
            //         pointView = this.path[i];

            //         if (!this.collidingView(pointView)) {
            //             this.direction = this.directionTo(pointView) as any;
            //             this.move();
            //             this.routeTo(pointView);
            //             this.changeAnimation(SpriteAnimationState.walk);
            //             break;

            //         }

            //     }

            // }

        } else {
            this.path = [];
            this.changeAnimation(SpriteAnimationState.stand);
        }
    }

    routeTo(view: Vector): void {
        const direction = this.view.directionToVector(view);
        this.look.x += (direction.x - this.look.x) * this.rotationSpeed;
        this.look.y += (direction.y - this.look.y) * this.rotationSpeed;
    }

    routeToTarget(): void {
        const direction = this.view.directionToView(
            this.target.view
        );

        this.direction.x += (direction.x - this.direction.x) * this.rotationSpeed;
        this.direction.y += (direction.y - this.direction.y) * this.rotationSpeed;
        this.look.x += (direction.x - this.look.x) * this.rotationSpeed;
        this.look.y += (direction.y - this.look.y) * this.rotationSpeed;
    }


    renderPath() {
        if (this.path.length) {
            this.game.screen.strokeStyle = 'yellow';
            this.game.screen.beginPath();
            for (var i = 0; i < this.path.length; i++) {
                const point = this.path[i];
                let x = point.x - this.game.camera.x;
                let y = point.y - this.game.camera.y;

                if (i === 0) {
                    this.game.screen.moveTo(x + point.width / 2, y + point.height / 2);
                } else {
                    this.game.screen.lineTo(x + point.width / 2, y + point.height / 2);
                }
                this.screen.fillStyle = 'rgba(255, 208,33, 0.1)';
                this.screen.fillRect(x, y, point.width, point.height)
            }

            this.screen.stroke();
        }
    }

    get shouldUpdatePath(): boolean {
        return this.target && this.game.timer % this.pathInternal === 0;
    }
}