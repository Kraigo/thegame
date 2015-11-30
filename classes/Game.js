'use strict';
class Game {
	constructor() {
		var game = this;
		this.canvas = document.createElement('canvas');		
		document.body.appendChild(this.canvas);

		this.canvas.width = document.body.offsetWidth-10;
		this.canvas.height = document.body.offsetHeight-10;

		this.screen = this.canvas.getContext('2d');
		this.camera = {
			x: 0,
			y: 0,
			width: this.canvas.width,
			height: this.canvas.height
		};
		this.world = {
			width: 1200,
			height: 1200
		};
		this.player = new Player(game);
		this.keyboard = new Keyboard();
		this.point = new Point(game.canvas);
		this.sprite = new Sprite(game);
		this.lastTick = new Date();
		this.timer = 0;

		this.bodies = [];
		this.addBody(this.player);

		for (var i = 0; i < 20; i++) {
			this.addBody(new Asteroid(game, {}));
		}

		var tick = function() {
			game.update();
			game.render();
			requestAnimationFrame(tick);
		};
		tick();
	}

	render() {
		this.screen.clearRect(0,0, this.camera.width, this.camera.height);
		var now = new Date();
        var fps = Math.round(1000/(now - this.lastTick));
        this.lastTick = now;

		this.debug([
			'FPS: '+ fps,
			'Obj count: '+this.bodies.length,
			'Camera (x: '+this.camera.x+', y: '+this.camera.y+')',
			'Player (x: '+this.player.position.x+', y: '+this.player.position.y+')'
			]);
		this.screen.rect(0-this.camera.x,0-this.camera.y, this.world.width, this.world.height);
		this.screen.stroke();

		for (var i = 0, body; i < this.bodies.length; i++ ) {
			body = this.bodies[i];
			if (this.isCameraShow(this.bodies[i])) {
				body.render();
			}
		}
	}

	update() {
		var self = this;

		this.timer ++;

		this.camera.x = this.player.position.x - this.camera.width/2 + this.player.size.width/2;
		this.camera.y = this.player.position.y - this.camera.height/2 + this.player.size.height/2;

		this.camera.x += (this.point.x - this.camera.width/2)*0.2;
		this.camera.y += (this.point.y - this.camera.height/2)*0.2;

		for (var i = 0, body; i < this.bodies.length; i++ ) {
			body = this.bodies[i];
			if (body.willDie && body.animation.end) {
				this.removeBody(body);
				i--;
				continue;
			}
			body.update();
		}
	}

	colliding(b1,b2) {
		return !(b1 == b2 ||
			b1.position.x + b1.size.width < b2.position.x ||
			b1.position.y + b1.size.height < b2.position.y ||
			b1.position.x > b2.position.x + b2.size.width ||
			b1.position.y > b2.position.y + b2.size.height);
	}

	addBody(body) {
		this.bodies.push(body);
	}

	killBody(body) {
		body.changeAnimation('die');
		body.speed = 0;
		body.animation.rate = 15;
		body.willDie = true;

		console.log(body.animation);
	}

	removeBody(items) {
		if (!Array.isArray(items)) {
			items = [items];
		}

		for (var i = 0; i < items.length; i++) {
			for (var b = 0; b < this.bodies.length; b++) {
				if (items[i] == this.bodies[b]) {
					this.bodies.splice(b, 1);
					b--;
				}
			}
		}

	}
	debug(msg) {
		for(var i = 0; i<msg.length; i++) {
			this.screen.fillText(msg[i],10, (i+1)*18);
		}

		this.screen.fillText('W', 40, this.camera.height - 40);
		this.screen.fillText('S', 40, this.camera.height - 20);
		this.screen.fillText('A', 20, this.camera.height - 20);
		this.screen.fillText('D', 60, this.camera.height - 20);

		this.screen.beginPath();
		this.screen.moveTo(35, this.camera.height - 55);		
		this.screen.lineTo(55, this.camera.height - 55);
		this.screen.lineTo(55, this.camera.height - 35);
		this.screen.lineTo(75, this.camera.height - 35);
		this.screen.lineTo(75, this.camera.height - 15);
		this.screen.lineTo(15, this.camera.height - 15);
		this.screen.lineTo(15, this.camera.height - 35);
		this.screen.lineTo(35, this.camera.height - 35);
		this.screen.lineTo(35, this.camera.height - 55);
		this.screen.stroke();
	}
	isCameraShow(body) {
		return !(body.position.x + body.size.width < this.camera.x &&
				body.position.x > this.camera.width &&
				body.position.y + body.size.height < this.camera.y &&
				body.position.y > this.camera.width)
	}
}