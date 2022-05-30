import { Basis } from "./Basis";
import { Block, BlockParams } from "./Block";
import { Game } from "./Game";

export interface SpawnParams<T> extends BlockParams {
    time?: number,
    populate: () => T;
}

export class Spawn<T extends Basis> extends Block {
    interval?: NodeJS.Timer;
    time: any;
    populationModel: any;
    populationParams: any;
    child?: any;
    populate: () => T;
    
    constructor(
        game: Game,
        params: SpawnParams<T>
    ) {
        super(game, params);
        this.time = params.time || 1000;
        this.populate = params.populate.bind(this);
        this.interval = null;
        this.child = null;
        this.startInterval();
    }

    spawnItem() {
        


        // let body = this.game.evalBody(this.populationModel, this.populationParams);
        const body = this.populate();
        body.view.x = this.view.x;
        body.view.y = this.view.y;
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