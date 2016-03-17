'use strict';

class Stage {
    constructor(game) {
        var self = this;
        this.game = game;
        this.dir = '/sprites/tileset.png';
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
                //if (x === 0 ) {
                //    this.build(['wall_4', x, y]);
                //} else if (y === 0 ) {
                //    this.build(['wall_2', x, y]);
                //} else if (x === this.game.world.width - this.size.width ) {
                //    this.build(['wall_6', x, y]);
                //} else if (y === this.game.world.height - this.size.height ) {
                //    this.build(['wall_8', x, y]);
                //} else {
                    this.build(['wall_5', x, y]);
                //}

            }
        }

        return;
        this.build(['wall_1', 0, 0]);
        this.build(['wall_3', this.game.world.width - this.size.width, 0]);
        this.build(['wall_7', 0, this.game.world.height - this.size.height]);
        this.build(['wall_9', this.game.world.width - this.size.width, this.game.world.height - this.size.height]);

        this.build(['wall_10', 288, 120]);
        this.build(['wall_11', 288, 144]);
        this.build(['wall_10', 288, 120]);
        this.build(['wall_11', 288, 144]);
        this.build(['wall_11', 288, 168]);
        this.build(['wall_11', 288, 192]);
        this.build(['wall_11', 288, 216]);
        this.build(['wall_12', 288, 240]);

        this.build(['wall_13', 288, 336]);
        this.build(['wall_14', 312, 336]);
        this.build(['wall_14', 336, 336]);
        this.build(['wall_15', 360, 336]);
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


            case 'wall_1':
                obj.sx = 0;
                obj.sy = 144;
                obj.solid = true;
                break;
            case 'wall_2':
                obj.sx = 24;
                obj.sy = 144;
                obj.solid = true;
                break;
            case 'wall_3':
                obj.sx = 48;
                obj.sy = 144;
                obj.solid = true;
                break;
            case 'wall_4':
                obj.sx = 0;
                obj.sy = 168;
                obj.solid = true;
                break;
            case 'wall_5':
                obj.sx = 24;
                obj.sy = 168;
                break;
            case 'wall_6':
                obj.sx = 48;
                obj.sy = 168;
                obj.solid = true;
                break;
            case 'wall_7':
                obj.sx = 0;
                obj.sy = 192;
                obj.solid = true;
                break;
            case 'wall_8':
                obj.sx = 24;
                obj.sy = 192;
                obj.solid = true;
                break;
            case 'wall_9':
                obj.sx = 48;
                obj.sy = 192;
                obj.solid = true;
                break;


            case 'wall_10':
                obj.sx = 72;
                obj.sy = 144;
                obj.solid = true;
                break;
            case 'wall_11':
                obj.sx = 72;
                obj.sy = 168;
                obj.solid = true;
                break;
            case 'wall_12':
                obj.sx = 72;
                obj.sy = 192;
                obj.solid = true;
                break;
            case 'wall_13':
                obj.sx = 96;
                obj.sy = 192;
                obj.solid = true;
                break;
            case 'wall_14':
                obj.sx = 120;
                obj.sy = 192;
                obj.solid = true;
                break;
            case 'wall_15':
                obj.sx = 144;
                obj.sy = 192;
                obj.solid = true;
                break;

            case 'wall_16':
                obj.sx = 96;
                obj.sy = 144;
                obj.solid = true;
                break;
            case 'wall_17':
                obj.sx = 118;
                obj.sy = 144;
                obj.solid = true;
                break;

            case 'wall_18':
                obj.sx = 96;
                obj.sy = 168;
                obj.solid = true;
                break;
            case 'wall_19':
                obj.sx = 120;
                obj.sy = 168;
                obj.solid = true;
                break;
        }
        this.cleaned = false;
        this.level.push(obj);
        if (obj.solid) {
            this.addSolid(obj.x, obj.y);
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

    remove(x, y) {
        for (var i=0; i<this.level.length; i++) {
            if (this.level[i].x === x && this.level[i].y === y) {
                this.level.splice(i, 1);
                break;
            }
        }
    }

    loadLevel(lvl) {
            var xobj = new XMLHttpRequest();
            var self = this;
            xobj.overrideMimeType("application/json");
            xobj.open('GET', '/levels/level_'+lvl+'.json', true);
            xobj.onreadystatechange = function () {
                if (xobj.readyState == 4 && xobj.status == "200") {
                    var levelData = JSON.parse(xobj.responseText);

                    for (var i = 0; i < levelData.length; i++) {
                        self.level.push(levelData[i]);

                        if (levelData[i].solid) {
                            self.addSolid(levelData[i].x, levelData[i].y);
                        }
                    }

                    self.simplifySolid();
                }
            };
            xobj.send(null);
    }

    logLevel() {
        console.log(JSON.stringify(this.level));
    }
    addSolid(x, y) {
       this.levelSolid.push({
           x: x,
           y: y,
           width: this.size.width,
           height: this.size.height
       })
    }

    simplifySolid() {
        console.log('before simplify', this.levelSolid.length);
        for (var i = 0, item; i < this.levelSolid.length; i++) {
            item = this.levelSolid[i];
            if (!item) continue;
            for (var j = 0, neighbor; j < this.levelSolid.length; j++) {
                neighbor = this.levelSolid[j];
                if (!neighbor) continue;
                if (item != neighbor &&
                    item.x <= neighbor.x + neighbor.width &&
                    item.x + item.width >= neighbor.x &&
                    item.y <= neighbor.y + neighbor.height &&
                    item.height + item.y >= neighbor.y)
                {

                    if ((item.x === neighbor.x && item.height === neighbor.height) ||
                        (item.y === neighbor.y && item.width === neighbor.width)) {

                        if (neighbor.x < item.x) {
                            item.x -= neighbor.width;
                        }

                        if (neighbor.y < item.y) {
                            item.y -= neighbor.height;
                        }

                        item.width += neighbor.x - item.x;
                        item.height += neighbor.y - item.y;
                        //console.log(item, neighbor, neighbor.x - item.x, neighbor.y - item.y);
                        delete this.levelSolid[j];
                        break;

                    }
                }

            }
        }
        this.levelSolid = this.levelSolid.filter(function(n){ return !!n });
        console.log('after simplify', this.levelSolid.length);
    }
}