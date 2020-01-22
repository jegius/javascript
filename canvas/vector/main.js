const results = [
    {name: 'Удовлетворен', count: 1043, color: 'lightblue'},
    {name: 'Нормально', count: 563, color: 'lightgreen'},
    {name: 'Не удовлетворен', count: 510, color: 'pink'},
    {name: 'Без комментариев', count: 175, color: 'silver'}
];

let canvas = document.querySelector('.main-canvas').getContext('2d');
let total = results.reduce((sum, {count}) => sum + count, 0);

let currentAngle = -0.5 * Math.PI;

for (let result of results) {
    let sliceAngle = (result.count / total) * 2 * Math.PI;
    canvas.beginPath();

    canvas.arc(100, 100, 100, currentAngle, currentAngle + sliceAngle);
    currentAngle += sliceAngle;
    canvas.lineTo(100, 100);
    canvas.fillStyle = result.color;
    canvas.fill();
}
