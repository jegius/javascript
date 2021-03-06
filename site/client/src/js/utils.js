import {elt} from "../../../../canvas/editor/js/utils";
import SkillShareApp from "./skillShareApp";

const baseUrl = 'http://localhost:8000';

export const defaultHeaders = {
    'Content-Type': 'text/plain',
};

export function handleAction(state, action) {
    if (action.type === 'setUser') {
        localStorage.setItem('userName', action.user);
        return Object.assign({}, state, {talks: action.talks});
    } else if (action.type === 'setTalks') {
        return Object.assign({}, state, {talks: action.talks});
    } else if (action.type ===  'newTalk') {
        fetchOk(talkURL(action.title), {
            method: 'PUT',
            headers: defaultHeaders,
            body: JSON.stringify({
                presenter: state.user,
                summary: action.summary
            })
        }).catch(reportError);
    } else if (action.type === 'deleteTalk') {
        fetchOk(talkURL(action.talk), {method: 'DELETE'})
            .catch(reportError);
    } else if (action.type === 'newComment') {
        fetchOk(talkURL(action.talk) + '/comments', {
            method: 'POST',
            headers: defaultHeaders,
            body: JSON.stringify({
                author: state.user,
                message: action.message
            })
        }).catch(reportError);
    }
    return state;
}

function fetchOk(url, option) {
    return fetch(baseUrl + url, option).then(response => {
        if (response.status < 400) {
            return response;
        } else {
            throw new Error(response.statusText);
        }
    })
}

function talkURL(title) {
    return '/talks/' + encodeURIComponent(title);
}

function reportError(error) {
    console.log(String(error));
}

export function renderUserField(name, dispatch) {
    return elt(
        'label',
        {},
        'Your name: ',
        elt(
            'input',
            {
                type: 'text',
                value: name,
                onchange(event) {
                    dispatch({
                        type: 'setUser',
                        user: event.target.value
                    })
                }
            }
        )
    )
}

export function renderTalk(talk, dispatch) {
    return elt(
        'section',
        {className: 'talk'},
        elt(
            'h2',
            null,
            talk.title,
            ' ',
            elt(
                'button',
                {
                    type: 'button',
                    onclick(){
                        dispatch({
                            type: 'deleteTalk',
                            talk: talk.title
                        })
                    }
                }, 'Delete'
            )),
        elt(
            'div',
            null,
            'by ',
            elt(
                'strong',
                null,
                talk.presenter
            )
        ),
        elt(
            'p',
            null,
            talk.summary
            ),
        ...talk.comments.map(renderComment),
        elt(
            'form',
            {
                onsubmit(event) {
                    event.preventDefault();
                    let form = event.target;
                    dispatch(
                        {
                            type: 'newComment',
                            talk: talk.title,
                            message: form.elements.comment.value
                        }
                    );
                    form.reset();
                }
            }, elt(
                'input',
                {type: 'text', name: 'comment'}
                ), ' ',
            elt(
                'button',
                {type: 'submit'},
                'Add comment'
            )
        )
    )
}

function renderComment(comment) {
    return elt('p',
        {className: 'comment'},
            elt(
                'strong',
                null,
                comment.author
            ),
        ': ', comment.message
        );
}

export function renderTalkForm(dispatch) {
    let title = elt('input', {type: 'text'});
    let summary = elt('input', {type: 'text'});

    return elt(
        'form',
        {
            onsubmit(event) {
                event.preventDefault();
                dispatch({
                    type: 'newTalk',
                    title: title.value,
                    summary: summary.value
                });
                event.target.reset();
            }
        },
        elt('h3', null, 'Submit a talk'),
        elt('label', null, 'Title: ', title),
        elt('label', null, 'Summary: ', summary),
        elt('button', {type: 'submit'}, 'Submit')
    );
}

export async function pollTalks(update) {
    let tag = undefined;
    for (;;) {
        let response;

        try {
            response = await fetchOk('/talks', {
                headers: tag && {
                    'If-None-Match': tag,
                    'Prefer': 'wait=90'
                }
            });
        } catch (e) {
            console.log('Request failed: ' + e);
            await new Promise(resolve => setTimeout(resolve, 500));
            continue;
        }

        if (response.status === 304) {
            continue;
        }

        tag = response.headers.get('ETag');
        update(await response.json())
    }
}

export function runApp() {
    let user = localStorage.getItem('userName') || 'Anon';
    let state;
    let app;

    function dispatch(action) {
        state = handleAction(state, action);
        app.syncState(state);
    }

    pollTalks(talks => {
        if (!app) {
            state = {user, talks};
            app = new SkillShareApp(state, dispatch);
            document.body.appendChild(app.dom);
        } else {
            dispatch({
                type: 'setTalks',
                talks
            })
        }
    }).catch(reportError);
}