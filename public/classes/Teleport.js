'use strict';
class Teleport extends Basis {
    constructor(game, params) {
        params = params || {};
        super(game, params);
        this.pairId = params.pairId || Math.random();
        this.active = true;
        this.animation.name = 'teleport';
    }

    render() {
        this.game.sprite.draw(this, 0);
    }
    onEnter(body, response) {
        if (this.active) {
            let pairTeleport = this.game.bodies.find(b => b instanceof Teleport && b !== this && b.pairId === this.pairId);
            pairTeleport.active = false;
            body.teleport(pairTeleport.view.x, pairTeleport.view.y);
        }
    }

    onLeave(body) {
        this.active = true;
    }
}