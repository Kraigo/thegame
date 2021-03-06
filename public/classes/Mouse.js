'use strict';
class Mouse {
	constructor(canvas) {
		var mause = this;
		var state = {};
		var BUTTONS = {
			LEFT: 0,
			RIGHT: 2,
			MIDDLE: 1
		};
		this.x = 0;
		this.y = 0;
		canvas.addEventListener('mousemove', function(e) {
			mause.x = e.clientX;
			mause.y = e.clientY;
		});
		canvas.addEventListener('mousedown', function(e) {
			e.preventDefault();
			state[e.button] = true;
		});
		canvas.addEventListener('mouseup', function(e) {
			e.preventDefault();
			state[e.button] = false;
		});

		this.isPressed = function(button) {
			button = button.toUpperCase();
			return state[BUTTONS[button]]
		}
	}
}