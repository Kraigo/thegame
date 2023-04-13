import { Unit } from "./Unit";

export class Player extends Unit {
    constructor(game, params) {
        super(game, params);
        this.createCollider();
    }

    render() {
        this.drawShadow();
        this.game.sprite.draw(this, this.lookAngle);

        this.healthBar();
    }
}