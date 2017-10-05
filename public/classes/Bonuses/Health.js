class BonusHealth extends Bonus {
    constructor(game, params) {
        super(game, params);
        this.title = 'Health';
        this.permanent = true;
        this.effect = {
            health: {
                current: 20
            }
        }
        this.animation.name = 'bonusHealth';
    }
    
    render() {
        this.game.sprite.draw(this, this.lookAngel);
    }

    canApply(body) {
        return body.health.current < body.health.max;
    }
}