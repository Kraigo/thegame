'use strict';
class Game {
	constructor() {
		var game = this;
		this.editMode = false;
		this.canvas = document.createElement('canvas');		
		document.body.appendChild(this.canvas);

		this.canvas.width = document.body.offsetWidth-10;
		this.canvas.height = document.body.offsetHeight-10;
		
		this.bodies = [];
		this.debug = true;

		this.screen = this.canvas.getContext('2d');
		this.screen.imageSmoothingEnabled = false;
		this.camera = new Camera(game);
		this.world = {
			width: 792,
			height: 792
		};
		this.player = new Player(game, {view: {x: 300, y: 300, width: 48, height: 48}});
		this.playerControl = new PlayerControl(game);
		// this.socket = new Socket(game);
		// Create GAME EVENTS to catch and sync with server
		this.builder = null;
		this.keyboard = new Keyboard();
		this.mouse = new Mouse(game.canvas);
		this.sprite = new Sprite(game);
		this.stage = new Stage(game);
		this.lastTick = new Date();
		this.timer = 0;

		this.camera.setTarget(this.player);
		this.addBody(this.player);

		for (var i = 0; i < 0; i++) {
			game.addBody(new Asteroid(game, {target: game.player, width: 48, height: 48}));
		}

		// setInterval(function() {
		// 	var x, y;
		// 	if (game.camera.x < 0) {
		// 		x = game.camera.width / 2;
		// 	} else if (game.camera.x > 48) {
		// 		x = game.camera.width / 2 + game.camera.x - 48;
		// 	}

		// 	if (game.camera.y < 0) {
		// 		y = game.camera.height;
		// 	} else if (game.camera.y > 48) {
		// 		y = game.camera.y - 48;
		// 	}
		// 	game.addBody(new Asteroid(game, {target: game.player, width: 48, height: 48, x: x, y: y}));
		// }, 1000);


		var tick = function() {
			game.update();
			game.render();
			requestAnimationFrame(tick);
		};
		tick();
		this.modeToggler();
	}

	static Teleport() {
		
	}

	render() {
		this.screen.clearRect(0,0, this.camera.width, this.camera.height);

		var now = new Date();
        var fps = Math.round(1000/(now - this.lastTick));
        this.lastTick = now;

		this.stage.render();

		this.drawDebug([
			'FPS: '+ fps,
			'Obj count: '+this.bodies.length,
			'Stage count: '+this.stage.level.length,
			'Camera (x: '+this.camera.x.toFixed()+', y: '+this.camera.y.toFixed()+')',
			'Player (x: '+this.player.view.x.toFixed()+', y: '+this.player.view.y.toFixed()+')',
			'Player dir(x: ' + this.player.direction.x + ', y: ' + this.player.direction.y +')',
			'Bonuses [' + this.player.bonuses.map(b => b.title).join(', ') + ']'
		]);
		this.drawUI();

		this.screen.rect(0-this.camera.x,0-this.camera.y, this.world.width, this.world.height);
		this.screen.stroke();

		for (var i = 0, body; i < this.bodies.length; i++ ) {
			body = this.bodies[i];
			if (this.camera.isCameraShow(body)) {
				body.render();
			}
			if (this.debug) {
				body.renderDebug();
			}
		}
	}

	update() {
		var self = this;

		this.timer ++;

		this.camera.update();
		this.playerControl.update();

		for (var i = 0, body; i < this.bodies.length; i++ ) {
			body = this.bodies[i];
			if ((body.willDie || body.health.current === 0) && body.animation.end ) {
				this.removeBody(body);
				i--;
				continue;
			}

			body.update();
		}
	}

	addBody(body) {
		this.bodies.push(body);
		this.bodies.sort(b => b.index);
	}

	removeBody(body) {
		//@items
		// if (!Array.isArray(items)) {
		// 	items = [items];
		// }

		// for (var i = 0; i < items.length; i++) {
		// 	for (var b = 0; b < this.bodies.length; b++) {
		// 		if (items[i] == this.bodies[b]) {
		// 			this.bodies.splice(b, 1);
		// 			b--;
		// 		}
		// 	}
		// }
		this.bodies.splice(this.bodies.indexOf(body), 1);
	}

	drawDebug(msg) {
		this.screen.fillStyle="orange";
		for(var i = 0; i<msg.length; i++) {
			this.screen.fillText(msg[i],10, (i+1)*18);
		}
	}

	drawUI() {
		this.screen.fillStyle="black";
		this.screen.strokeStyle = 'black';
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
	
	modeToggler() {
		var game = this;
		document.addEventListener('keydown', function(e) {
			if (e.keyCode == 113) {
				game.builder = new Builder(game);
				game.camera.target = game.builder;
				game.camera.stretch = 0;
				game.bodies = [];
				game.addBody(game.builder);
			}
		})
	}

	evalBody(data) {		
		let model = eval(data.model);
		this.addBody(new model(this, data));
	}
}