const myfunction = () => {
    alert ("hola")
}


let canvas = null;
let context = null;
let x = 50;
let y = 50;


const paint = (context) => {
    context.fillStyle = '#000';
    context.fillRect(0, 0, canvas.width, canvas.height);
    context.fillStyle = '#0f0';
    context.fillRect(x, y, 10, 10);
}

const act = () => {
    x += 5;
    if (x > canvas.width) {
        x = 0;
        }
}

const run = () => {
    window.requestAnimationFrame(run);
    act();
    paint(context);
}

const init = () => {
    canvas = document.getElementById('canvas')
    context = canvas.getContext('2d');
    run();
}

window.addEventListener('load', init, false);



