class BonusSpeedUp extends Bonus {
    constructor(game, params) {
        super(game, params);
        this.title = 'SpeedUp';
        this.time = 5000;
        this.effect = {
            speed: 2
        }
        this.animation.name = 'bonusSpeed';
    }
    
    render() {
        this.game.sprite.draw(this, this.lookAngel);
    }
}