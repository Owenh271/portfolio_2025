const canvas = document.createElement("canvas");
const ctx = canvas.getContext("2d");
document.body.appendChild(canvas);
canvas.width = 800;
canvas.height = 400;

let player1 = { x: 50, y: 150, width: 50, height: 30, speed: 5 };
let player2 = { x: 50, y: 250, width: 50, height: 30, speed: 5 };
let finishLine = 700;

function drawCar(car, color) {
    ctx.fillStyle = color;
    ctx.fillRect(car.x, car.y, car.width, car.height);
}

function update() {
    if (keys["d"] && player1.x + player1.width < canvas.width) player1.x += player1.speed;
    if (keys["a"] && player1.x > 0) player1.x -= player1.speed;
    if (keys["w"] && player1.y > 0) player1.y -= player1.speed;
    if (keys["s"] && player1.y + player1.height < canvas.height) player1.y += player1.speed;
    
    if (keys["l"] && player2.x + player2.width < canvas.width) player2.x += player2.speed;
    if (keys["j"] && player2.x > 0) player2.x -= player2.speed;
    if (keys["i"] && player2.y > 0) player2.y -= player2.speed;
    if (keys["k"] && player2.y + player2.height < canvas.height) player2.y += player2.speed;

    if (player1.x >= finishLine) {
        alert("Player 1 Wins!");
        resetGame();
    }
    if (player2.x >= finishLine) {
        alert("Player 2 Wins!");
        resetGame();
    }
}

function resetGame() {
    player1.x = 50;
    player1.y = 150;
    player2.x = 50;
    player2.y = 250;
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
    ctx.fillRect(finishLine, 100, 10, 200);
    update();
    requestAnimationFrame(gameLoop);
}

gameLoop();
