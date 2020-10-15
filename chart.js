const chart = document.querySelector('.chart');

const canvas = document.createElement('canvas');
canvas.width = 126;
canvas.height = 126;

chart.appendChild(canvas);
const ctx = canvas.getContext("2d");
ctx.font = "30px sans-serif";
ctx.fillStyle = "white";
ctx.lineWidth = 8 ;
ctx.textAlign = 'center';
ctx.textBaseline = 'middle';

const R = 57.5;

function drawCircle(color,ratio,anticlockwise){
    ctx.strokeStyle = color ;
    let startAngel = 1.5 * Math.PI
    ctx.beginPath();
    ctx.arc(canvas.width/2,canvas.height/2,R, startAngel , startAngel + 2 * ratio * Math.PI , anticlockwise);
    ctx.stroke();
}

function updateChart(income,outcome){
    ctx.clearRect(0,0, canvas.width , canvas.height);
    let ratio = income / (income + outcome);

    ctx.fillText(`${isNaN(ratio) ? 0 : (ratio * 100).toFixed(0)}%`,canvas.width / 2, canvas.height / 2);
    drawCircle('#FFFFFF',  ratio , false);
    drawCircle('rgba(255,255,255,.15)', ratio , true)

    
}