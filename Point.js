'use strict';
class Point {
	constructor(game) {
		var point = this;
		var state = {};
		var BUTTONS = {
			LEFT: 0,
			RIGHT: 2,
			MIDDLE: 1
		}
		this.x = 0;
		this.y = 0;
		game.canvas.addEventListener('mousemove', function(e) {
			point.x = e.clientX;
			point.y = e.clientY;
		})		
		game.canvas.addEventListener('mousedown', function(e) {
			//e.preventDefault();
			state[e.button] = true;
		})
		game.canvas.addEventListener('mouseup', function(e) {
			e.preventDefault();
			state[e.button] = false;
		})

		this.isPressed = function(button) {
			button = button.toUpperCase();
			return state[BUTTONS[button]]
		}
	}
}