const myfunction = () => {
    alert ("hola")
}
let canvas = null;
let context = null;

const paint = (context) => {
    context.fillStyle = '#0f0';
    context.fillRect(50, 50, 100, 60);
}

const init = () => {
    canvas = document.getElementById('canvas')
    context = canvas.getContext('2d');
    paint(context);
}
window.addEventListener('load', init, false);

