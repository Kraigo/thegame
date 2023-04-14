import { Basis, BasisParams } from "./Basis";
import { Block, BlockParams } from "./Block";
import { Door } from "./Door";
import { Player } from "./Player";
import { SpriteAnimationName } from "./Sprite";

export interface ButtonParams extends BlockParams {
    targetId?: string;
}

export class Button extends Block {
    active: boolean = true;
    targetId?: string;

    constructor(game, params: ButtonParams) {
        super(game, {
            ...params,
            view: {
                width: 48,
                height: 48,
                ...params.view
            },
        });
        this.animation.name = SpriteAnimationName.button;
        this.targetId = params.targetId;
        this.collider = {
            r: 5
        }

        this.createCollider();
        this.updateState();
    }
    
    render() {
        this.game.sprite.draw(this, this.lookAngle);
    }

    updateState() {
        if (this.active) {
            this.animation.name = SpriteAnimationName.button;
        } else {
            this.animation.name = SpriteAnimationName.buttonPressed;
        }
    }

    onEnter(body: Basis): void {
        if (body instanceof Player) {
            if (this.active) {
                for (let body of this.game.bodies) {
                    if (body instanceof Door) {
                        if (body.id === this.targetId) {
                            body.open();
                        }
                    }
                }
                this.active = false;
                this.updateState();
            }
        }
    }


}