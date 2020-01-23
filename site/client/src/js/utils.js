export function handleAction(state, action) {
    if (action.type === 'setUser') {
        localStorage.setItem('userName', action.user);
        return Object.assign({}, state, {talks: action.talks});
    } else if (action.type === 'setTalks') {
        return Object.assign({}, state, {talks: action.talks});
    } else if (action.type ===  'newTalk') {
        fetchOk(talkURL(action.title), {
            method: 'PUT',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                presenter: state.user,
                summary: action.summary
            })
        }).catch(reportError);
    } else if (action.type === 'deleteTalk') {
        fetchOk(talkURL(action.talk) + '/comments', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                author: state.user,
                message: action.message
            })
        }).catch(reportError)
    }
    return state;
}

function fetchOk(url, option) {
    return fetch(url, option).then(response => {
        if (response.status < 400) {
            return response;
        } else {
            throw new Error(response.statusText);
        }
    })
}

function talkURL(title) {
    return 'talks/' + encodeURIComponent(title);
}

function reportError(error) {
    console.log(String(error));
}