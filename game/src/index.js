import {overlap, runGame, Vec} from "./utils";
import {simpleLevelPlan} from "./source/levels";
import {DOMDisplay, drawActors} from "./core/display";
import {Coin} from "./core/coin";
import {State} from "./core/state";
import {Player} from "./core/player";
import {Level} from "./core/level";
import {Lava} from "./core/lava";

const wobbleSpeed = 8;
const wobbleDist = 0.007;
export const scale = 20;

Coin.prototype.size = new Vec(0.6, 0.6);

Coin.prototype.collide = function (state) {
    let filtered = state.actors.filter(actor => actor !== this);
    let status = state.status;

    if (!filtered.some(actor => actor.type === 'coin')) {
        status = 'won';
    }
    return new State(state.level, filtered, status);
};

Coin.prototype.update = function (time) {
    let wobble = this.wobble + time * wobbleSpeed;
    let wobblePosition = Math.sin(wobble) * wobbleDist;
    return new Coin(this.basePosition.plus(new Vec(0, wobblePosition)), this.basePosition, wobble)
};

State.prototype.update = function (time, keys) {
    let actors = this
        .actors
        .map(actor => actor.update(time, this, keys));
    let newState = new State(this.level, actors, this.status);

    if (newState.status !== 'playing') {
        return newState;
    }

    let player = newState.player;

    if (this.level.touches(player.position, player.size, 'lava')){
        return new State(this.level, actors, 'lost');
    }

    for (let actor of actors) {
        if (actor !== player && overlap(actor, player)) {
            newState = actor.collide(newState)
        }
    }
    return newState;
};

const playerXSpeed = 7;
const gravity = 30;
const jumpSpeed = 17;

Player.prototype.size = new Vec(0.8, 1.5);

Player.prototype.update = function (time, state, keys) {
    let xSpeed = 0;
    if (keys.ArrowLeft) {
        xSpeed -= playerXSpeed;
    }
    if (keys.ArrowRight) {
        xSpeed += playerXSpeed;
    }

    let position = this.position;
    let movedX = position.plus(new Vec(xSpeed * time, 0));
    if (!state.level.touches(movedX, this.size, 'wall')) {
        position = movedX;
    }

    let ySpeed = this.speed.y + time * gravity;
    let movedY = position.plus(new Vec(0, ySpeed * time));
    if (!state.level.touches(movedY, this.size, 'wall')) {
        position = movedY;
    } else if (keys.ArrowUp && ySpeed > 0) {
        ySpeed = -jumpSpeed;
    } else {
        ySpeed = 0;
    }

    return new Player(position, new Vec(xSpeed, ySpeed));
};

Level.prototype.touches = function (position, size, type) {
    let xStart = Math.floor(position.x);
    let xEnd = Math.ceil(position.x + size.x);
    let yStart = Math.floor(position.y);
    let yEnd = Math.ceil(position.y + size.y);

    for (let y = yStart; y < yEnd; y++) {
        for (let x = xStart; x < xEnd; x++) {
            let isOutside = x < 0 ||
                x >= this.width ||
                y < 0 ||
                y >= this.height;

            let here = isOutside ? 'wall' : this.rows[y][x];

            if (here === type) {
                return true;
            }
        }
    }
    return false;
};

Lava.prototype.size = new Vec(1, 1);

Lava.prototype.collide = function (state) {
    return new State(state.level, state.actors, 'lost');
};

Lava.prototype.update = function (time, state) {
    let newPosition = this.position.plus(this.speed.times(time));
    if (!state.level.touches(newPosition, this.size, 'wall')) {
        return new Lava(newPosition, this.speed, this.reset);
    } else if (this.reset) {
        return new Lava(this.reset, this.speed, this.reset);
    } else {
        return new Lava(this.position, this.speed.times(-1))
    }
};

DOMDisplay.prototype.syncState = function (state) {
    if (this.actorLayer) {
        this.actorLayer.remove();
    }

    this.actorLayer = drawActors(state.actors);
    this.dom.appendChild(this.actorLayer);
    this.dom.className = `game  ${state.status}`;
    this.scrollPlayerIntoView(state);
};

DOMDisplay.prototype.scrollPlayerIntoView = function (state) {
    let width = this.dom.clientWidth;
    let height = this.dom.clientHeight;
    let margin = width / 3;

    let left = this.dom.scrollLeft;
    let right = left + width;
    let top = this.dom.scrollTop;
    let bottom = top + height;

    let player = state.player;
    let center = player
        .position
        .plus(player.size.times(0.5)).times(scale);

    if (center.x < left + margin) {
        this.dom.scrollLeft =  center.x - margin;
    } else if (center.x > right - margin) {
        this.dom.scrollLeft = center.x + margin - width;
    }
    if (center.y < top + margin) {
        this.dom.scrollTop = center.y - margin;
    } else if(center.y > bottom - margin) {
        this.dom.scrollTop = center.y + margin - height;
    }
};

runGame([simpleLevelPlan], DOMDisplay);