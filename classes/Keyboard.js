'use strict';
class Keyboard {
	constructor() {
		var state = {};
		var KEYS = {
			SPACE: 32,
			A: 65,
			W: 87,		
			D: 68,
			S: 83,

			LEFT: 37,
			UP: 38,
			RIGHT: 39,
			DOWN: 40,
		};

		document.addEventListener('keydown', function(e) {
			e.preventDefault();
			state[e.keyCode] = true;
		})
		document.addEventListener('keyup', function(e) {
			state[e.keyCode] = false;
		})

		this.isPressed = function(key) {
			key = key.toUpperCase();
			return state[KEYS[key]];
		}
	}
}