import {Vec} from "../utils";

export class Coin {
    constructor(position, basePosition, wobble) {
        this.position = position;
        this.basePosition = basePosition;
        this.wobble = wobble;
    }

    get type() {
        return 'coin';
    }

    static create(position) {
        let basePosition = position.plus(new Vec(0.2, 0.1));
        return new Coin(basePosition, basePosition, Math.random() * Math.PI * 2);
    }
}





