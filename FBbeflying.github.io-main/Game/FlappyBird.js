const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');




const bird = {

    x: 50,
    y: canvas.height / 2,
    radius: 10, // Kleinere grootte
    velocity: 0,
    gravity: 0.5,
    jump: -5
};

const pipeWidth = 50;
const pipeGap = 315;
let pipes = [];
let isGameOver = false;
let isGameStarted = false;
let score = 0;

function drawBird() {
    ctx.beginPath();
    ctx.arc(bird.x, bird.y, bird.radius, 0, Math.PI * 2);
    ctx.fillStyle = 'yellow';
    ctx.fill();
    ctx.closePath();
}

function updateBird() {
    bird.velocity += bird.gravity;
    bird.y += bird.velocity;

    if (bird.y > canvas.height - bird.radius) {
        bird.y = canvas.height - bird.radius;
        bird.velocity = 0;
    }

    if (bird.y < bird.radius) {
        bird.y = bird.radius;
        bird.velocity = 0;
    }
}


function drawPipe(x, height) {
    ctx.fillStyle = 'green';
    ctx.fillRect(x, 0, pipeWidth, height);
    ctx.fillRect(x, height + pipeGap, pipeWidth, canvas.height - height - pipeGap);
}

function updatePipes() {
    for (let i = 0; i < pipes.length; i++) {
        pipes[i].x -= 2; // Adjust pipe speed

        if (pipes[i].x + pipeWidth <= 0) {
            pipes.shift();
            score++;
        }
    }

    if (frames % 100 === 0) {
        const minHeight = 140 ;
        const maxHeight = canvas.height - pipeGap - minHeight;
        const height = Math.floor(Math.random() * (maxHeight - minHeight + 1) + minHeight);
        pipes.push({ x: canvas.width, height });
    }
}

function checkCollision() {
    for (let i = 0; i < pipes.length; i++) {
        if (
            bird.x + bird.radius > pipes[i].x &&
            bird.x - bird.radius < pipes[i].x + pipeWidth &&
            (bird.y - bird.radius < pipes[i].height || bird.y + bird.radius > pipes[i].height + pipeGap)
        ) {
            isGameOver = true;
        }
    }

    if (bird.y + bird.radius > canvas.height || bird.y - bird.radius < 0) {
        isGameOver = true;
    }
}

function drawScore() {
    ctx.fillStyle = 'black';
    ctx.font = '24px Arial';
    ctx.fillText('Score: ' + score, 10, 30);
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (!isGameStarted) {
        ctx.fillStyle = 'black';
        ctx.font = '24px Arial';
        ctx.fillText('Press Space to Start', canvas.width / 2 - 120, canvas.height / 2);
    } else if (!isGameOver) {
        drawBird();
        updateBird();

        updatePipes();
        pipes.forEach(pipe => drawPipe(pipe.x, pipe.height));

        checkCollision();
        drawScore();
    } else {
        ctx.fillStyle = 'red';
        ctx.font = '40px Arial';
        ctx.fillText('Game Over!', canvas.width / 2 - 120, canvas.height / 2);
        ctx.fillText('Score: ' + score, canvas.width / 2 - 80, canvas.height / 2 + 40);
        ctx.fillText('Press Space to Restart', canvas.width / 2 - 160, canvas.height / 2 + 80);
    }

    requestAnimationFrame(draw);
}

let frames = 0;
draw();

window.addEventListener('keydown', function(e) {
    if (e.code === 'Space') {
        if (!isGameStarted || isGameOver) {
            isGameStarted = true;
            isGameOver = false;
            score = 0;
            pipes = [];
            bird.y = canvas.height / 2;
            bird.velocity = 0;
        } else {
            bird.velocity = bird.jump;
        }
    }
    
});





