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
        this.level = [];
        this.levelSolid = [];



        //for (var x = 0; x < this.game.world.width; x+=this.size.width) {
        //    for (var y = 0; y < this.game.world.height; y+=this.size.height) {
        //        //if (x === 0 ) {
        //        //    this.build(['wall_4', x, y]);
        //        //} else if (y === 0 ) {
        //        //    this.build(['wall_2', x, y]);
        //        //} else if (x === this.game.world.width - this.size.width ) {
        //        //    this.build(['wall_6', x, y]);
        //        //} else if (y === this.game.world.height - this.size.height ) {
        //        //    this.build(['wall_8', x, y]);
        //        //} else {
        //            this.build(['wall_5', x, y]);
        //        //}
        //
        //    }
        //}

        this.loadLevel('1');

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


        this.game.screen.fillStyle="#161318";
        this.game.screen.fillRect(0-this.game.camera.x,0-this.game.camera.y, this.game.world.width, this.game.world.height);

        for (var i=0; i<this.level.length; i++) {
            this.draw(this.level[i]);
        }

        if (this.game.builder) {
            for (var i = 0; i < this.levelSolid.length; i++) {
                this.game.screen.beginPath();
                this.game.screen.fillStyle = 'rgba(255, 0, 0, 0.3)';
                this.game.screen.fillRect(this.levelSolid[i].x + 2 - this.game.camera.x, this.levelSolid[i].y + 2 - this.game.camera.y, this.levelSolid[i].width - 4, this.levelSolid[i].height - 4);
                this.game.screen.stroke();
            }
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
        this.level.push(item);
    }
    clean() {
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


                    self.level = levelData.tiles;
                    self.levelSolid = levelData.solids;
                    //for (var i = 0; i < levelData.length; i++) {
                    //    self.level.push(levelData[i]);
                    //
                    //    if (levelData[i].solid) {
                    //        self.addSolid(levelData[i].x, levelData[i].y);
                    //    }
                    //}
                }
            };
            xobj.send(null);
    }

    logLevel() {
        console.log(JSON.stringify(this.level));
        console.log('==============================');
        console.log(JSON.stringify(this.levelSolid));
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
            var isMerged = false;
            for (var j = 0, neighbor; j < this.levelSolid.length; j++) {
                neighbor = this.levelSolid[j];
                if (!neighbor) continue;
                if (item != neighbor &&
                    item.x <= neighbor.x + neighbor.width &&
                    item.x + item.width >= neighbor.x &&
                    item.y <= neighbor.y + neighbor.height &&
                    item.height + item.y >= neighbor.y)
                {

                    if ((item.x === neighbor.x && item.width === neighbor.width) ||
                        (item.y === neighbor.y && item.height === neighbor.height)) {

                        if (neighbor.x < item.x) {
                            item.x -= neighbor.width;
                            item.width += neighbor.width;
                        } else if (neighbor.x > item.x) {
                            item.width += neighbor.width;
                        } else if (neighbor.y < item.y) {
                            item.y -= neighbor.height;
                            item.height += neighbor.height;
                        } else if (neighbor.y > item.y) {
                            item.height += neighbor.height;
                        }

                        //if (neighbor.y < item.y) {
                        //    item.y -= neighbor.height;
                        //}
                        //
                        //item.width += neighbor.x - item.x;
                        //item.height += neighbor.y - item.y;
                        //console.log(item, neighbor, neighbor.x - item.x, neighbor.y - item.y);
                        isMerged = true;
                        delete this.levelSolid[j];
                    }
                }

            }
            if (isMerged) {
                i--;
            }
        }
        this.levelSolid = this.levelSolid.filter(function(n){ return !!n });
    }
}