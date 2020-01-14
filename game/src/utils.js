import {Level} from "./core/level";
import {State} from "./core/state";

const arrowKeys = trackKeys(['ArrowLeft', 'ArrowRight', 'ArrowUp']);

export class Vec {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }

    plus(other) {
        return new Vec(this.x + other.x, this.y + other.y);
    }
    times(factor) {
        return new Vec(this.x * factor, this.y * factor);
    }
}

export function trackKeys(keys) {
    let down = Object.create(null);

    function track(event) {
        if (keys.includes(event.key)) {
            down[event.key] = event.type === 'keydown';
            event.preventDefault();
        }
    }
    window.addEventListener('keydown', track);
    window.addEventListener('keyup', track);
    return down;
}

export function runAnimation(frameFunc) {
    let lastTime = null;

    function frame(time) {
        if (lastTime !== null) {
            let timeStep = Math.min(time - lastTime, 100) / 1000;
            if (frameFunc(timeStep) === false) {
                return;
            }
        }
        lastTime = time;
        requestAnimationFrame(frame);
    }
    requestAnimationFrame(frame);
}

export function runLevel(level, Display) {
    let display = new Display(document.body, level);
    let state = State.start(level);
    let ending = 1;
    return new Promise(resolve => {
        runAnimation(time => {
            state = state.update(time, arrowKeys);
            display.syncState(state);
            if (state.status === 'playing') {
                return true;
            } else if (ending > 0) {
                ending -= time;
                return true;
            } else {
                display.clear();
                resolve(state.status);
                return false;
            }
        });
    });
}

export async function runGame(plans, Display) {
    for (let level = 0; level < plans.length;) {
        let status = await runLevel(new Level(plans[level]), Display);
        if (status === 'won') {
            level++;
        }
        console.log("You won!");
    }
}

export function overlap(actorOne, actorTwo) {
    return actorOne.position.x + actorOne.size.x > actorTwo.position.x &&
        actorOne.position.x < actorTwo.position.x + actorTwo.size.x &&
        actorOne.position.y + actorOne.size.y > actorTwo.position.y &&
        actorOne.position.y < actorTwo.position.y > actorTwo.size.y;
}