import {elt, startLoad} from "../utils";

export default class LoadButton {
    constructor(_, {dispatch}) {
        this.dom = elt('button', {
            onclick: () => startLoad(dispatch)
        }, 'Загрузить');
    }

    syncState() {}
}