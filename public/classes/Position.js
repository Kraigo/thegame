'use strict';
class Position {
	constructor(x, y) {
		this.x = x;
		this.y = y;
	}

	// directionTo(body) {
	// 	// (x1,y2) ==> (x2, y2)
	// 	var vx = (body.position.x + body.size.width/2) - (this.position.x + this.size.width/2);
	// 	var vy = (body.position.y + body.size.height/2) - (this.position.y + this.size.height/2);
	// 	var dxy = Math.sqrt(vx*vx + vy*vy);
	// 	return new Vector(vx/dxy, vy/dxy);
	// }
}