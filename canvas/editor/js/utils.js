import Picture from "./elements/pcture";
import ToolSelect from "./elements/toolSelect";
import ColorSelect from "./elements/colorSelect";
import SaveButton from "./elements/saveButton";
import LoadButton from "./elements/loadButton";
import UndoButton from "./elements/UndoButton";
import PixelEditor from "./elements/editorEditor";

export const scale = 10;
export const startState = {
  tool: 'draw',
  color: '#000000',
  picture: Picture.empty(60, 30, '#f0f0f0'),
  done: [],
  doneAt: 0
};

const baseTools = {draw, fill, rectangle, pick};

const baseControls = [
    ToolSelect,
    ColorSelect,
    SaveButton,
    LoadButton,
    UndoButton
];

export function startPixelEditor({
    state = startState,
    tools = baseTools,
    controls = baseControls
                                 }) {
    let app = new PixelEditor(state, {
        tools,
        controls,
        dispatch(action) {
            state = historyUpdateState(state, action);
            app.syncState(state);
        }
    });
    return app.dom;
}

export function elt(type, props, ...children) {
    let dom = document.createElement(type);

    if (props) {
        Object.assign(dom, props);
    }

    for (let child of children) {
        typeof  child !== 'string' ?
            dom.appendChild(child) :
            dom.appendChild(document.createTextNode(child))
    }

    return dom;
}

export function drawPicture(picture, canvas, scale) {
    canvas.width = picture.width * scale;
    canvas.height = picture.height * scale;
    let cx = canvas.getContext('2d');

    for (let y = 0; y < picture.height; y++) {
        for (let x = 0; x < picture.width; x++) {
            cx.fillStyle = picture.pixel(x, y);
            cx.fillRect(x * scale, y * scale, scale, scale);
        }
    }
}

export function pointerPosition(position, domNode) {
    let rect = domNode.getBoundingClientRect();

    return {
        x: Math.floor((position.clientX - rect.left) / scale),
        y: Math.floor((position.clientY - rect.top) / scale),
    }
}

export function draw(position, state, dispatch) {
    function drawPixel({x, y}, state) {
        let drawn = {x, y, color: state.color};
        dispatch({picture: state.picture.draw([drawn])})
    }
    drawPixel(position, state);
    return drawPixel;
}

export function rectangle(start, state, dispatch) {
    function drawRectangle(pos) {
        let xStart = Math.min(start.x, pos.x);
        let yStart = Math.min(start.y, pos.y);
        let xEnd = Math.max(start.x, pos.x);
        let yEnd = Math.max(start.y, pos.y);
        let drawn = [];
        
        for (let y = yStart; y <= yEnd; y++) {
            for (let x = xStart; x <= xEnd; x++) {
                drawn.push({x, y, color: state.color});
            } 
        } 
        dispatch({picture: state.picture.draw(drawn)});
    }
    drawRectangle(start);
    return drawRectangle;
}

const around = [
    {dx: -1, dy: 0},
    {dx: 1, dy: 0},
    {dx: 0, dy: -1},
    {dx: 0, dy: 1},
];

export function fill({x, y}, state, dispatch) {
    let targetColor = state.picture.pixel(x, y);
    
    let drawn = [{x, y, color: state.color}];
    for (let done = 0; done < drawn.length; done++) {
        for (let {dx, dy} of around) {
            let x = drawn[done].x + dx;
            let y = drawn[done].y + dy;

            if (
                x >= 0 &&
                x < state.picture.width &&
                y >= 0 &&
                y < state.picture.height &&
                state.picture.pixel(x, y) === targetColor &&
                !drawn.some(p => p.x === x && p.y === y)
            )  {
                drawn.push({x, y, color: state.color});
            }
        }
    }
    dispatch({picture: state.picture.draw(drawn)})
}

export function pick(pos, state, dispatch) {
    dispatch({color: state.picture.pixel(pos.x, pos.y)});
}

export function startLoad(dispatch) {
    let input = elt('input', {
        type: 'file',
        onchange: () => finishLoad(input.files[0], dispatch)
    });
    document.body.appendChild(input);
    input.click();
    input.remove();
}

function finishLoad(file, dispatch) {
    if (file === null) {
        return;
    }

    let reader = new FileReader();
    reader.addEventListener('load', () => {
        let image = elt('img', {
            onload: () => dispatch({
                picture: pictureFromImage(image)
            }),
            src: reader.result
        })
    });
    reader.readAsDataURL(file)
}

function pictureFromImage(image) {
    let width = Math.min(100, image.width);
    let height = Math.min(100, image.height);
    let canvas = elt('canvas', {width, height});
    let cx = canvas.getContext('2d');
    cx.drawImage(image, 0, 0);

    let pixels = [];
    let {data} = cx.getImageData(0, 0, width, height);

    function hex(n) {
        return n.toString(16).padStart(2, '0');
    }

    for (let i = 0; i < data.length; i += 4) {
        let [r, g, b] = data.slice(i, i + 3);
        pixels.push('#' + hex(r) + hex(g) + hex(b));
    }

    return new Picture(width, height, pixels);
}

export function historyUpdateState(state, action) {
    if (action.undo) {
        if (state.done.length === 0) {
            return state;
        }
        return Object.assign({}, state, {
            picture: state.done[0],
            done: state.done.slice(1),
            doneAt: 0
        });
    } else if (
        action.picture &&
        state.doneAt < Date.now() - 1000
    ) {
        return Object.assign({}, state, action, {
            done: [state.picture, ...state.done],
            doneAt: Date.now()
        });
    } else {
        return Object.assign({}, state, action);
    }
}