import {Vec} from "../utils";

export class Lava {
    constructor(position, speed, reset) {
        this.position = position;
        this.speed = speed;
        this.reset = reset;
    }

    get type() {
        return 'lava';
    }

    static create(position, char) {
        if (char === '=') {
            return new Lava(position, new Vec(2, 0));
        } else if (char === '|') {
            return new Lava(position, new Vec(0, 2));
        } else if (char === 'v') {
            return new Lava(position, new Vec(0, 3), position);
        }
    }
}
