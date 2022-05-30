import { Basis } from "./Basis";
import { Game } from "./Game";
import { Size } from "./utils/size";

export enum SpriteAnimationName {
    player = 'player',
    monster = 'monster',
    bullet = 'bullet',
    teleport = 'teleport',
    bonusSpeed = 'bonusSpeed',
    bonusHealth = 'bonusHealth',
    bonusAmmo = 'bonusAmmo',
    bonusFire = 'bonusFire',
    spawner = 'spawner'
}

export enum SpriteAnimationState {
    stand = 'stand',
    walk = 'walk',
    bite = 'bite',
    attack = 'attack',
    die = 'die'
}

export class SpriteAnimation {
    name: SpriteAnimationName;
    state: SpriteAnimationState;
    keyframe: number;
    rate: number;
    end: boolean

    constructor(params: SpriteAnimation) {
        Object.assign(this, params);
    }
}

export type SpriteCollection = {
    [key in SpriteAnimationState]?: Array<{
        x: number,
        y: number,
        w?: number,
        h?: number
    }>
}

const SPRITES = {
    player: {
        stand: [{x:0, y: 0}],
        walk: [{x:0, y: 0}, {x:48, y:0}, {x:96, y:0}, {x:144, y:0}, {x:0, y: 48}, {x:48, y:48}, {x:96, y:48}, {x:144, y:48}],
        die: [{x: 0, y: 336}, {x: 0, y: 336}, {x: 48, y: 336}, {x: 48, y: 336}]
    },
    monster: {
        stand: [{x:0, y: 144}],
        walk: [{x:0, y: 144}, {x:48, y:144}, {x:96, y:144}, {x:144, y:144},{x:0, y: 192}, {x:48, y:192}, {x:96, y:192}, {x:144, y:192}],
        bite: [{x: 0, y:240}, {x: 48, y:240}, {x: 96, y:240}],
        attack: [{x:0, y: 288}, {x:48, y: 288}, {x:96, y: 288}, {x:144, y: 288}, {x:192, y: 288}],
        die: [{x: 0, y: 336}, {x: 0, y: 336}, {x: 48, y: 336}, {x: 48, y: 336}]
    },
    bullet: {
        stand: [{x:0, y: 96, w: 24, h:24}],
        die: [{x:0, y: 120, w: 24, h:24},{x:24, y: 120, w: 24, h:24}]
    },
    teleport: {
        stand: [{x:0, y: 384, w: 52, h: 52}, {x:52, y: 384, w: 52, h: 52}, {x:104, y: 384, w: 52, h: 52}]
    },
    bonusSpeed: {
        stand: [{x: 0, y: 436, w: 48, h: 48}]
    },
    bonusHealth: {
        stand: [{x: 48, y: 436, w: 48, h: 48}]
    },
    bonusAmmo: {
        stand: [{x: 96, y: 436, w: 48, h: 48}]
    },
    bonusFire: {
        stand: [{x: 144, y: 436, w: 48, h: 48}]
    },
    spawner: {
        stand: [{x: 48, y: 216}]
    }
};


export class Sprite {
    dir: string;
    image: HTMLImageElement;
    view: Size;

    collection: {
        [key in SpriteAnimationName]: SpriteCollection
    }

	constructor(
        private readonly game: Game
    ) {
		this.dir = '/sprites/sprite.png';
		this.image = new Image();
		this.image.src = this.dir;
		this.view = {
			width: 48,
			height: 48
		}
        this.collection = SPRITES;
	}

	draw(body: Basis, angle: number) {
		var x = body.view.x + body.view.width/2 - this.game.camera.x;
		var y = body.view.y + body.view.height/2 - this.game.camera.y;
		angle = angle - 90 % 360;

		var frame = this.getFrame(body.animation);

		this.game.screen.save();
		this.game.screen.translate(x, y);
		this.game.screen.rotate(angle*Math.PI/180);

		this.game.screen.drawImage(
			this.image,
			frame.x,
			frame.y,
			frame.w || this.view.width,
			frame.h || this.view.height,
			-body.view.width/2,
			-body.view.width/2,
			body.view.width,
			body.view.height
		);
		this.game.screen.translate(-x, -y);
		this.game.screen.rotate(-angle*Math.PI/180);
		this.game.screen.restore();
	}

	getFrame(animation: SpriteAnimation) {
		var pack = this.collection[animation.name][animation.state];
		if (this.game.timer % animation.rate == 0) {
			if (pack.length - 1 > animation.keyframe) {
				animation.keyframe += 1;
			} else {
				animation.keyframe = 0;
				animation.end = true;
			}
		}
		return pack[animation.keyframe];
	}
}