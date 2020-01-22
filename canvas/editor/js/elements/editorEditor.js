import {elt} from "../utils";
import PictureCanvas from "./canvas";

export default class PixelEditor {
    constructor(state, config) {
        let {tools, controls, dispatch} = config;
        this.state = state;

        this.canvas = new PictureCanvas(state.picture, position => {
            let tool = tools[this.state.tool];
            let onMove = tool(position, this.state, dispatch);

            if (onMove){
                return position => onMove(position, this.state);
            }
        });
        this.controls = controls.map(Control => new Control(state, config));
        this.dom = elt(
            'div',
            {},
            this.canvas.dom,
            elt('br'),
            ...this.controls.reduce((a, c) => a.concat(' ', c.dom), [])
        );
    }

    syncState(state) {
        this.state = state;
        this.canvas.syncState(state.picture);
        for (let ctrl of this.controls) {
            ctrl.syncState(state);
        }
    }
}