'use strict';
class Spawn extends Basis {
    constructor(game, params) {
        super(game, params);
        this.populationModel = params.populationModel;
        this.populationParams = params.populationParams;
        this.time = params.time || 1000;
        this.interval = null;
        this.child = null;
        this.startInterval();
    }

    spawnItem() {
        let body = this.game.evalBody(this.populationModel, this.populationParams);
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
        clearIntervat(this.interval);
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