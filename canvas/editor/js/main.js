import {elt, pointerPosition, startPixelEditor} from "./utils";
import PictureCanvas from "./elements/canvas";

document.querySelector('.editor').appendChild(startPixelEditor({}));

PictureCanvas.prototype.mouse = function (downEvent, onDown) {
    if(downEvent.button !== 0) {
        return;
    }

    let position = pointerPosition(downEvent, this.dom);
    let onMove = onDown(position);

    if (!onMove) {
        return;
    }
    let move = moveEvent => {
        if (moveEvent.buttons === 0) {
            this.dom.removeEventListener('mousemove', move);
        } else {
            let newPosition = pointerPosition(moveEvent, this.dom);

            if (newPosition.x === position.x && newPosition.y === position.y) {
                return;
            }

            position = newPosition;
            onMove(newPosition);
        }
    };
    this.dom.addEventListener('mousemove', move);
};

PictureCanvas.prototype.touch = function (startEvent, onDown) {
  let position = pointerPosition(startEvent.touches[0], this.dom);
  let onMove = onDown(position);

  startEvent.preventDefault();

  if (!onMove) {
      return;
  }

  let move = moveEvent => {
      let newPosition = pointerPosition(moveEvent.touches[0], this.dom);

      if (newPosition.x === position.x && newPosition.y === position.y) {
          return;
      }

      position = newPosition;
      onMove(newPosition);
  };

  let end = () => {
      this.dom.removeEventListener('touchmove', move);
      this.dom.removeEventListener('touchend', end);
  };

  this.dom.addEventListener('touchmove', move);
  this.dom.addEventListener('touchend', end);
};
