const canvas = document.getElementById('gameboard');
const ctx = canvas.getContext('2d');

function createNewBlock() {
    let block = {
        x: 0,
        y: 0,
        dx: 0,
        dy: 30,
        width: 30,
        height: 30,
        color: 'red'
    };

    return block;
}

let gameState = {
    baseSize: 30,
    columns: 9,
    rows: 10,
    timeStep: 1000,
    activeBlock: undefined,
    allBlocks: [],
    prevBlockDropTime: 0
}



function drawGrid() {
    let columns = gameState.columns;
    let rows = gameState.rows;
    canvas.width = columns * gameState.baseSize;
    canvas.height = rows * gameState.baseSize;

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


function drawBlock(block){
    ctx.fillStyle = block.color;
    ctx.fillRect(block.x, block.y, block.width, block.height);
}

function dropBlock(block) {
    block.y += block.dy;

    // Floor COllision
    if (block.y + block.height > canvas.height) block.y = canvas.height - block.height;
    return block;
}

function slideBlock(block) {
    block.x += block.dx;
    block.dx = 0;

    // Wall Collisions
    if (block.x < 0) block.x = 0;
    if (block.x + block.width > canvas.width) block.x = canvas.width - block.width;
    return block;
}

function moveBlockLeft(block) {
    block.dx = -gameState.baseSize;
    return block;
}

function moveBlockRight(block) {
    block.dx = gameState.baseSize;
    return block;
}

function keyDown(e) {
    if (e.key === 'ArrowLeft') moveBlockLeft(gameState.activeBlock);
    else if (e.key === 'ArrowRight') moveBlockRight(gameState.activeBlock);
}

function gameStart(){
    gameState.prevBlockDropTime = 0;

    gameState.activeBlock = createNewBlock();

    document.addEventListener('keydown', keyDown);
    update();
}

function update(timestamp) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    if (!gameState.prevBlockDropTime) gameState.prevBlockDropTime = timestamp;

    drawGrid();
    drawBlock(gameState.activeBlock);

    slideBlock(gameState.activeBlock);

    let progress = timestamp - gameState.prevBlockDropTime;
    if (progress > gameState.timeStep) {
        dropBlock(gameState.activeBlock);
        gameState.prevBlockDropTime = 0;
    }

    requestAnimationFrame(update);
}

gameStart();