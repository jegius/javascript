import {levelChars} from "../source/levelChars";
import {Vec} from "../utils";

export class Level {
    constructor(plan) {
        let rows = plan
            .trim()
            .split('\n')
            .map(level => [...level]);

        this.height = rows.length;
        this.width = rows[0].length;
        this.startActors = [];

        this.rows = rows.map((row, y) => {
            return row.map((char, x) => {
                let type = levelChars[char];

                if (typeof type === 'string') {
                    return type;
                }
                this.startActors.push(type.create(new Vec(x, y), char));
                return 'empty';
            })
        })
    }
}
