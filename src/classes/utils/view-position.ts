
import { Size } from "./size";
import { Vector } from "./vector";

export class ViewPosition extends Vector implements Size {
    width: number = 16;
    height: number = 16;
    x: number = 0;
    y: number = 0;

    constructor(params: Partial<ViewPosition>) {
        super(params.x, params.y);
        Object.assign(this, params);
    }

    get cx() {
        return this.x + (this.width / 2)
    }
    get cy() {
        return this.y + (this.height / 2)
    }

    get vector(): Vector {
        return new Vector(this.cx, this.cy);
    }
    
    directionToView(view: ViewPosition): ViewPosition {
        const { x,y } = view.directionToVector(this.vector);
        return new ViewPosition({
            ...this, x, y
        })
    }
}