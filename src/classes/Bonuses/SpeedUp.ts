import { Bonus } from "../Bonus";
import { SpriteAnimationName } from "../Sprite";

export class BonusSpeedUp extends Bonus {
    constructor(game, params) {
        super(game, params);
        this.title = 'SpeedUp';
        this.time = 5000;
        this.effect = {
            speed: 2
        }
        this.animation.name = SpriteAnimationName.bonusSpeed;
    }
    
    render() {
        this.game.sprite.draw(this, this.lookAngle);
    }

    applyEffect(body) {
        body.addBonus(this);
    }
}