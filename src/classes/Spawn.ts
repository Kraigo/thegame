import { Basis } from "./Basis";
import { Block, BlockParams } from "./Block";
import { Game } from "./Game";
import { SpriteAnimationName } from "./Sprite";
import { ViewPosition } from "./utils/view-position";

export interface SpawnParams<T> extends BlockParams {
    time?: number,
}

export class Spawn<T extends Basis> extends Block {
    interval?: NodeJS.Timer;
    time: any;
    populationModel: any;
    populationParams: any;
    child?: any;

    constructor(
        game: Game,
        public populate: (view: ViewPosition) => T,
        params: SpawnParams<T>
    ) {
        super(game, params);
        this.time = params.time || 1000;
        this.interval = null;
        this.child = null;
        this.animation.name = SpriteAnimationName.spawner;
        this.startInterval();
    }

    spawnItem() {
        const view = new ViewPosition({
            x: this.view.x,
            y: this.view.y
        })
        const body = this.populate(view);
        body.createCollider();
        this.child = body;
        this.game.addBody(body);
    }

    onLeave() {
        // this.contact();
    }

    onDie() {
        clearInterval(this.interval);
    }

    startInterval() {
        this.interval = setInterval(() => {
            if (this.game.bodies.indexOf(this.child) < 0) {
                this.spawnItem();
            }
            // this.faceContacts();

            // if (!this.contacts.some(c => c.constructor.name === this.populationModel)) {
            //     this.spawnItem();
            // }
        }, this.time)
    }

}