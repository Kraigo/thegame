export class Vector {
    constructor(
        public x: number,
        public y: number
    ) { }

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

    rotate(radians: number) {
        var nx = this.x * Math.cos(radians) - this.y * Math.sin(radians);
        var ny = this.x * Math.sin(radians) + this.y * Math.cos(radians);

        return new Vector(nx, ny);
    }

    rotateDegree(degrees: number) {
        const radToDeg = 1 / 57.3;
        return this.rotate(degrees * radToDeg);
    }

    get magnitude(): number {
        return Math.sqrt(Math.pow(this.x, 2) + Math.pow(this.y, 2));
    }

    get normalized(): Vector {
        return new Vector(this.x / this.magnitude, this.y / this.magnitude);
    }
}