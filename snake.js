const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');
const grid = 20;
let snake, apple, count, speed, running, gameOver;
const minSpeed = 2, maxSpeed = 15;

function resetGame() {
    snake = { x: 160, y: 160, dx: grid, dy: 0, cells: [], maxCells: 4 };
    apple = { x: getRandomInt(0, 20) * grid, y: getRandomInt(0, 20) * grid };
    count = 0;
    running = true;
    gameOver = false;
    document.getElementById('gameOverMsg').style.display = 'none';
}

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}

function gameLoop() {
    if (!running) return;
    requestAnimationFrame(gameLoop);
    if (++count < speed) return;
    count = 0;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    snake.x += snake.dx;
    snake.y += snake.dy;
    // 벽에 부딪히면 게임 오버
    if (
        snake.x < 0 || snake.x >= canvas.width ||
        snake.y < 0 || snake.y >= canvas.height
    ) {
        running = false;
        gameOver = true;
        document.getElementById('gameOverMsg').style.display = 'block';
        return;
    }
    snake.cells.unshift({ x: snake.x, y: snake.y });
    if (snake.cells.length > snake.maxCells) snake.cells.pop();
    ctx.fillStyle = 'red';
    ctx.fillRect(apple.x, apple.y, grid-2, grid-2);
    ctx.fillStyle = '#0f0';
    snake.cells.forEach((cell, idx) => {
        ctx.fillRect(cell.x, cell.y, grid-2, grid-2);
        if (cell.x === apple.x && cell.y === apple.y) {
            snake.maxCells++;
            apple.x = getRandomInt(0, 20) * grid;
            apple.y = getRandomInt(0, 20) * grid;
        }
        for (let i = idx + 1; i < snake.cells.length; i++) {
            if (cell.x === snake.cells[i].x && cell.y === snake.cells[i].y) {
                running = false;
                gameOver = true;
                document.getElementById('gameOverMsg').style.display = 'block';
                return;
            }
        }
    });
}

document.addEventListener('keydown', function(e) {
    if (!running) return;
    if (e.key === 'ArrowLeft' && snake.dx === 0) {
        snake.dx = -grid; snake.dy = 0;
    } else if (e.key === 'ArrowUp' && snake.dy === 0) {
        snake.dy = -grid; snake.dx = 0;
    } else if (e.key === 'ArrowRight' && snake.dx === 0) {
        snake.dx = grid; snake.dy = 0;
    } else if (e.key === 'ArrowDown' && snake.dy === 0) {
        snake.dy = grid; snake.dx = 0;
    }
});

document.getElementById('restartBtn').onclick = function() {
    resetGame();
    requestAnimationFrame(gameLoop);
};

document.getElementById('speedDownBtn').onclick = function() {
    if (speed < maxSpeed) speed++;
};

document.getElementById('speedUpBtn').onclick = function() {
    if (speed > minSpeed) speed--;
};

// 초기 속도 설정
speed = 6;
resetGame();
requestAnimationFrame(gameLoop);
