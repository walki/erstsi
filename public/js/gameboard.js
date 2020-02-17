const canvas = document.getElementById('gameboard');
const ctx = canvas.getContext('2d');

function createNewBlock() {
    let startPos = Math.floor(gameState.columns / 2) * gameState.baseSize;
    let block = {
        x: startPos,
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
    inactiveBlocks: [],
    prevBlockDropTime: 0,
    blockMap: [],
    gameOver: false,
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
    if (isNextBlockLocationEmpty(block), 'down')
        block.y += block.dy;
    return block;
}

function slideBlock(block) {

    // Only move if we aren't about to collide
    if ((block.dx > 0 && isNextBlockLocationEmpty(block, 'right')) ||
        (block.dx < 0 && isNextBlockLocationEmpty(block, 'left'))) {
        block.x += block.dx;
    }
    // always reset motion
    block.dx = 0;
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
    gameState.blockMap = generateBlockMap();

    gameState.activeBlock = createNewBlock();
    document.addEventListener('keydown', keyDown);
    update();
}

function generateBlockMap() {
    return Array.from({ length: gameState.columns + 2 }, (v, i) => {
        return Array.from({ length: gameState.rows + 1 }, (v, j) => {
            if (i === 0 || i === gameState.columns + 1)
                return 'wall';
            else if (j === gameState.rows)
                return 'floor';
            else
                return 'empty';
        });
    });
}

function checkForBottomCollision(block) {
    return (block.y + block.height >= canvas.height)
}

function checkInactiveBlocksCollision(block) {
    let coords = mapToGridCoord(block);
    return gameState.blockMap[coords.col][coords.row] !== 'empty';
}

function checkCollision(block) {
    return !isNextBlockLocationEmpty(block, 'down');
}

function mapToGridCoord(block) {
    let coords = {};
    coords.row = Math.floor(block.y / gameState.baseSize);
    coords.col = Math.floor(block.x / gameState.baseSize) + 1;
    return coords;
}

function isNextBlockLocationEmpty(block, dir) {
    let coords = mapToGridCoord(block);
    if (dir === 'left')
        return gameState.blockMap[coords.col - 1][coords.row] === 'empty';
    else if (dir === 'right')
        return gameState.blockMap[coords.col + 1][coords.row] === 'empty';
    else if (dir === 'down')
        return gameState.blockMap[coords.col][coords.row + 1] === 'empty';
    return false;
}

function makeBlockInactive() {
    if (gameState.activeBlock) {
        gameState.activeBlock.dy = 0;

        let coords = mapToGridCoord(gameState.activeBlock);
        gameState.blockMap[coords.col][coords.row] = gameState.activeBlock.color;

        gameState.inactiveBlocks.push(gameState.activeBlock);
        gameState.activeBlock= undefined;
    }
}

function isGameOver() {
    return gameState.blockMap.filter(el => el[0] !== 'empty' && el[0] !== 'wall').length > 0;
}

function renderGameOver() {

    ctx.font = '30px serif';
    ctx.strokeStyle = 'blue'
    ctx.textAlign = 'center';
    ctx.strokeText('Game Over!', canvas.width /2, canvas.height/2, canvas.width);

}

function drawInactiveBlocks() {
    gameState.inactiveBlocks.forEach(b => drawBlock(b));
}

function update(timestamp) {

    if (!gameState.gameOver) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        if (!gameState.prevBlockDropTime) gameState.prevBlockDropTime = timestamp;

        drawGrid();
        drawBlock(gameState.activeBlock);
        drawInactiveBlocks();

        slideBlock(gameState.activeBlock);

        let progress = timestamp - gameState.prevBlockDropTime;
        if (progress > gameState.timeStep) {
            gameState.prevBlockDropTime = 0;

            if (checkCollision(gameState.activeBlock)) {

                makeBlockInactive();
                if (isGameOver()) {
                    renderGameOver();
                    gameState.gameOver = true;
                } else {
                    gameState.activeBlock = createNewBlock();
                }
            } else {
                dropBlock(gameState.activeBlock);
            }
        }
    }

    requestAnimationFrame(update);
}

gameStart();