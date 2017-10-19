'use strict';
class Bonus extends Basis {
    constructor(game, params) {
        params = params || {};
        super(game, params);
        this.bonus = params.bonus;
        this.time = 1000;
        this.view.width = 24;
        this.view.height = 24;
        this.effect = null
        this.permanent = false;
        this.createCollider();
    }
    make(body, effect, remove) {
        if (effect) {
            for (var i in effect) {
                let prop = effect[i];
                switch (typeof prop) {
                    case 'boolean':
                        body[i] = remove ? prop : !prop;
                        break;
                    case 'number':
                        body[i] += remove ? -prop : prop;
                        break;
                    case 'object':
                        this.make(body[i], prop, remove);
                        break;
                }
            }
        }
    }
    canApply() {
        return true;
    }
    applyEffect() {
        // ...
    }

    onEnter(body) {
        if (body instanceof Player) {
            if (!body.bonuses.some(b => b.constructor.name === this.constructor.name) && this.canApply(body)) {
                this.applyEffect(body);
                this.game.removeBody(this);
            }
        }
    } 
}