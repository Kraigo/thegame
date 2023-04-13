import { Basis } from "./Basis";
import { Unit } from "./Unit";
import { Block, BlockParams } from "./Block";
import { SpriteAnimationName } from "./Sprite";

export interface TeleportParams extends BlockParams {
    pairId?: string;
}

export class Teleport extends Block {
    pairId: String;
    active: boolean;

    constructor(game, params: TeleportParams = {}) {
        super(game, {
            ...params,
            view: {
                width: 52,
                height: 52,
                ...params.view
            }
        });
        this.pairId = params.pairId || Math.random().toString();
        this.active = true;
        this.animation.name = SpriteAnimationName.teleport;
        this.view.width = 52;
        this.view.height = 52;
        this.collider = {
            r: 5
        }
        this.createCollider();
    }

    render() {
        this.game.sprite.draw(this, this.lookAngle);
    }

    onEnter(body: Basis) {
        if (body instanceof Unit) {
            if (this.active) {
                const pairTeleport = this.game.bodies.find(b =>
                    b instanceof Teleport
                    && b !== this
                    && b.pairId === this.pairId);
                (pairTeleport as Teleport).active = false;
                body.teleport(pairTeleport.view.x, pairTeleport.view.y);
            }
        }
    }

    onLeave(body: Basis) {
        this.active = true;
    }
}