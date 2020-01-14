import {Vec} from "../utils";

export class Player {
    constructor(position, speed) {
        this.position = position;
        this.speed = speed;
    }

    get type() {
        return 'player';
    }

    static create(position) {
        return new Player(position.plus(new Vec(0, -0.5)), new Vec(0, 0));
    }
}
