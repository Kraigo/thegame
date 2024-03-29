import { Asteroid } from "./Asteroid";
import { Basis } from "./Basis";
import { Builder } from "./Builder";
import { Camera } from "./Camera";
import { Keyboard, KeyboardKey } from "./Keyboard";
import { Mouse } from "./Mouse";
import { Player } from "./Player";
import { PlayerControl } from "./PlayerControl";
import { Sprite } from "./Sprite";
import { Stage } from "./Stage";
import { Size } from "./utils/index";

export class Game {
    editMode: boolean;
    debug: boolean;

    canvas: HTMLCanvasElement;
    screen: CanvasRenderingContext2D;
    camera: Camera;

    bodies: Basis[];
    world: Size;
    player: Player;
    playerControl: PlayerControl;
    stage: Stage;
    
    keyboard: Keyboard;
    mouse: Mouse;
    sprite: Sprite;
    lastTick: Date;
    timer: number;
    builder?: Builder;

    constructor() {
        var game = this;
        this.editMode = false;
        this.canvas = document.createElement('canvas');
        document.body.appendChild(this.canvas);

        this.canvas.width = document.body.offsetWidth - 10;
        this.canvas.height = document.body.offsetHeight - 10;

        this.bodies = [];
        this.debug = true;

        this.screen = this.canvas.getContext('2d');
        this.screen.imageSmoothingEnabled = false;
        this.camera = new Camera(game);
        this.world = {
            width: 150 * 24,
            height: 150 * 24
        };
        this.player = new Player(game, {
            view: { x: 300, y: 300, width: 48, height: 48 }
        });
        this.playerControl = new PlayerControl(game);
        // this.socket = new Socket(game);
        // Create GAME EVENTS to catch and sync with server
        this.keyboard = new Keyboard();
        this.mouse = new Mouse(game.canvas);
        this.sprite = new Sprite(game);
        this.stage = new Stage(game);
        this.lastTick = new Date();
        this.timer = 0;

        this.camera.setTarget(this.player);
        this.addBody(this.player);
        this.modeToggler();

        for (var i = 0; i < 0; i++) {
            game.addBody(new Asteroid(this, { target: game.player, view: { width: 48, height: 48, x: 450, y: 500 } }));
        }
    }

    async init() {
        const game = this;
        await this.stage.loadLevel('1');


        const tick = function () {
            game.update();
            game.render();
            requestAnimationFrame(tick);
        };
        tick();
    }

    render() {
        this.screen.clearRect(0, 0, this.camera.width, this.camera.height);

        var now = new Date();
        var fps = Math.round(1000 / (now.getTime() - this.lastTick.getTime()));
        this.lastTick = now;

        this.stage.render();

        this.drawDebug([
            'FPS: ' + fps,
            'Obj count: ' + this.bodies.length,
            'Stage count: ' + this.stage.level.length,
            'Camera (x: ' + this.camera.x.toFixed() + ', y: ' + this.camera.y.toFixed() + ')',
            'Player (x: ' + this.player.view.x.toFixed() + ', y: ' + this.player.view.y.toFixed() + ')',
            'Player dir(x: ' + this.player.direction.x + ', y: ' + this.player.direction.y + ')',
            'Bonuses [' + this.player.bonuses.map(b => b.title).join(', ') + ']'
        ]);
        this.drawUI();

        this.screen.rect(0 - this.camera.x, 0 - this.camera.y, this.world.width, this.world.height);
        this.screen.stroke();

        for (let body of this.bodies) {
            if (this.camera.isCameraShow(body)) {
                body.render();
            }
            if (this.debug) {
                body.renderDebug();
            }
        }
    }

    update() {
        this.timer++;

        this.camera.update();
        this.playerControl.update();

        for (let body of this.bodies) {
            if ((body.willDie || body.health.current === 0) && body.animation.end) {
                body.onDie();
                this.removeBody(body)
            }
            else if (!body.willDie) {
                body.update();
            }
            else {
                body.speed = 0;
                body.direction.x = 0;
                body.direction.y = 0;
            }
        }
    }

    addBody(body) {
        this.bodies.push(body);
        this.bodies.sort((a, b) => a.index - b.index);
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
        this.screen.fillStyle = "orange";
        for (var i = 0; i < msg.length; i++) {
            this.screen.fillText(msg[i], 10, (i + 1) * 18);
        }
    }

    drawUI() {
        this.screen.fillStyle = "black";
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

        this.keyboard.onInput(KeyboardKey.F2, () => {
            game.builder = new Builder(game);
            game.camera.target = game.builder;
            game.camera.stretch = 0;
            for (let body of this.bodies) {
                body.kill();
                body.onDie();
            }
            game.bodies = [];
            game.addBody(game.builder);

        })
    }
}