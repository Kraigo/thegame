class BonusFireRate extends Bonus {
    constructor(game, params) {
        super(game, params);
        this.title = 'Firerate';
        this.time = 2000;
        this.effect = {
            shooting: {
                rate: 3
            }
        }
        this.animation.name = 'bonusFire';
    }
    
    render() {
        this.game.sprite.draw(this, this.lookAngel);
    }
}