const canvas = document.createElement("canvas");
const ctx = canvas.getContext("2d");
document.body.appendChild(canvas);
canvas.width = 1200;
canvas.height = 600;

let player1 = { x: 200, y: 300, width: 50, height: 30, speed: 5, angle: 0, penaltyTime: 0 };
let player2 = { x: 200, y: 350, width: 50, height: 30, speed: 5, angle: 0, penaltyTime: 0 };

let finishLineX = 1000;
let finishLineWidth = 30;
let finishLineHeight = 100;

let obstacles = [];

// Generate obstacles
function createObstacles() {
    obstacles = [];
    for (let i = 0; i < 8; i++) {
        let width = Math.random() * 50 + 30;
        let height = Math.random() * 30 + 20;
        let x = Math.random() * (canvas.width - width);
        let y = Math.random() * (canvas.height - height);
        obstacles.push({ x, y, width, height });
    }
}

// Draw a rotated car
function drawCar(car, color) {
    ctx.save();
    ctx.translate(car.x + car.width / 2, car.y + car.height / 2);
    ctx.rotate(car.angle);
    ctx.fillStyle = color;
    ctx.fillRect(-car.width / 2, -car.height / 2, car.width, car.height);
    ctx.restore();
}

// Draw obstacles
function drawObstacles() {
    ctx.fillStyle = "green";
    obstacles.forEach(obstacle => {
        ctx.fillRect(obstacle.x, obstacle.y, obstacle.width, obstacle.height);
    });
}

// Collision detection
function checkCollision(car) {
    for (let i = 0; i < obstacles.length; i++) {
        let obstacle = obstacles[i];
        if (
            car.x < obstacle.x + obstacle.width &&
            car.x + car.width > obstacle.x &&
            car.y < obstacle.y + obstacle.height &&
            car.y + car.height > obstacle.y
        ) {
            return true;
        }
    }
    return false;
}

// Update car movement and rotation
function updateCar(car, controls) {
    if (car.penaltyTime > 0) car.penaltyTime--;

    if (keys[controls.left]) car.angle -= 0.05;
    if (keys[controls.right]) car.angle += 0.05;

    if (keys[controls.forward]) {
        car.x += Math.cos(car.angle) * car.speed;
        car.y += Math.sin(car.angle) * car.speed;
    }
    if (keys[controls.backward]) {
        car.x -= Math.cos(car.angle) * car.speed;
        car.y -= Math.sin(car.angle) * car.speed;
    }

    // Check for collisions
    if (checkCollision(car) && car.penaltyTime === 0) {
        car.penaltyTime = 60;
        car.speed = 2;
    } else if (car.penaltyTime === 0) {
        car.speed = 5;
    }
}

// Game update function
function update() {
    updateCar(player1, { left: "a", right: "d", forward: "w", backward: "s" });
    updateCar(player2, { left: "j", right: "l", forward: "i", backward: "k" });

    // Check for finish line
    if (player1.x + player1.width >= finishLineX) {
        alert("Player 1 Wins!");
        resetGame();
    }
    if (player2.x + player2.width >= finishLineX) {
        alert("Player 2 Wins!");
        resetGame();
    }
}

// Reset game state
function resetGame() {
    player1.x = 200;
    player1.y = 300;
    player1.angle = 0;
    player2.x = 200;
    player2.y = 350;
    player2.angle = 0;
    createObstacles();
    keys = {};
}

// Key event listeners
let keys = {};
window.addEventListener("keydown", (e) => (keys[e.key] = true));
window.addEventListener("keyup", (e) => (keys[e.key] = false));

// Game loop
function gameLoop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    drawCar(player1, "blue");
    drawCar(player2, "red");

    ctx.fillStyle = "black";
    ctx.fillRect(finishLineX, (canvas.height - finishLineHeight) / 2, finishLineWidth, finishLineHeight);

    drawObstacles();
    update();

    requestAnimationFrame(gameLoop);
}

createObstacles();
gameLoop();
