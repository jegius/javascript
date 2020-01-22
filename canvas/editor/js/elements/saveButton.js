import {drawPicture, elt} from "../utils";

export default class SaveButton {
    constructor(state) {
        this.picture = state.picture;
        this.dom = elt('button', {
            onclick: () => this.save()
        }, 'Сохранить');
    }

    save() {
        let canvas = elt('canvas');
        drawPicture(this.picture, canvas, 1);
        let link = elt('a', {
            href: canvas.toDataURL(),
            download: 'pixelart.png'
        });
        document.body.appendChild(link);
        link.click();
        link.remove();
    }

    syncState(state) {
        this.picture = state.picture;
    }
}