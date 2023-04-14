// import { Bonus } from "./Bonus";
import { Game } from "./Game";
import { SpriteAnimation, SpriteAnimationState } from "./Sprite";
import { Health, ViewPosition, Attack, Vector, getUniqId } from "./utils/index";
import * as SAT from 'sat';

export interface BasisParams {
    id?: string;
    view: Partial<ViewPosition>
}

export interface BasisCollision {
    collided: boolean,
    response: SAT.Response,
    body: Basis 
}

export class Basis {
    id: string;
    view: ViewPosition;
    direction: Vector;
    look: Vector;
    lookAngle: number;
    speed: number;
    velocity: number;
    gravity: number;
    health: Health;
    animation: SpriteAnimation;
    collider: any;
    attack: Attack;

    willDie: boolean;
    willAttack: boolean;
    rotationSpeed: number;
    density: number;
    contacts: Basis[];
    index: number;

    constructor(
        public readonly game: Game,
        params: BasisParams
    ) {
        this.id = params.id || getUniqId(5);
        this.index = 1;
        this.view = new ViewPosition(params.view);
        this.collider = null;
        this.direction = new Vector(0, 0);
        this.look = new Vector(0, 0);
        this.lookAngle = 90;
        this.speed = 0;
        this.velocity = 0;
        this.gravity = 0.5;
        this.animation = new SpriteAnimation({
            name: null,
            state: SpriteAnimationState.stand,
            keyframe: 0,
            rate: 5,
            end: false
        });
        this.health = {
            max: 100,
            current: 100
        };

        this.attack = {
            damageMin: 1,
            damageMax: 2,
            range: 0
        };

        this.willDie = false;
        this.willAttack = false;
        this.rotationSpeed = 0.05;
        this.density = 0;
		this.contacts = [];
    }

    get stage() {
        return this.game.stage;
    }
    get screen() {
        return this.game.screen;
    }

    render() {
        this.game.screen.beginPath();
        this.game.screen.rect(this.view.x - this.game.camera.x, this.view.y - this.game.camera.y, this.view.width, this.view.height);
        this.game.screen.stroke();
    }
    renderDebug() {
        this.game.screen.beginPath();
        this.game.screen.strokeStyle = 'green';
        this.game.screen.rect(this.view.x - this.game.camera.x, this.view.y - this.game.camera.y, this.view.width, this.view.height);
        this.game.screen.stroke();

        if (this.collider) {
            this.game.screen.beginPath();
            this.game.screen.strokeStyle = 'purple';
            this.game.screen.arc(this.collider.pos.x - this.game.camera.x, this.collider.pos.y - this.game.camera.y, this.collider.r, 0, 2 * Math.PI);
            this.game.screen.stroke();
        }


        // this.game.screen.beginPath();
        // this.game.screen.moveTo(this.game.player.view.x + this.game.camera.x, this.game.player.view.y + this.game.camera.x);
        // this.game.screen.moveTo(this.game.mouse.x + this.game.camera.x, this.game.mouse.y + this.game.camera.y);
        // this.game.screen.strokeStyle = 'red';
        // this.game.screen.stroke();
    }

    healthBar() {
        var healthBar = {
            x: this.view.x - this.game.camera.x,
            y: this.view.y - this.game.camera.y - 5,
            height: 3,
            width: this.view.width * (this.health.current / this.health.max)
        };
        this.game.screen.beginPath();
        this.game.screen.fillStyle = 'red';
        this.game.screen.strokeStyle = 'red';
        this.game.screen.rect(healthBar.x, healthBar.y, this.view.width, healthBar.height);
        this.game.screen.fillRect(healthBar.x, healthBar.y, healthBar.width, healthBar.height);
        this.game.screen.stroke();
    }
    
    update() {
        //Void
    }

    onEnter(body: Basis) {
        //Void
    }
    onLeave(body: Basis) {
        //Void
    }    
    onDie() {
        //Void
    }
	
	createCollider() {
		let colliderX = this.collider && this.collider.x || this.view.x + this.view.width / 2;
		let colliderY = this.collider && this.collider.y || this.view.y + this.view.height / 2;
		let colliderRadius = this.collider && this.collider.r || this.view.width / 2;

		this.collider = new SAT.Circle(new SAT.Vector(colliderX, colliderY), colliderRadius);
	}

    colliding(b1, b2) {
        var dx = b1.x - b2.x;
        var dy = b1.y - b2.y;
        var distance = Math.sqrt(dx * dx + dy * dy);

        return (distance < b1.r + b2.r);
    }

    collidingView(view: ViewPosition): boolean {
        view.width = view.width || 0;
        view.height = view.height || 0;
        return !(this.view.x + this.view.width < view.x ||
            this.view.y + this.view.height < view.y ||
            this.view.x > view.x + view.width ||
            this.view.y > view.y + view.height);
    }

    collidingBody(body) {
        return (this != body && this.colliding({ x: this.view.x, y: this.view.y, r: this.view.width / 2 }, { x: body.view.x, y: body.view.y, r: body.view.width / 2 }));
    }

    isOuterCamera() {
        return !this.collidingView(this.view);
    }

    changeAnimation(state: SpriteAnimationState) {
        if (this.animation.state != state) {
            this.animation.state = state;
            this.animation.keyframe = 0;
            this.animation.end = false;
        }
    }
    kill() {
		this.willDie = true;
		this.health.current = 0;
        this.changeAnimation(SpriteAnimationState.die);
    }

    hit(damage) {
        this.health.current -= damage;
        if (this.health.current <= 0) {
            this.health.current = 0;
        }
    }

    heal(value) {
        this.health.current += value;
        if (this.health.current > this.health.max) {
            this.health.current = this.health.max;
        }
    }

    canAttack(body) {
        return (this != body && this.colliding({
            x: this.view.x,
            y: this.view.y,
            r: this.view.width / 2
        }, {
            x: body.view.x,
            y: body.view.y,
            r: this.attack.range + this.view.width / 2
        }));
    }

    stepMove(x, y) {
        this.view.x += x;
        this.view.y += y;
        if (this.collider) {
            this.collider.pos.x += x;
            this.collider.pos.y += y;
        }
    }

    teleport(x, y) {
        this.view.x = x;
        this.view.y = y;
        if (this.collider) {
            this.collider.pos.x = x + this.view.width / 2;
            this.collider.pos.y = y + this.view.width / 2;
        }
    }

    faceBarrier() {
        let response = new SAT.Response();

        for (let i = 0, barrier; i < this.game.stage.levelSolid.length; i++) {
            response.clear();
            barrier = this.game.stage.levelSolid[i];
            if (barrier instanceof SAT.Box) {
                barrier = barrier.toPolygon();
            }
            let collided = SAT.testCirclePolygon(this.collider, barrier, response);
            if (collided && response.overlap) {
                return { collided, response, barrier };
            }
        }
    }

    faceBodies(): BasisCollision[] {
        let response = new SAT.Response();
        let collisions: BasisCollision[] = [];

        for (let i = 0, body; i < this.game.bodies.length; i++) {
            body = this.game.bodies[i];
            if (this != body && body.collider) {
                response.clear();
                let collided = SAT.testCircleCircle(this.collider, body.collider, response);
                if (collided && response.overlap) {
                    // console.log(`this collided with body ${body.constructor.name}`);
                    collisions.push({ collided, response, body });
                }
            }
        }
        return collisions;
    }

    fixStuck() {
        let collision = this.faceBarrier();
        if (collision) {
            collision.response.overlapV.reverse();
            this.stepMove(collision.response.overlapV.x, collision.response.overlapV.y);
        }
    }

    faceContacts() {
        const enterContacts = this.faceBodies();

        for (const contact of enterContacts) {
            if(!contact.body.willDie) {
                contact.body.onEnter(this);
            }
        }

        let leaveContacts = this.contacts.filter(c => !enterContacts.some(e => e.body == c));

        for (const contact of leaveContacts) {
            contact.onLeave(this);
        }

        this.contacts = enterContacts.map(c => c.body);
    }

}