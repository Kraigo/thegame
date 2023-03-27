export enum MouseKey {
    LEFT = 0,
    RIGHT = 2,
    MIDDLE = 1
}

export class Mouse {
    x: number;
    y: number;
    state = {};

    private listeners: ((event: MouseEvent) => void)[] = [];

    constructor(
        private canvas: HTMLCanvasElement
    ) {
        var mause = this;
        this.x = 0;
        this.y = 0;

        canvas.addEventListener('mousemove', function (e) {
            mause.x = e.clientX;
            mause.y = e.clientY;
        });
        canvas.addEventListener('mousedown', (e) => {
            e.preventDefault();
            this.state[e.button] = true;

            for (const listener of this.listeners) {
                listener(e);
            }
        });
        canvas.addEventListener('mouseup', (e) => {
            e.preventDefault();
            this.state[e.button] = false;
        });
    }

    isPressed(button: MouseKey) {
        return this.state[button]
    }

    onClick(cb: (event: MouseEvent) => void) {
        this.listeners.push(cb);
    }
}