const canvas = document.getElementById('drawingCanvas');
const ctx = canvas.getContext('2d');

let painting = false;
let color = '#000000';
let brushSize = 5;
let isErasing = false;
const strokes = [];

const startPosition = (e) => {
    painting = true;
    const stroke = {
        color: isErasing ? '#fff' : color,
        brushSize,
        points: [{ x: e.clientX - canvas.offsetLeft, y: e.clientY - canvas.offsetTop }]
    };
    strokes.push(stroke);
    draw(e);
};

const endPosition = () => {
    painting = false;
    ctx.beginPath();
};

const draw = (e) => {
    if (!painting) return;

    const stroke = strokes[strokes.length - 1];
    const point = { x: e.clientX - canvas.offsetLeft, y: e.clientY - canvas.offsetTop };
    stroke.points.push(point);

    ctx.lineWidth = stroke.brushSize;
    ctx.lineCap = 'round';
    ctx.strokeStyle = stroke.color;

    ctx.lineTo(point.x, point.y);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(point.x, point.y);
};

const redraw = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    strokes.forEach(stroke => {
        ctx.lineWidth = stroke.brushSize;
        ctx.lineCap = 'round';
        ctx.strokeStyle = stroke.color;
        ctx.beginPath();
        stroke.points.forEach((point, index) => {
            if (index === 0) {
                ctx.moveTo(point.x, point.y);
            } else {
                ctx.lineTo(point.x, point.y);
            }
            ctx.stroke();
        });
        ctx.beginPath();
    });
};

canvas.addEventListener('mousedown', startPosition);
canvas.addEventListener('mouseup', endPosition);
canvas.addEventListener('mousemove', draw);

const colorPicker = document.getElementById('colorPicker');
colorPicker.addEventListener('input', (e) => {
    color = e.target.value;
    isErasing = false;
});

const clearButton = document.getElementById('clearButton');
clearButton.addEventListener('click', () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    strokes.length = 0;
});

const saveButton = document.getElementById('saveButton');
saveButton.addEventListener('click', () => {
    const dataURL = canvas.toDataURL('image/png');
    const link = document.createElement('a');
    link.href = dataURL;
    link.download = 'drawing.png';
    link.click();
});

const eraserButton = document.getElementById('eraserButton');
eraserButton.addEventListener('click', () => {
    isErasing = true;
});

const undoButton = document.getElementById('undoButton');
undoButton.addEventListener('click', () => {
    strokes.pop();
    redraw();
});

const brushSizeSelect = document.getElementById('brushSize');
brushSizeSelect.addEventListener('change', (e) => {
    brushSize = e.target.value;
});
