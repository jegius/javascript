import {drawPicture, elt, scale} from "../utils";



export default class PictureCanvas {
    constructor(picture, pointerDown) {
        this.dom = elt('canvas', {
            onmousedown: event => this.mouse(event, pointerDown),
            ontouchstart: event => this.touch(event, pointerDown)
        });
        this.syncState(picture);

    }
    syncState(picture) {
        if (this.picture === picture) {
            return;
        }
        this.picture = picture;
        drawPicture(this.picture, this.dom, scale);
    }
}

