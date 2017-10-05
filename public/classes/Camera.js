'use strict';
class Camera {
    constructor(game) {
        this.game = game;
        this.x = 0;
        this.y = 0;
        this.width = game.canvas.width;
        this.height = game.canvas.height;
        this.target = null;
        this.stretch = 0.2;
    }

    setTarget(target) {
        this.target = target;
    }

    isCameraShow(body) {
		return !(body.view.x + body.view.width < this.x &&
				body.view.x > this.width &&
				body.view.y + body.view.height < this.y &&
				body.view.y > this.width)
	}

    update() {
        this.x = this.target.view.x - this.width/2 + this.target.view.width/2;
		this.y = this.target.view.y - this.height/2 + this.target.view.height/2;

		this.x += (this.game.mouse.x - this.width/2) * this.stretch;
		this.y += (this.game.mouse.y - this.height/2) * this.stretch;
    }
}