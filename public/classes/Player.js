'use strict';
class Player extends Unit {
    constructor(game, params) {
        super(game, params);
    }
    
	render() {
		this.game.screen.beginPath();
		this.game.screen.arc(this.view.x + this.view.width/2 - this.game.camera.x, this.view.y + this.view.height/2 - this.game.camera.y, (this.view.width + this.view.height) / 6, 0 ,2*Math.PI);
		this.game.screen.fillStyle="rgba(0,0,0,0.2)";
		this.game.screen.fill();
		this.game.sprite.draw(this, this.lookAngel);

		this.healthBar();
	}
}