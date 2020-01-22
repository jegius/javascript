import {elt} from "../utils";

export default class UndoButton {
    constructor(state, {dispatch}) {
        this.dom = elt('button', {
            onclick: () => dispatch({undo: true}),
            disabled: state.done.length === 0
        }, 'Отменить');
    }
    syncState(state) {
        this.dom.disabled = state.done.length === 0;
    }
}