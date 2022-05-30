import { Direction } from "./direction";
import { Size } from "./size";

export class ViewPosition implements Size, Direction {
    width: number = 16;
    height: number = 16;
    x: number = 0;
    y: number = 0;

    sx: number = 0;
    sy: number = 0;

    constructor(params: Partial<ViewPosition>) {
        Object.assign(this, params);
    }

    get cx() {
        return this.x + (this.width / 2)
    }
    get cy() {
        return this.y + (this.height / 2)
    }
}