'use strict';
class Teleport extends Basis {
    constructor(game, params) {
        params = params || {};
        super(game, params);
        this.pairId = params.pairId || Math.random();
        this.active = true;
        this.animation.name = 'teleport';
        this.view.width = 52;
        this.view.height = 52;
        this.collider = {
            r: 5
        }
        this.createCollider();
    }

    render() {
        this.game.sprite.draw(this, this.lookAngel);
    }
    onEnter(body, response) {
        if (body instanceof Unit) {
            if (this.active) {
                let pairTeleport = this.game.bodies.find(b => b instanceof Teleport && b !== this && b.pairId === this.pairId);
                pairTeleport.active = false;
                body.teleport(pairTeleport.view.x, pairTeleport.view.y);
            }
        }
    }

    onLeave(body) {
        this.active = true;
    }
}