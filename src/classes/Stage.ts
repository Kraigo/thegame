import { Game } from "./Game";
import { Size } from "./utils/size";
import * as PF from 'pathfinding';
import { Block } from "./Block";
import { Teleport } from "./Teleport";
import { Spawn } from "./Spawn";
import { BonusHealth } from "./Bonuses/Health";
import { BonusFireRate } from "./Bonuses/FireRate";
import * as SAT from 'sat';
import { BonusSpeedUp } from "./Bonuses/SpeedUp";
import { Asteroid } from "./Asteroid";
import { TripleFire } from "./Bonuses/TripleFire";
import { Vector, ViewPosition } from "./utils/index";
import { Player } from "./Player";
import { Bonus } from "./Bonus";
import { Door } from "./Door";
import { Button } from "./Button";

type LevelSolid = SAT.Box;

export class Stage {
    dir: string;
    image: HTMLImageElement;
    current: number;
    size: Size;
    finder: PF.AStarFinder;
    levelGrid: PF.Grid;

    level: any[];
    levelSolid: LevelSolid[];

    constructor(
        private game: Game
    ) {
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
        // this.finder = new PF.BestFirstFinder({dontCrossCorners: false});
        this.finder = new PF.AStarFinder({
            diagonalMovement: PF.DiagonalMovement.OnlyWhenNoObstacles
            // allowDiagonal: true,
            // dontCrossCorners: true
        });
    }

    render() {


        this.game.screen.fillStyle = "#161318";
        this.game.screen.fillRect(0 - this.game.camera.x, 0 - this.game.camera.y, this.game.world.width, this.game.world.height);

        for (var i = 0; i < this.level.length; i++) {
            this.draw(this.level[i]);
        }

        if (this.game.builder) {
            for (var i = 0; i < this.levelSolid.length; i++) {
                this.game.screen.beginPath();
                this.game.screen.fillStyle = 'rgba(255, 0, 0, 0.3)';
                const solid = this.levelSolid[i];

                //TODO ?
                this.game.screen.fillRect(
                    solid.pos.x + 2 - this.game.camera.x,
                    solid.pos.y + 2 - this.game.camera.y,
                    solid.w - 4,
                    solid.h - 4);
                this.game.screen.stroke();
            }
        }

        if (this.game.debug) {
            this.renderSolid();
        }
    }

    renderSolid() {
        for (var i = 0; i < this.levelSolid.length; i++) {
            let collider = this.levelSolid[i];
            this.game.screen.fillStyle = 'rgba(255, 0, 0, 0.3)';
            if (collider instanceof SAT.Box) {
                this.game.screen.fillRect(
                    collider.pos.x - this.game.camera.x + 1,
                    collider.pos.y - this.game.camera.y + 1,
                    collider.w - 2,
                    collider.h - 2);
            }
            // TODO: ??
            // else if (collider instanceof SAT.Polygon) {
            //     this.game.screen.beginPath();
            //     this.game.screen.moveTo(collider.points[0].x - this.game.camera.x, collider.points[0].y - this.game.camera.y);
            //     for (var p = 1; p < collider.points.length; p++) {
            //         this.game.screen.lineTo(collider.points[p].x - this.game.camera.x, collider.points[p].y - this.game.camera.y);
            //     }
            //     this.game.screen.lineTo(collider.points[collider.points.length - 1].x - this.game.camera.x, collider.points[collider.points.length - 1].y - this.game.camera.y);
            //     this.game.screen.stroke();
            // }
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
        for (var i = 0; i < this.level.length; i++) {
            if (this.level[i].x === x && this.level[i].y === y) {
                this.level.splice(i, 1);
                break;
            }
        }
    }

    prebuildLevel() {
        const levelBodies = [

            new BonusHealth(this.game, {
                view: {
                    x: 408,
                    y: 148
                },
                collider: {
                    r: 5
                }
            }),
            new TripleFire(this.game, {
                view: {
                    x: 408 - 48 * 4,
                    y: 148
                },
                collider: {
                    r: 5
                }
            }),
            new BonusFireRate(this.game, {
                view: {
                    x: 360,
                    y: 600
                },
                collider: {
                    r: 5
                }
            }),
            new Spawn(this.game,
                (view) => new BonusSpeedUp(this.game, { view }),
                {
                    view: {
                        x: 63,
                        y: 312
                    }
                }),
            // new Spawn(this.game, {
            //     time: 5000,
            //     view: {
            //         x: 700,
            //         y: 160
            //     },
            //     populate: () => new Asteroid(this.game, {
            //         target: this.game.player
            //     })
            // }),
            // new Spawn(this.game, {
            //     time: 5000,
            //     view: {
            //         x: 50,
            //         y: 670
            //     },
            //     populate: () => new Asteroid(this.game, {
            //         target: this.game.player
            //     })
            // }),

            new Teleport(this.game, {
                view: {
                    x: 63,
                    y: 379
                },
                pairId: 'test'
            }),

            new Teleport(this.game, {
                view: {
                    x: 510,
                    y: 238
                },
                pairId: 'test'
            }),
            new Door(this.game, {
                id: 'door1',
                view: {
                    x: 768,
                    y: 460
                },
            }),
            new Door(this.game, {
                id: 'door1',
                view: {
                    x: 768,
                    y: 460 + 24
                },
            }),
            new Door(this.game, {
                id: 'door1',
                view: {
                    x: 768,
                    y: 508
                },
            }),
            new Door(this.game, {
                id: 'door1',
                view: {
                    x: 768,
                    y: 508 + 24
                },
            }),
            new Button(this.game, {
                view: {
                    x: 617,
                    y: 479
                },
                targetId: 'door1'
            }),
            new Button(this.game, {
                view: {
                    x: 784,
                    y: 484
                },
                targetId: 'door2'
            }),
            new Door(this.game, {
                id: 'door2',
                view: {
                    x: 768+96,
                    y: 460
                },
            }),
            new Door(this.game, {
                id: 'door2',
                view: {
                    x: 768+96,
                    y: 460 + 24
                },
            }),
            new Door(this.game, {
                id: 'door2',
                view: {
                    x: 768+96,
                    y: 508
                },
            }),
            new Door(this.game, {
                id: 'door2',
                view: {
                    x: 768+96,
                    y: 508 + 24
                },
            }),
        ]
        
        for (const body of levelBodies) {
            this.game.addBody(body);
        }
    }


    async loadLevel(lvl) {

        this.prebuildLevel();

        const resp = await fetch('levels/level_' + lvl + '.json');
        const levelData = await resp.json();

        // self.level = levelData.tiles;
        // self.levelSolid = levelData.solids;
        this.levelGrid = new PF.Grid(
            this.game.world.width / this.size.width,
            this.game.world.height / this.size.height);

        for (const tile of levelData.tiles) {
            this.level.push(tile);
        }

        for (const solid of levelData.solids) {
            this.addSolid(solid.x, solid.y, solid.w, solid.h);
            this.levelGrid.setWalkableAt(
                solid.x / this.size.width,
                solid.y / this.size.height, false);
        }
        for (const meta of levelData.bodies) {
            const body = this.parseBody(meta);
            this.game.addBody(body);
        }


        // var xobj = new XMLHttpRequest();
        // var self = this;
        // xobj.overrideMimeType("application/json");
        // xobj.open('GET', 'levels/level_'+lvl+'.json', true);
        // xobj.onreadystatechange = function () {
        //     if (xobj.readyState == 4 && xobj.status == "200") {
        //         var levelData = JSON.parse(xobj.responseText);
        //         // self.level = levelData.tiles;
        //         // self.levelSolid = levelData.solids;
        //         self.levelGrid = new PF.Grid(self.game.world.width / self.size.width, self.game.world.height / self.size.height);

        //         for (let i = 0; i < levelData.tiles.length; i++) {
        //             self.level.push(levelData.tiles[i]);
        //         }

        //         for (let i = 0; i < levelData.solids.length; i++) {
        //             let solid = levelData.solids[i];
        //             self.addSolid(solid.x, solid.y, solid.w, solid.h);
        //             self.levelGrid.setWalkableAt(solid.x / self.size.width, solid.y / self.size.height, false);
        //         }

        //         for (let i = 0; i < self.levelBodies.length; i++) {
        //             let body = self.game.evalBody(self.levelBodies[i].model, self.levelBodies[i].params);
        //             self.game.addBody(body);
        //         }
        //         // self.simplifySolid();
        //     }
        // };
        // xobj.send(null);
    }

    logLevel() {
        const levelData = {
            tiles: this.level,
            solids: this.levelSolid.map(l => {
                return {
                    x: l.pos.x,
                    y: l.pos.y,
                    w: l.w,
                    h: l.h,
                }
            }),
            bodies: []
        }

        console.log('===Level===========================');
        console.log(JSON.stringify(levelData));
    }

    private solidIndex(x: number, y: number): number {
        return this.levelSolid.findIndex(s =>
            s.pos.x === x && s.pos.y === y);
    }

    addSolid(x: number, y: number, width: number, height: number) {
        const index = this.solidIndex(x, y);
        if (index === -1) {
            this.levelSolid.push(new SAT.Box(new SAT.Vector(x, y), width, height));
        }
    }

    removeSolid(x: number, y: number) {
        const index = this.solidIndex(x, y);
        if (index > -1) {
            this.levelSolid.splice(index, 1);
        }
    }

    // simplifySolid() {
    //     this.levelSolid = this.levelSolid.map(b => b.toPolygon());

    //     for(var i = 0; i < this.levelSolid.length; i++) {
    //         let collider = this.levelSolid[i];
    //         let response = new SAT.Response();
    //         for (var j = 0; j < this.levelSolid.length; j++) {
    //             if (collider != this.levelSolid) {
    //                 response.clear();
    //                 // debugger;
    //                 let collided = SAT.testPolygonPolygon(collider, this.levelSolid[j], response);
    //                 if(collided) {
    //                     this.levelSolid[i] = new SAT.Polygon(new SAT.Vector(collider.pos.x, collider.pos.y), collider.points.concat(this.levelSolid[j].points));
    //                     this.levelSolid.splice(j, 1);
    //                     // j--;
    //                 }
    //             }
    //         }
    //     }
    // }

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
                    item.height + item.y >= neighbor.y) {

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
        this.levelSolid = this.levelSolid.filter(function (n) { return !!n });
    }

    path(a1, a2): ViewPosition[] {
        if (this.levelGrid) {
            return this.finder.findPath(
                this.normalizeForPath(a1.view.cx),
                this.normalizeForPath(a1.view.cy),
                this.normalizeForPath(a2.view.cx),
                this.normalizeForPath(a2.view.cy),
                this.levelGrid.clone())
                .map(p => {
                    return new ViewPosition({
                        x: p[0] * this.size.width,
                        y: p[1] * this.size.height,
                        width: this.size.width,
                        height: this.size.height
                    })
                });
        }
        return [];
    }

    normalizeForPath(val) {
        return (val - (val % this.size.width)) / this.size.width;
    }

    parseBody(meta) {
        switch (meta.model) {
            case "Teleport":
                return new Teleport(
                    this.game, {
                    view: meta.view,
                    ...meta.params
                });
        }
    }

    sortBodyPriority(element): number {
        switch (true) {
            case element instanceof Player:
                return 1;
            case element instanceof Bonus:
            case element instanceof Teleport:
                return 10;
            default:
                return 100;
        }
    }
}