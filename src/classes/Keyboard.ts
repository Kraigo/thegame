const KEYS = {
    SPACE: 32,
    A: 65,
    W: 87,
    D: 68,
    S: 83,

    0: 48,
    1: 49,
    2: 50,
    3: 51,
    4: 52,
    5: 53,
    6: 54,
    7: 55,
    8: 56,
    9: 57,

    F: 70,
    G: 71,
    H: 72,
    C: 67,
    R: 82,
    F2: 113,
    F3: 114,
    F4: 115,
    F5: 116,

    LEFT: 37,
    UP: 38,
    RIGHT: 39,
    DOWN: 40
};

export class Keyboard {
    state = {};

    constructor() {
        document.addEventListener('keydown', (e) => {
            e.preventDefault();
            this.state[e.keyCode] = true;
        });
        document.addEventListener('keyup', (e) => {
            this.state[e.keyCode] = false;
        });
    }

    isPressed(key) {
        key = key.toUpperCase();
        return this.state[KEYS[key]];
    };

    isClicked(key, code) {
        return KEYS[key] === code
    };

    keyCode(key) {
        key = key.toUpperCase();
        return KEYS[key];
    }
}