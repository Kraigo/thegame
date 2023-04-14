import { BasisParams } from "./Basis";
import { Block } from "./Block";
import { SpriteAnimationName } from "./Sprite";

export class Door extends Block {
    closed: boolean = true;

    constructor(game, params: BasisParams) {
        super(game, {
            ...params,
            view: {
                width: 24,
                height: 24,
                ...params.view
            },
        });
        this.updateState();
    }
    
    render() {
        this.game.sprite.draw(this, this.lookAngle);
    }

    updateState() {
        if (this.closed) {
            this.animation.name = SpriteAnimationName.doorClosed;
            this.game.stage.addSolid(this.view.x, this.view.y, this.view.width, this.view.height);
        } else {
            this.animation.name = SpriteAnimationName.doorOpen;
            this.game.stage.removeSolid(this.view.x, this.view.y);
        }
    }
    
    open() {
        this.closed = false;
        this.updateState();
    }
    
    close() {
        this.closed = true;
        this.updateState();
    }
}