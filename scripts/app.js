let canvas = null;
let context = null;
let lastPress = null;
let dir = 0;
let pause = true;
let food = null;
let score = 0;
let wall = new Array();
let gameover = false;
let body = new Array();

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
    // Clean canvas
    context.fillStyle = '#000';
    context.fillRect(0, 0, canvas.width, canvas.height);

    // Draw snake
    context.fillStyle = '#0f0';
    for (i = 0, l = body.length; i < l; i += 1) {
        body[i].fill(context);
    }

    // Draw walls
    context.fillStyle = '#999';
    for (i = 0, l = wall.length; i < l; i += 1) {
        wall[i].fill(context);
    }

    // Draw food
    context.fillStyle = '#f00';
    food.fill(context);

    // Draw score
    context.fillStyle = '#0f0';
    context.fillText('Score: ' + score, 0, 10);

    // Move Body
    for (i = body.length - 1; i > 0; i -= 1) {
        body[i].x = body[i - 1].x;
        body[i].y = body[i - 1].y;
    }

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
    if (!pause) {
    // GameOver Reset
        if (gameover) {
            reset();
        }
        // Out of Srceen
        if (body[0].x > canvas.width) {
            body[0].x = 0;
        }
        if (body[0].x < 0) {
            body[0].x = canvas.width;
        }
        if (body[0].y > canvas.height) {
            body[0].y = 0;
        }
        if (body[0].y < 0) {
            body[0].y = canvas.height;
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

        // Food Intersects
        if (body[0].intersects(food)) {
            body.push(new Rectangle(food.x, food.y, 10, 10));
            score += 1;
            food.x = random(canvas.width / 10 - 1) * 10;
            food.y = random(canvas.height / 10 - 1) * 10;
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
            }
        }

        // Body Intersects
        for (i = 2; i < body.length; i += 1) {
            if (body[0].intersects(body[i])) {
                pause = true;
                gameover = true;
            }
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

const init = () => {
    // Get canvas and context
    canvas = document.getElementById('canvas')
    context = canvas.getContext('2d');

    // Create body[0] and food
    body[0] = new Rectangle(40, 40, 10, 10);
    food = new Rectangle(80, 80, 10, 10);

    // Create walls
    wall.push(new Rectangle(400, 150, 30, 30));
    wall.push(new Rectangle(800, 150, 30, 30));
    wall.push(new Rectangle(400, 350, 30));
    wall.push(new Rectangle(800, 350, 30, 30));

    // Start game
    run();
    repaint();
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

document.addEventListener('keydown',  (evt) => {
    lastPress = evt.which;
    }, false);

