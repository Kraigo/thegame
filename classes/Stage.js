'use strict';

class Stage {
    constructor(game) {
        var self = this;
        this.game = game;
        this.dir = 'sprites/tileset.png';
        this.image = new Image();
        this.image.src = this.dir;
        this.current = 1;
        this.size = {
            width: 24,
            height: 24
        };
        this.cleaned = true;
        this.level = [];
        this.levelSolid = [];

        for (var x = 0; x < this.game.world.width; x+=this.size.width) {
            for (var y = 0; y < this.game.world.height; y+=this.size.height) {
                if (x === 0 ) {
                    this.build(['bfloor_4', x, y]);
                } else if (y === 0 ) {
                    this.build(['bfloor_2', x, y]);
                } else if (x === this.game.world.width - this.size.width ) {
                    this.build(['bfloor_6', x, y]);
                } else if (y === this.game.world.height - this.size.height ) {
                    this.build(['bfloor_8', x, y]);
                } else {
                    this.build(['bfloor_5', x, y]);
                }

            }
        }
        this.build(['bfloor_1', 0, 0]);
        this.build(['bfloor_3', this.game.world.width - this.size.width, 0]);
        this.build(['bfloor_7', 0, this.game.world.height - this.size.height]);
        this.build(['bfloor_9', this.game.world.width - this.size.width, this.game.world.height - this.size.height]);
        //this.clean();

    }

    render() {
        for (var i=0; i<this.level.length; i++) {
            this.draw(this.level[i]);
        }
    }
    draw(obj) {

        if (obj.x + this.size.width > this.game.camera.x &&
            obj.x < this.game.camera.x + this.game.camera.width &&
            obj.y + this.size.height > this.game.camera.y &&
            obj.y < this.game.camera.y + this.game.camera.height) {
            this.game.screen.drawImage(
                this.image,
                obj.sx,
                obj.sy,
                this.size.width,
                this.size.height,
                obj.x - this.game.camera.x,
                obj.y - this.game.camera.y,
                this.size.width,
                this.size.height
            );
        }
    }
    build(item) {
        var obj = {
            x: item[1],
            y: item[2]
        };
        switch (item[0]) {
            case 'floor_1':
                obj.sx = 0;
                obj.sy = 72;
                break;
            case 'floor_2':
                obj.sx = 24;
                obj.sy = 72;
                break;
            case 'floor_3':
                obj.sx = 48;
                obj.sy = 72;
                break;
            case 'floor_4':
                obj.sx = 0;
                obj.sy = 96;
                break;
            case 'floor_5':
                obj.sx = 24;
                obj.sy = 96;
                break;
            case 'floor_6':
                obj.sx = 48;
                obj.sy = 96;
                break;
            case 'floor_7':
                obj.sx = 0;
                obj.sy = 120;
                break;
            case 'floor_8':
                obj.sx = 24;
                obj.sy = 120;
                break;
            case 'floor_9':
                obj.sx = 48;
                obj.sy = 120;
                break;
            case 'bfloor_1':
                obj.sx = 0;
                obj.sy = 144;
                obj.solid = true;
                break;
            case 'bfloor_2':
                obj.sx = 24;
                obj.sy = 144;
                obj.solid = true;
                break;
            case 'bfloor_3':
                obj.sx = 48;
                obj.sy = 144;
                obj.solid = true;
                break;
            case 'bfloor_4':
                obj.sx = 0;
                obj.sy = 168;
                obj.solid = true;
                break;
            case 'bfloor_5':
                obj.sx = 24;
                obj.sy = 168;
                break;
            case 'bfloor_6':
                obj.sx = 48;
                obj.sy = 168;
                obj.solid = true;
                break;
            case 'bfloor_7':
                obj.sx = 0;
                obj.sy = 192;
                obj.solid = true;
                break;
            case 'bfloor_8':
                obj.sx = 24;
                obj.sy = 192;
                obj.solid = true;
                break;
            case 'bfloor_9':
                obj.sx = 48;
                obj.sy = 192;
                obj.solid = true;
                break;
        }
        this.cleaned = false;
        this.level.push(obj);
        if (obj.solid) {
            this.levelSolid.push(obj);
        }
    }
    clean() {
        if (!this.cleaned) {
            for (var i = 0, objFirst; i < this.level.length; i++) {
                objFirst = this.level[i];
                for (var j = 0, objSecond; j < this.level.length; j++) {
                    objSecond = this.level[j];
                    if (objFirst != objSecond && objFirst.x === objSecond.x && objFirst.y === objSecond.y) {
                        this.level.splice(i, 1);
                        i--;
                        break;
                    }
                }
            }
            this.cleaned = true;
        }
    }
}