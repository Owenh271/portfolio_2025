const canvas = document.createElement("canvas");
const ctx = canvas.getContext("2d");
document.body.appendChild(canvas);
canvas.width = 1200; // Increased canvas width
canvas.height = 600; // Increased canvas height

let player1 = { x: 50, y: 150, width: 50, height: 30, speed: 5, penaltyTime: 0 };
let player2 = { x: 50, y: 250, width: 50, height: 30, speed: 5, penaltyTime: 0 };
let finishLineX = 1000; // Position of the finish line
let finishLineWidth = 30; // Smaller width for the finish line hitbox
let finishLineHeight = 100; // Increased height for the finish line hitbox (a bit bigger on the Y-axis)

let obstacles = [];

// Generate obstacles at random positions within the new canvas size
function createObstacles() {
    obstacles = [];
    for (let i = 0; i < 8; i++) { // Increased the number of obstacles for a bigger map
        let width = Math.random() * 50 + 30;
        let height = Math.random() * 30 + 20;
        let x = Math.random() * (canvas.width - width);
        let y = Math.random() * (canvas.height - height);
        obstacles.push({ x, y, width, height });
    }
}

function drawCar(car, color) {
    ctx.fillStyle = color;
    ctx.fillRect(car.x, car.y, car.width, car.height);
}

function drawObstacles() {
    ctx.fillStyle = "green";
    obstacles.forEach(obstacle => {
        ctx.fillRect(obstacle.x, obstacle.y, obstacle.width, obstacle.height);
    });
}

function checkCollision(car) {
    for (let i = 0; i < obstacles.length; i++) {
        let obstacle = obstacles[i];
        if (
            car.x < obstacle.x + obstacle.width &&
            car.x + car.width > obstacle.x &&
            car.y < obstacle.y + obstacle.height &&
            car.y + car.height > obstacle.y
        ) {
            return true; // Collision detected
        }
    }
    return false;
}

function update() {
    // Apply penalty if the car has hit an obstacle
    if (player1.penaltyTime > 0) player1.penaltyTime--;
    if (player2.penaltyTime > 0) player2.penaltyTime--;

    // If not penalized, move normally
    if (keys["d"] && player1.x + player1.width < canvas.width) player1.x += player1.speed;
    if (keys["a"] && player1.x > 0) player1.x -= player1.speed;
    if (keys["w"] && player1.y > 0) player1.y -= player1.speed;
    if (keys["s"] && player1.y + player1.height < canvas.height) player1.y += player1.speed;

    if (keys["l"] && player2.x + player2.width < canvas.width) player2.x += player2.speed;
    if (keys["j"] && player2.x > 0) player2.x -= player2.speed;
    if (keys["i"] && player2.y > 0) player2.y -= player2.speed;
    if (keys["k"] && player2.y + player2.height < canvas.height) player2.y += player2.speed;

    // Check for collisions with obstacles
    if (checkCollision(player1) && player1.penaltyTime === 0) {
        player1.penaltyTime = 60; // 60 frames of penalty (1 second)
        player1.speed = 2; // Decrease speed when hitting an obstacle
    }
    if (checkCollision(player2) && player2.penaltyTime === 0) {
        player2.penaltyTime = 60; // 60 frames of penalty (1 second)
        player2.speed = 2; // Decrease speed when hitting an obstacle
    }

    // Reset speed after penalty time expires
    if (player1.penaltyTime === 0) player1.speed = 5;
    if (player2.penaltyTime === 0) player2.speed = 5;

    // Check for finish line (slightly bigger Y-axis hitbox)
    if (
        player1.x + player1.width >= finishLineX && 
        player1.x <= finishLineX + finishLineWidth &&
        player1.y + player1.height / 2 >= (canvas.height - finishLineHeight) / 2 && 
        player1.y + player1.height / 2 <= (canvas.height + finishLineHeight) / 2
    ) {
        alert("Player 1 Wins!");
        resetGame();
    }

    if (
        player2.x + player2.width >= finishLineX && 
        player2.x <= finishLineX + finishLineWidth &&
        player2.y + player2.height / 2 >= (canvas.height - finishLineHeight) / 2 && 
        player2.y + player2.height / 2 <= (canvas.height + finishLineHeight) / 2
    ) {
        alert("Player 2 Wins!");
        resetGame();
    }
}

function resetGame() {
    player1.x = 50;
    player1.y = 150;
    player2.x = 50;
    player2.y = 250;
    createObstacles(); // Regenerate obstacles after reset
    keys = {}; // Clear key states to prevent automatic movement
}

let keys = {};
window.addEventListener("keydown", (e) => (keys[e.key] = true));
window.addEventListener("keyup", (e) => (keys[e.key] = false));

function gameLoop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawCar(player1, "blue");
    drawCar(player2, "red");
    ctx.fillStyle = "black";
    // Draw the bigger finish line (larger Y-axis hitbox)
    ctx.fillRect(finishLineX, (canvas.height - finishLineHeight) / 2, finishLineWidth, finishLineHeight);
    drawObstacles(); // Draw obstacles
    update();
    requestAnimationFrame(gameLoop);
}

createObstacles(); // Initial obstacle setup
gameLoop();
