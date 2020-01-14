import {scale} from "../index";

export function elt(name, attrs, ...children) {
    let dom = document.createElement(name);
    for (let attr of Object.keys(attrs)) {
        dom.setAttribute(attr, attrs[attr]);
    }

    for (let child of children) {
        dom.appendChild(child)
    }

    return dom;
}

export function drawActors(actors) {
    return elt('div', {}, ...actors.map(actor => {
        let rect = elt('div', {class: `actor ${actor.type}`});
        rect.style.width = `${actor.size.x * scale}px`;
        rect.style.height = `${actor.size.y * scale}px`;
        rect.style.left = `${actor.position.x * scale}px`;
        rect.style.top = `${actor.position.y * scale}px`;
        return rect;
    }))
}

export function drawGrid(level) {
    return elt('table', {
        class: 'background',
        style: `width: ${level.width * scale}px`
    }, ...level
        .rows
        .map(row => elt('tr', {style: `height: ${scale}px`},
                ...row.map(type => elt('td', {class: type})))
        ));
}

export class DOMDisplay {
    constructor(parent, level) {
        this.dom = elt('div', {class: 'game'}, drawGrid(level));
        this.actorLayer = null;
        parent.appendChild(this.dom);
    }

    clear() {
        this.dom.remove()
    }
}
