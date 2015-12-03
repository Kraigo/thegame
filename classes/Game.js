'use strict';
class Game {
	constructor() {
		var game = this;
		this.editMode = false;
		this.canvas = document.createElement('canvas');		
		document.body.appendChild(this.canvas);

		this.canvas.width = document.body.offsetWidth-10;
		this.canvas.height = document.body.offsetHeight-10;

		this.screen = this.canvas.getContext('2d');
		this.camera = {
			x: 0,
			y: 0,
			width: this.canvas.width,
			height: this.canvas.height,
			target: null
		};
		this.world = {
			width: 1200,
			height: 1200
		};
		this.player = new Player(game);
		this.builder = new Builder(game);
		this.keyboard = new Keyboard();
		this.point = new Point(game.canvas);
		this.sprite = new Sprite(game);
		this.stage = new Stage(game);
		this.lastTick = new Date();
		this.timer = 0;

		this.camera.target = this.player;
		this.bodies = [];
		this.addBody(this.player);

		for (var i = 0; i < 5; i++) {
			this.addBody(new Asteroid(game, {target: this.player, width: 48, height: 48}));
		}

		var tick = function() {
			game.update();
			game.render();
			requestAnimationFrame(tick);
		};
		tick();
		this.modeToggler();
	}

	render() {
		this.screen.clearRect(0,0, this.camera.width, this.camera.height);
		var now = new Date();
        var fps = Math.round(1000/(now - this.lastTick));
        this.lastTick = now;

		this.stage.render();

		this.debug([
			'FPS: '+ fps,
			'Obj count: '+this.bodies.length,
				'Stage count: '+this.stage.level.length
			//'Camera (x: '+this.camera.x+', y: '+this.camera.y+')',
			//'Player (x: '+this.player.position.x+', y: '+this.player.position.y+')'
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

		this.camera.x = this.camera.target.position.x - this.camera.width/2 + this.camera.target.size.width/2;
		this.camera.y = this.camera.target.position.y - this.camera.height/2 + this.camera.target.size.height/2;

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
	collidingBody(b1,b2) {
		return (b1 != b2 && this.colliding(
					{x: b1.position.x, y: b1.position.y, r: b1.size.width/2},
					{x: b2.position.x, y: b2.position.y, r: b2.size.width/2})
				);
	}
	colliding(b1,b2) {
		var dx = b1.x - b2.x;
		var dy = b1.y - b2.y;
		var distance = Math.sqrt(dx * dx + dy * dy);

		return (distance < b1.r + b2.r);

		return !(b1 == b2 ||
			b1.position.x + b1.size.width < b2.position.x ||
			b1.position.y + b1.size.height < b2.position.y ||
			b1.position.x > b2.position.x + b2.size.width ||
			b1.position.y > b2.position.y + b2.size.height);
	}

	addBody(body) {
		this.bodies.push(body);
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
		this.screen.fillStyle="#000";
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
	modeToggler() {
		var game = this;
		document.addEventListener('keydown', function(e) {
			if (e.keyCode == 113) {
				game.camera.target = game.builder;
				game.bodies = [];
				game.addBody(game.builder);

			}
		})
	}
}