'use strict';
class Bonus extends Basis {
    constructor(game, params) {
        params = params || {};
        super(game, params);
        this.bonus = params.bonus;
        this.time = 1000;
    }

    onEnter(body) {
        body.addBonus(this);
        this.game.removeBody(this);
    } 
}