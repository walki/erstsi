const canvas = document.getElementById('gameboard');
const ctx = canvas.getContext('2d');

function drawGrid() {
    let colWidth = 30;
    let rowHeight = 30;
    let columns = 9;
    let rows = 20;
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

drawGrid();