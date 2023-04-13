export class Vector {
    constructor(
        public x: number,
        public y: number
    ) {}

    directionTo(x: number, y: number): Vector {
        var vx = x - this.x;
        var vy = y - this.y;
        var dxy = Math.sqrt(vx * vx + vy * vy);
        return new Vector(vx / dxy, vy / dxy);
    }

    directionToVector(v: Vector): Vector {
        return this.directionTo(v.x, v.y);
    }

    angleTo(v: Vector): number {
        var angleRadians = Math.atan2(v.y - this.y, v.x - this.x);
        return angleRadians * 180 / Math.PI;
    }

    rotate(angle: number) {
        var nx = this.x * Math.cos(angle) - this.y * Math.sin(angle);
        var ny = this.x * Math.sin(angle) + this.y * Math.cos(angle);

        return new Vector(nx, ny);
    }
}