'use strict';
class Spawn extends Basis {
    constructor(game, params) {
        super(game, params);
        this.populationModel = params.populationModel;
        this.time = params.time || 1000;
        this.interval = null;
        this.createCollider();
        this.startInterval();
    }

    spawnItem() {
        this.game.evalBody({
            model: this.populationModel,
            view: {
                x: this.view.x,
                y: this.view.y,
                width: 24,
                height: 24
            },
            collider: {
                r: 5
            }
        })
    }

    onLeave() {
        // this.contact();
    }

    onDie() {
        clearIntervat(this.interval);
    }

    startInterval() {
        this.interval = setInterval(() => {
            this.faceContacts();

            if (!this.contacts.some(c => c.constructor.name === this.populationModel)) {
                this.spawnItem();
            }
        }, this.time)
    }
    
}