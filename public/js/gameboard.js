const canvas = document.getElementById('gameboard');
const ctx = canvas.getContext('2d');

const baseSize = 30;
let block = {
    x: 0,
    y: 0,
    dx: 0,
    dy: baseSize,
    width: baseSize,
    height: baseSize,
    color: 'red'
};

let gameState = {
    baseSize: 30,
    columns: 9,
    rows: 30,
    timeStep: 1000
}

function drawGrid() {
    let colWidth = baseSize;
    let rowHeight = baseSize;
    let columns = gameState.columns;
    let rows = gameState.rows;
    canvas.width = columns * colWidth;
    canvas.height = rows * rowHeight;

    let gridColor = 'rgb(210,200,200)';
    let gridLineWidth = 1;

    const getWidth = (x) => Math.floor(x *  canvas.width / columns);
    let getHeight = (y) => Math.floor( y *canvas.height / rows);


    for (let x = 1; x < columns; x++){
        ctx.beginPath();
        ctx.moveTo(getWidth(x), 0);
        ctx.lineTo(getWidth(x), canvas.height);
        ctx.strokeStyle = gridColor;
        ctx.lineWidth = gridLineWidth;
        ctx.stroke();
    }

    for (let y = 1; y < rows; y++){
        ctx.beginPath();
        ctx.moveTo(0, getHeight(y));
        ctx.lineTo(canvas.width, getHeight(y));
        ctx.strokeStyle = gridColor;
        ctx.lineWidth = gridLineWidth;
        ctx.stroke();
    }
}


function drawBlock(){
    ctx.fillStyle = block.color;
    ctx.fillRect(block.x, block.y, block.width, block.height);
}

function setBlockPosition() {
    block.x += block.dx;
    block.y += block.dy;
}

let prev = 0;
function update(timestamp) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    if (!prev) prev = timestamp;

    drawGrid();
    drawBlock();

    let progress = timestamp - prev;
    if (progress > gameState.timeStep) {
        setBlockPosition();
        prev = 0;
    }
    requestAnimationFrame(update);
}

update();