class BonusSpeedUp extends Bonus {
    constructor(game, params) {
        super(game, params);
        this.title = 'SpeedUp';
        this.time = 5000;
        this.effect = {
            speed: 2
        }
    }
}