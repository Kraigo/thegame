'use strict';
class Basis {
    constructor(game, params) {
        params = params || {};
        this.game = game;
        this.view = Object.assign({
            width: 16,
            height: 16,
            x: 0,
            y: 0
        }, params.view);
        this.collider = null;
        this.direction = { x: 0, y: 0 };
        this.look = { x: 0, y: 0 }
        this.lookAngel = 90;
        this.speed = 0;
        this.velocity = 0;
        this.gravity = 0.5;
        this.animation = {
            name: null,
            state: 'stand',
            keyframe: 0,
            rate: 5,
            end: false
        };
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
		this.bonuses = [];		
		this.contacts = [];
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
    }
    healthBar() {
        var healthBar = {
            x: this.view.x - this.game.camera.x,
            y: this.view.y - this.game.camera.y - 5,
            height: 3,
            width: this.view.width * (this.health.current / this.health.max)
        };
        this.game.screen.beginPath();
        this.game.screen.rect(healthBar.x, healthBar.y, this.view.width, healthBar.height);
        this.game.screen.fillStyle = 'red';
        this.game.screen.fillRect(healthBar.x, healthBar.y, healthBar.width, healthBar.height);
        this.game.screen.stroke();
    }
    update() {
        //Void
    }

    onEnter() {
        //Void
    }
    onLeave() {
        //Void
	}
	
	createCollider() {
		let colliderX = this.collider && this.collider.x || this.view.x + this.view.width / 2;
		let colliderY = this.collider && this.collider.y || this.view.y + this.view.height / 2;
		let colliderRadius = this.collider && this.collider.r || this.view.width / 2;

		this.collider = new SAT.Circle(new SAT.Vector(colliderX, colliderY), colliderRadius);
	}
    addBonus(bonus) {
        if (bonus instanceof Bonus && bonus.canApply(this)) {

			bonus.make(this, bonus.effect);

			if (!bonus.permanent) {
				this.bonuses.push(bonus);

				if (bonus.time) {
					setTimeout(() => {
						this.removeBonus(bonus);
					}, bonus.time)
				}
			}
        }
    }

    removeBonus(bonus) {
        bonus.make(this, bonus.effect, true);

        this.bonuses.splice(this.bonuses.indexOf(bonus), 1);
    }


    colliding(b1, b2) {
        var dx = b1.x - b2.x;
        var dy = b1.y - b2.y;
        var distance = Math.sqrt(dx * dx + dy * dy);

        return (distance < b1.r + b2.r);
    }
    collidingSqr(body) {
        return !(this.view.x + this.view.width < body.view.x ||
            this.view.y + this.view.height < body.view.y ||
            this.view.x > body.view.x + body.view.width ||
            this.view.y > body.view.y + body.view.height);
    }
    collidingBody(body) {
        return (this != body && this.colliding({ x: this.view.x, y: this.view.y, r: this.view.width / 2 }, { x: body.view.x, y: body.view.y, r: body.view.width / 2 }));
    }
    isOuterCamera() {
        return !this.collidingSqr(this)
    }
    directionTo(view) {
        // (x1,y2) ==> (x2, y2)
        var vx = (view.x + view.width / 2) - (this.view.x + this.view.width / 2);
        var vy = (view.y + view.height / 2) - (this.view.y + this.view.height / 2);
        var dxy = Math.sqrt(vx * vx + vy * vy);
        return { x: vx / dxy, y: vy / dxy }
    }

    vectorAngle(p1, p2) {
        var angleRadians = Math.atan2(p2.y - p1.y, p2.x - p1.x);
        return Math.atan2(p2.y - p1.y, p2.x - p1.x) * 180 / Math.PI;
    }

    getRandomInt(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    //vectorAngle(vector) {
    //	var angleRad = Math.acos( vector.x / Math.sqrt(vector.x*vector.x + vector.y*vector.y) );
    //	return angleRad * 180 / Math.PI;
    //}

    changeAnimation(animName) {
        if (this.animation.state != animName) {
            this.animation.state = animName;
            this.animation.keyframe = 0;
            this.animation.end = false;
        }
    }
    kill() {
		this.willDie = true;
		this.health.current = 0;
        this.changeAnimation('die');
    }

    hit(damage) {
        this.health.current -= damage;
        if (this.health.current <= 0) {
            this.health.current = 0;
            this.kill();
        }
    }

    isReach(body) {
        return (this != body && this.colliding({ x: this.view.x, y: this.view.y, r: this.view.width / 2 }, { x: body.view.x, y: body.view.y, r: this.attack.range + this.view.width / 2 }));
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

    faceBodies() {
        let response = new SAT.Response();
        let collestion = [];

        for (let i = 0, body; i < this.game.bodies.length; i++) {
            body = this.game.bodies[i];
            if (this != body) {
                response.clear();
                let collided = SAT.testCircleCircle(this.collider, body.collider, response);
                if (collided && response.overlap) {
                    console.log(`this collided with body ${body.constructor.name}`);
                    collestion.push({ collided, response, body });
                }
            }
        }
        return collestion;
    }

    fixStuck() {
        let collision = this.faceBarrier();
        if (collision) {
            collision.response.overlapV.reverse();
            this.stepMove(collision.response.overlapV.x, collision.response.overlapV.y);
        }
    }

    contact() {

        let enterContacts = this.faceBodies();

        for (var i = 0; i < enterContacts.length; i++) {
            enterContacts[i].body.onEnter(this, enterContacts[i].response);
        }

        let leaveContacts = this.contacts.filter(c => !enterContacts.some(e => e.body == c));

        for (var i = 0; i < leaveContacts.length; i++) {
            leaveContacts[i].onLeave(this);
        }

        this.contacts = enterContacts.map(c => c.body);
    }

}