import { Basis } from "./Basis";
import { KeyboardKey } from "./Keyboard";
import { ViewPosition } from "./utils/view-position";

export class Builder extends Basis {
    view: ViewPosition;
    material: { sx: number; sy: number; };

    constructor(game) {
        super(game, {});

        this.view = new ViewPosition({
            width: 24,
            height: 24,
            // x: 0,
            // y: 0,
            // sx: 0,
            // sy: 0
        });
        this.speed = 3;
        this.material = {
            sx: 0,
            sy: 0
        };

        this.addActivity();
    }

    update() {
        this.view.sx = (this.game.mouse.x + this.game.camera.x) - (this.game.mouse.x + this.game.camera.x) % this.view.width;
        this.view.sy = (this.game.mouse.y + this.game.camera.y) - (this.game.mouse.y + this.game.camera.y) % this.view.width;
        this.move();


        const { keyboard } = this.game;

        if (keyboard.isPressed(KeyboardKey.R)) {
            this.game.stage.remove(this.view.sx, this.view.sy);
        }
        if (keyboard.isPressed(KeyboardKey.F)) {
            this.game.stage.addSolid(this.view.sx, this.view.sy, 24, 24);
        }
        if (keyboard.isPressed(KeyboardKey.G)) {
            this.game.stage.removeSolid(this.view.sx, this.view.sy);
        }
    }

    render() {


        this.game.screen.beginPath();
        this.game.screen.strokeStyle = 'black';
        this.game.screen.rect(this.view.sx - this.game.camera.x, this.view.sy - this.game.camera.y, this.view.width, this.view.height);
        this.game.screen.stroke();

        this.game.screen.beginPath();
        this.game.screen.fillStyle = 'white';
        this.game.screen.fillRect(this.game.camera.width - 240, this.game.camera.height - 360, 240, 360);
        this.game.screen.stroke();

        this.game.screen.drawImage(
            this.game.stage.image,
            0,
            0,
            240,
            360,
            this.game.camera.width - 240,
            this.game.camera.height - 360,
            240,
            360
        );

        this.game.screen.beginPath();
        this.game.screen.strokeStyle = 'red';
        this.game.screen.rect(this.game.camera.width - 240 + this.material.sx, this.game.camera.height - 360 + this.material.sy, this.view.width, this.view.height);
        this.game.screen.stroke();


    }


    move() {
        var x = this.view.sx;
        var y = this.view.sy;

        if (this.game.keyboard.isPressed(KeyboardKey.A)) {
            this.view.x -= this.speed;
        } else if (this.game.keyboard.isPressed(KeyboardKey.D)) {
            this.view.x += this.speed;
        }

        if (this.game.keyboard.isPressed(KeyboardKey.W)) {
            this.view.y -= this.speed;
        } else if (this.game.keyboard.isPressed(KeyboardKey.S)) {
            this.view.y += this.speed;
        }
    }

    addActivity() {
        var self = this;
        var {keyboard, mouse} = this.game;
        var game = this.game;

        mouse.onClick((e) => {
            if (e.x > game.camera.width - 240 && e.y > game.camera.height - 360) {
                var x = e.x - (game.camera.width - 240);
                var y = e.y - (game.camera.height - 360);
                x = x - (x % self.view.width);
                y = y - (y % self.view.height);

                self.material.sx = x;
                self.material.sy = y;
                console.log(self.material.sx, self.material.sy);
            } else {
                self.game.stage.build({
                    x: self.view.sx,
                    y: self.view.sy,
                    sx: self.material.sx,
                    sy: self.material.sy
                });
            }
        });

        // keyboard.onInput(KeyboardKey.SPACE, () => {
        //     this.game.stage.toggleSolid(self.view.sx, self.view.sy, 24, 24);
        // })

        // keyboard.onInput(KeyboardKey.C, () => {
        //     this.game.stage.clean();
        // })

        // keyboard.onInput(KeyboardKey.R, () => {
        //     this.game.stage.remove(self.view.sx, self.view.sy);
        // })

        keyboard.onInput(KeyboardKey.F3, () => {
            this.game.stage.logLevel();
        })

        keyboard.onInput(KeyboardKey.F4, () => {
            this.game.stage.loadLevel('1');
        })
    }
}