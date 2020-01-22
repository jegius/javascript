import {elt} from "../utils";

export default class ToolSelect {
    constructor(state, {tools, dispatch}) {
        this.select = elt('select', {
            onchange: () => dispatch({tool: this.select.value})
        }, ...Object.keys(tools).map(name => elt('option', {
            selected: name === state.tool
        }, name)));
        this.dom = elt('label', null, "Инструмент: ", this.select);
    }
    syncState(state) {
        this.select.value = state.tool;
    }
}