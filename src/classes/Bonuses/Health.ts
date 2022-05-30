import { Bonus } from "../Bonus";
import { SpriteAnimationName } from "../Sprite";

export class BonusHealth extends Bonus {
    constructor(game, params) {
        super(game, params);
        this.title = 'Health';
        this.permanent = true;
        this.effect = {
            health: 20
        }
        this.animation.name = SpriteAnimationName.bonusHealth;
    }
    
    render() {
        this.game.sprite.draw(this, this.lookAngel);
    }

    canApply(body) {
        return body.health.current < body.health.max;
    }

    applyEffect(body) {
        body.heal(this.effect.health);
    }
}