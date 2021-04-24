let canvas = null;
let context = null;
let lastPress = null;
let dir = 1;
let pause = true;
let food = null;
let score = 0;
let wall = new Array();
let gameover = false;
let body = new Array();

const viewportWidth = window.innerWidth;
const viewportHeight = window.innerHeight;
const aEat = new Audio();
const aDie = new Audio();
const iBody = new Image();
const iFood = new Image();
const KEY_LEFT = 37;
const KEY_UP = 38;
const KEY_RIGHT = 39;
const KEY_DOWN = 40;
const KEY_ENTER = 13;

window.requestAnimationFrame = (function () {
    return window.requestAnimationFrame ||
    window.mozRequestAnimationFrame ||
    window.webkitRequestAnimationFrame ||
    function (callback) {
    window.setTimeout(callback, 17);
    };
}());

const paint = (context) => {
    let i = 0;
    // Clean canvas
    context.fillStyle = '#000';
    context.fillRect(0, 0, canvas.width, canvas.height);

    // Draw player
    // context.fillStyle = '#0f0';
    for (i = 0; i < body.length; i += 1) {
        // body[i].fill(context);
        context.drawImage(iBody, body[i].x, body[i].y);
    }

    // Draw walls
    context.fillStyle = '#999';
    for (i = 0; i < wall.length; i += 1) {
        wall[i].fill(context);
    }

    // Draw food
    // context.fillStyle = '#f00';
    // food.fill(context);
    context.drawImage(iFood, food.x, food.y);

    // Draw score
    context.fillStyle = '#0f0';
    context.fillText('Score: ' + score, 0, 10);

    // Draw pause
    if (pause) {
        context.fillStyle = '#0f0';
        context.textAlign = 'center';

        if (gameover) {
            context.fillText('GAME OVER', (canvas.width / 2) - 5, (canvas.height / 2) - 5);
        } else {
            context.fillText('PAUSE', (canvas.width / 2) - 5, (canvas.height / 2) - 5);
        }
            context.textAlign = 'left';
    }
}


const reset = () => {
    score = 0;
    dir = 1;
    body.length = 0;
    body.push(new Rectangle(40, 40, 10, 10));
    body.push(new Rectangle(0, 0, 10, 10));
    body.push(new Rectangle(0, 0, 10, 10));
    food.x = random(canvas.width / 10 - 1) * 10;
    food.y = random(canvas.height / 10 - 1) * 10;
    gameover = false;
}

const act = () => {
    let i = 0;

    if (!pause) {
        // GameOver Reset
        if (gameover) {
            reset();
        }

        // Move Body
        for (i = body.length - 1; i > 0; i -= 1) {
            body[i].x = body[i - 1].x;
            body[i].y = body[i - 1].y;
        }

        // Change Direction
        if (lastPress == KEY_UP && dir != 2) {
            dir = 0;
        }
        if (lastPress == KEY_RIGHT && dir != 3) {
            dir = 1;
        }
        if (lastPress == KEY_DOWN && dir != 0) {
            dir = 2;
        }
        if (lastPress == KEY_LEFT && dir != 1) {
            dir = 3;
        }

        // Move Head
        if (dir == 0) {
            body[0].y -= 10;
        }
        if (dir == 1) {
            body[0].x += 10;
        }
        if (dir == 2) {
            body[0].y += 10;
        }
        if (dir == 3) {
            body[0].x -= 10;
        }

        // Out Screen
        if (body[0].x > canvas.width - body[0].width) {
            body[0].x = 0;
        }
        if (body[0].y > canvas.height - body[0].height) {
            body[0].y = 0;
        }
        if (body[0].x < 0) {
            body[0].x = canvas.width - body[0].width;
        }
        if (body[0].y < 0) {
            body[0].y = canvas.height - body[0].height;
        }

        // Wall Intersects
        for (i = 0; i < wall.length; i += 1) {
            if (food.intersects(wall[i])) {
                food.x = random(canvas.width / 10 - 1) * 10;
                food.y = random(canvas.height / 10 - 1) * 10;
            }
            if (body[0].intersects(wall[i])) {
                pause = true;
                gameover = true;
                aDie.play();
            }
        }

        // Body Intersects
        for (i = 2; i < body.length; i += 1) {
            if (body[0].intersects(body[i])) {
                gameover = true;
                pause = true;
            }
        }

        // Food Intersects
        if (body[0].intersects(food)) {
            body.push(new Rectangle(food.x, food.y, 10, 10));
            score += 1;
            food.x = random(canvas.width / 10 - 1) * 10;
            food.y = random(canvas.height / 10 - 1) * 10;
            aEat.play();
        }
    }
    // Pause/Unpause
    if (lastPress == KEY_ENTER) {
        pause = !pause;
        lastPress = null;
    }
}

const random = (max) => {
    return Math.floor(Math.random() * max);
}

const repaint = () => {
    window.requestAnimationFrame(repaint);
    paint(context);
}

const run = () => {
    setTimeout(run, 50);
    act();
}

const canvasResize = () => {
    canvas.height = viewportHeight * 0.7;
    canvas.width = viewportWidth * 0.8;
}

const init = () => {
    // Get canvas and context
    canvas = document.getElementById('canvas')
    context = canvas.getContext('2d');

    // Create body[0] and food
    body[0] = new Rectangle(40, 40, 10, 10);
    body.push(new Rectangle(30, 40, 10, 10));
    body.push(new Rectangle(20, 40, 10, 10));
    food = new Rectangle(80, 80, 10, 10);

    // Create walls
    wall.push(new Rectangle(400, 150, 30, 30));
    wall.push(new Rectangle(800, 150, 30, 30));
    wall.push(new Rectangle(400, 350, 30));
    wall.push(new Rectangle(800, 350, 30, 30));

    // Start game
    run();
    repaint();

    // Load assets
    iBody.src = '../assets/body.png';
    iFood.src = '../assets/fruit.png';
    aEat.src = '../assets/chomp.oga';
    aDie.src = '../assets/dies.oga';

    canvasResize();
}

function Rectangle (x, y, width, height) {
    this.x = (x == null) ? 0 : x;
    this.y = (y == null) ? 0 : y;
    this.width = (width == null) ? 0 : width;
    this.height = (height == null) ? this.width : height;
    this.intersects = (rect) => {
    if (rect == null) {
        window.console.warn('Missing parameters on function intersects');
    } else {
        return (this.x < rect.x + rect.width &&
            this.x + this.width > rect.x &&
            this.y < rect.y + rect.height &&
            this.y + this.height > rect.y);
        }
    };
    this.fill = (context) => {
        if (context == null) {
            window.console.warn('Missing parameters on function fill');
        }
        else {
            context.fillRect(this.x, this.y, this.width, this.height);
        }
    };
}

window.addEventListener('load', init, false);

console.log(viewportWidth);
console.log(viewportHeight);

document.addEventListener('keydown',  (evt) => {
    lastPress = evt.which;
}, false);

window.onresize = canvasResize;
