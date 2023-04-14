export enum KeyboardKey {
    F2 = 'F2',
    F3 = 'F3',
    F4 = 'F4',
    SPACE = 'Space',
    C = 'KeyC',
    R = 'KeyR',
    A = 'KeyA',
    W = 'KeyW',
    S = 'KeyS',
    D = 'KeyD',
    F = 'KeyF',
    G = 'KeyG',
}
export class Keyboard {
    state = {};
    private listeners: ((key: KeyboardKey) => void)[] = [];

    constructor() {
        document.addEventListener('keydown', (e) => {
            e.preventDefault();
            this.state[e.code] = true;
        });
        document.addEventListener('keyup', (e) => {
            this.state[e.code] = false;
        });

        document.addEventListener('keydown', (e) => {
            e.preventDefault();
            for (let listener of this.listeners) {
                listener(e.code as KeyboardKey);
            }
        });
    }

    isPressed(key: KeyboardKey) {
        return this.state[key];
    };

    onInput(key: KeyboardKey, cb: () => void) {
        this.listeners.push((k: KeyboardKey) => {
            if (k === key) cb();
        });
    }
}