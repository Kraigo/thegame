import { Basis, BasisParams } from "./Basis";
import { Player } from "./Player";
import { Unit } from "./Unit";
export interface BonusParams extends BasisParams {
    bonus?: any;

}
export class Bonus extends Basis {
    bonus: any;
    time: number;
    effect: any;
    permanent: boolean;
    title: string

    constructor(game, params: BonusParams) {
        super(game, {
            ...params,
            view: {
                ...params.view,
                width: 24,
                height: 24,
            },
        });
        this.bonus = params.bonus;
        this.time = 1000;
        this.title = 'bonus';
        this.effect = null
        this.permanent = false;
        this.createCollider();
    }

    make(body: Basis, effect: any, remove: boolean = false) {
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

    canApply(body) {
        return true;
    }

    applyEffect(body) {
        // ...
    }

    onEnter(body: Unit) {
        if (body instanceof Player) {
            if (!body.bonuses.some(b => b.constructor.name === this.constructor.name) && this.canApply(body)) {
                this.applyEffect(body);
                this.game.removeBody(this);
            }
        }
    }
}