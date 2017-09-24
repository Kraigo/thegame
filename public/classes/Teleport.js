'use strict';
class Teleport extends Basis {
    constructor(game, params) {
        params = params || {};
        super(game, params);
        this.pairId = params.pairId || Math.random();
        this.active = true;
    }

    render() {
        this.game.screen.beginPath();
        this.game.screen.strokeStyle = 'blue';
		this.game.screen.rect(this.view.x - this.game.camera.x, this.view.y - this.game.camera.y, this.view.width, this.view.height);
		this.game.screen.stroke();
    }
    onEnter(body) {
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