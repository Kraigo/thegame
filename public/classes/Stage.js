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
        this.levelGrid = null;
        this.finder = new PF.BestFirstFinder();
        // this.finder = new PF.AStarFinder();


        this.levelBodies = [
            {
                model: "Teleport",
                view: {
                    x: 315,
                    y: 57
                },
                pairId: 'A'
            },
            {
                model: "Teleport",
                view: {
                    x: 348,
                    y: 574
                },
                pairId: 'A'
            },
            {
                model: "BonusHealth",
                view: {
                    x: 360,
                    y: 267
                },
                collider: {
                    r: 5
                }
            },
            {
                model: "BonusFireRate",
                view: {
                    x: 477,
                    y: 366
                },
                collider: {
                    r: 5
                }
            },
            {
                model: "Spawn",
                view: {
                    x: 63,
                    y: 312
                },
                populationModel: "BonusSpeedUp"
            }
        ]



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

        if (this.game.debug) {
            this.renderSolid();
        }
    }

    renderSolid() {
        for (var i=0; i<this.levelSolid.length; i++) {
            let collider = this.levelSolid[i];
            this.game.screen.fillStyle = 'rgba(255, 0, 0, 0.3)';
            if (collider instanceof SAT.Box) {
                this.game.screen.fillRect(
                collider.pos.x - this.game.camera.x + 1,
                collider.pos.y - this.game.camera.y + 1,
                collider.w - 2,
                collider.h - 2);
            } else if (collider instanceof SAT.Polygon) {
                this.game.screen.beginPath();
                this.game.screen.moveTo(collider.points[0].x - this.game.camera.x, collider.points[0].y - this.game.camera.y);
                for (var p = 1; p < collider.points.length; p++) {
                    this.game.screen.lineTo(collider.points[p].x - this.game.camera.x, collider.points[p].y - this.game.camera.y);
                }
                this.game.screen.lineTo(collider.points[collider.points.length - 1].x - this.game.camera.x, collider.points[collider.points.length - 1].y - this.game.camera.y);
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
            xobj.open('GET', 'levels/level_'+lvl+'.json', true);
            xobj.onreadystatechange = function () {
                if (xobj.readyState == 4 && xobj.status == "200") {
                    var levelData = JSON.parse(xobj.responseText);
                    // self.level = levelData.tiles;
                    // self.levelSolid = levelData.solids;
                    self.levelGrid = new PF.Grid(self.game.world.width / self.size.width, self.game.world.height / self.size.height);

                    for (let i = 0; i < levelData.tiles.length; i++) {
                        self.level.push(levelData.tiles[i]);
                    }

                    for (let i = 0; i < levelData.solids.length; i++) {
                        let solid = levelData.solids[i];
                        self.addSolid(solid.x, solid.y, solid.w, solid.h);
                        self.levelGrid.setWalkableAt(solid.x / self.size.width, solid.y / self.size.height, false);
                    }

                    for (let i = 0; i < self.levelBodies.length; i++) {
                        self.game.evalBody(self.levelBodies[i]);
                    }
                    // self.simplifySolid();
                }
            };
            xobj.send(null);
    }

    logLevel() {
        console.log(JSON.stringify(this.level));
        console.log('==============================');
        console.log(JSON.stringify(this.levelSolida.map(l => {
            return {
                x: l.pos.x,
                y: l.pos.y,
                w: l.w,
                h: l.h,
            }
        })));
    }
    addSolid(x, y, width, height) {
       this.levelSolid.push(new SAT.Box(new SAT.Vector(x, y), width, height));
    }
    simplifySolid() {
        this.levelSolid = this.levelSolid.map(b => b.toPolygon());

        for(var i = 0; i < this.levelSolid.length; i++) {
            let collider = this.levelSolid[i];
            let response = new SAT.Response();
            for (var j = 0; j < this.levelSolid.length; j++) {
                if (collider != this.levelSolid) {
                    response.clear();
                    // debugger;
                    let collided = SAT.testPolygonPolygon(collider, this.levelSolid[j], response);
                    if(collided) {
                        this.levelSolid[i] = new SAT.Polygon(new SAT.Vector(collider.pos.x, collider.pos.y), collider.points.concat(this.levelSolid[j].points));
                        this.levelSolid.splice(j, 1);
                        // j--;
                    }
                }
            }
        }
    }

    simplifySolid__old() {
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

    path(a1, a2) {

        if (this.levelGrid) {
            return this.finder.findPath(
                this.normalizeForPath(a1.view.cx),
                this.normalizeForPath(a1.view.cy),
                this.normalizeForPath(a2.view.cx),
                this.normalizeForPath(a2.view.cy),
                this.levelGrid.clone())
                .map(p => [p[0] * this.size.width, p[1] * this.size.height]);
        }
        return [];
    }

    normalizeForPath(val) {
        return (val - (val % this.size.width)) / this.size.width;
    }
}