let canvas = document.querySelector('.main-canvas').getContext('2d');
function branch(length, angle, scale) {
    canvas.fillRect(0,0, 1, length);
    if (length < 8) return;

    canvas.save();
    canvas.translate(0, length);
    canvas.rotate(-angle);
    branch(length * scale, angle, scale);
    canvas.rotate(2 * angle);
    branch(length * scale, angle, scale);
    canvas.restore();
}

canvas.translate(300, 0);
branch(60, .5, .8)