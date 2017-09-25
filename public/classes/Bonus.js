'use strict';
class Bonus extends Basis {
    constructor(game, params) {
        params = params || {};
        super(game, params);
        this.bonus = params.bonus;
        this.time = 1000;
    }

    canApply() {
        return true;
    }

    onEnter(body) {
        if (body instanceof Player) {
            if (!body.bonuses.some(b => b.constructor.name === this.constructor.name) && this.canApply(body)) {
                body.addBonus(this);
                this.game.removeBody(this);
            }
        }
    } 
}