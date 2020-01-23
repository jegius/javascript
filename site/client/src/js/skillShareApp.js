import {elt} from "../../../../canvas/editor/js/utils";
import {renderTalk, renderTalkForm, renderUserField} from "./utils";

export default class SkillShareApp {
    constructor(state, dispatch) {
        this.dispatch = dispatch;
        this.talkDOM = elt('div', {className: 'talks'});
        this.dom = elt(
            'div',
            null,
            renderUserField(state.user, dispatch),
            this.talkDOM,
            renderTalkForm(dispatch)
        );
        this.syncState(state);
    }

    syncState(state) {
        if (state.talks !== this.talks) {
            this.talkDOM.textContent = '';

            for (let talk of state.talks) {
                this.talkDOM.appendChild(
                    renderTalk(talk, this.dispatch)
                );
            }
            this.talks = state.talks;
        }
    }
}