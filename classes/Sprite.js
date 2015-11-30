'use strict';
class Sprite {
	constructor(game) {
		this.game = game;
		this.dir = 'sprites/sprite.png';
		this.size = {
			width: 48,
			height: 48
		}
		this.collection = {
			player: {
				stand: [{x:0, y: 0}],
				walk: [{x:0, y: 0}, {x:48, y:0}, {x:96, y:0}, {x:144, y:0}, {x:0, y: 48}, {x:48, y:48}, {x:96, y:48}, {x:144, y:48}]
			},
			monster: {
				stand: [{x:0, y: 144}],
				walk: [{x:0, y: 144}, {x:48, y:144}, {x:96, y:144}, {x:144, y:144},{x:0, y: 192}, {x:48, y:192}, {x:96, y:192}, {x:144, y:192}],
				bite: [{x: 0, y:240}, {x: 48, y:240}, {x: 96, y:240}],
				die: [{x: 0, y: 336}, {x: 0, y: 336}, {x: 48, y: 336}, {x: 48, y: 336}]
			},
			bullet: {
				stand: [{x:0, y: 96, w: 24, h:24}],
				die: [{x:0, y: 120, w: 24, h:24},{x:24, y: 120, w: 24, h:24}]
			}
		};

		this.image = new Image();
		this.image.src = this.dir;
	}

	draw(body, angle) {
		var x = body.position.x + body.size.width/2 - this.game.camera.x;
		var y = body.position.y + body.size.height/2 - this.game.camera.y;
		angle = angle - 90 % 360 || 0;

		var frame = this.getFrame(body.animation);

		this.game.screen.save();
		this.game.screen.translate(x, y);
		this.game.screen.rotate(angle*Math.PI/180);

		this.game.screen.drawImage(
			this.image,
			frame.x,
			frame.y,
			frame.w || this.size.width,
			frame.h || this.size.height,
			-this.size.width/2,
			-this.size.width/2,
			body.size.width,
			body.size.height
		);
		this.game.screen.translate(-x, -y);
		this.game.screen.rotate(-angle*Math.PI/180);
		this.game.screen.restore();
	}

	getFrame(animation) {
		var pack = this.collection[animation.name][animation.state];
		if (this.game.timer % animation.rate == 0) {
			if (pack.length - 1 > animation.keyframe) {
				animation.keyframe += 1;
			} else {
				animation.keyframe = 0;
				animation.end = true;
			}
		}
		return pack[animation.keyframe];
	}
}