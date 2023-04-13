import { Bonus } from "../Bonus";
import { SpriteAnimationName } from "../Sprite";

export class TripleFire extends Bonus {
    constructor(game, params) {
        super(game, params);
        this.title = 'TripleFire';
        this.time = 2000;
        this.effect = {}
        this.animation.name = SpriteAnimationName.bonusTripleFire;
    }
    
    render() {
        this.game.sprite.draw(this, this.lookAngle);
    }

    applyEffect(body) {
        body.addBonus(this);
    }
}