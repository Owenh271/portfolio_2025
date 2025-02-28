// Create the canvas
const canvas = document.createElement("canvas");
const ctx = canvas.getContext("2d");
document.body.appendChild(canvas);
canvas.width = 1200;
canvas.height = 600;

// Load the background image
const backgroundImage = new Image();
backgroundImage.src = 'background.png';

// Load the car images
const carImage1 = new Image();
const carImage2 = new Image();
carImage1.src = 'car.png'; // Player 1's car image
carImage2.src = 'car2.png'; // Player 2's car image

// Load the obstacle image (mud)
const mudImage = new Image();
mudImage.src = 'mud.png'; // Mud image for obstacles

let player1 = { x: 20, y: (canvas.height / 2) - 50, width: 90, height: 40, speed: 5, angle: 0, penaltyTime: 0 };  
let player2 = { x: 20, y: (canvas.height / 2), width: 70, height: 40, speed: 5, angle: 0, penaltyTime: 0 };  

let finishLineWidth = 15;
let finishLineHeight = 70;

let finishLineX = Math.random() * (canvas.width - finishLineWidth - 200) + 200;
let finishLineY = Math.random() * (canvas.height - finishLineHeight);

let obstacles = [];

// Generate obstacles
function createObstacles() {
    obstacles = [];
    for (let i = 0; i < 15; i++) {
        let width = Math.random() * 50 + 30;
        let height = Math.random() * 30 + 20;
        let x = Math.random() * (canvas.width - width);
        let y = Math.random() * (canvas.height - height);
        obstacles.push({ x, y, width, height });
    }
}

// Draw a rotated car with an image
function drawCar(car, image) {
    ctx.save();
    ctx.translate(car.x + car.width / 2, car.y + car.height / 2);
    ctx.rotate(car.angle);
    ctx.drawImage(image, -car.width / 2, -car.height / 2, car.width, car.height);
    ctx.restore();
}

// Draw obstacles
function drawObstacles() {
    obstacles.forEach(obstacle => {
        ctx.drawImage(mudImage, obstacle.x, obstacle.y, obstacle.width, obstacle.height);
    });
}

// Draw borders
function drawBorders() {
    ctx.fillStyle = "black";
    ctx.lineWidth = 10;

    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(0, canvas.height);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(canvas.width, 0);
    ctx.lineTo(canvas.width, canvas.height);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(canvas.width, 0);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(0, canvas.height);
    ctx.lineTo(canvas.width, canvas.height);
    ctx.stroke();
}

// Collision detection
function checkCollision(car) {
    if (car.x <= 10 || car.x + car.width >= canvas.width - 10 || car.y <= 10 || car.y + car.height >= canvas.height - 10) {
        return true;
    }
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

// Update car movement
function updateCar(car, controls, image) {
    if (car.penaltyTime > 0) car.penaltyTime--;

    if (keys[controls.left]) car.angle -= 0.05;
    if (keys[controls.right]) car.angle += 0.05;

    if (keys[controls.forward]) {
        let newX = car.x + Math.cos(car.angle) * car.speed;
        let newY = car.y + Math.sin(car.angle) * car.speed;
        if (newX > 10 && newX + car.width < canvas.width - 10) {
            car.x = newX;
        }
        if (newY > 10 && newY + car.height < canvas.height - 10) {
            car.y = newY;
        }
    }

    if (keys[controls.backward]) {
        let newX = car.x - Math.cos(car.angle) * (car.speed / 2);
        let newY = car.y - Math.sin(car.angle) * (car.speed / 2);
        if (newX > 10 && newX + car.width < canvas.width - 10) {
            car.x = newX;
        }
        if (newY > 10 && newY + car.height < canvas.height - 10) {
            car.y = newY;
        }
    }

    if (checkCollision(car) && car.penaltyTime === 0) {
        car.penaltyTime = 60;
        car.speed = 2;
    } else if (car.penaltyTime === 0) {
        car.speed = 5;
    }

    drawCar(car, image);
}

// Update game
function update() {
    updateCar(player1, { left: "a", right: "d", forward: "w", backward: "s" }, carImage1);
    updateCar(player2, { left: "j", right: "l", forward: "i", backward: "k" }, carImage2);

    let finishLineTop = finishLineY;
    let finishLineBottom = finishLineTop + finishLineHeight;

    if (
        player1.x + player1.width >= finishLineX && 
        player1.x <= finishLineX + finishLineWidth &&
        player1.y + player1.height >= finishLineTop && 
        player1.y <= finishLineBottom
    ) {
        alert("Player 1 Wins!");
        resetGame();
    }
    if (
        player2.x + player2.width >= finishLineX && 
        player2.x <= finishLineX + finishLineWidth &&
        player2.y + player2.height >= finishLineTop && 
        player2.y <= finishLineBottom
    ) {
        alert("Player 2 Wins!");
        resetGame();
    }
}

// Reset game
function resetGame() {
    player1.x = 20;
    player1.y = (canvas.height / 2) - 50;
    player1.angle = 0;
    player2.x = 20;
    player2.y = (canvas.height / 2);
    player2.angle = 0;
    createObstacles();
    finishLineX = Math.random() * (canvas.width - finishLineWidth - 200) + 200;
    finishLineY = Math.random() * (canvas.height - finishLineHeight);
    keys = {};
}

// Key event listeners
let keys = {};
window.addEventListener("keydown", (e) => (keys[e.key] = true));
window.addEventListener("keyup", (e) => (keys[e.key] = false));

// Game loop
function gameLoop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw background first
    ctx.drawImage(backgroundImage, 0, 0, canvas.width, canvas.height);

    drawBorders();
    
    // Draw finish line
    ctx.fillStyle = "black";
    ctx.fillRect(finishLineX, finishLineY, finishLineWidth, finishLineHeight);

    drawObstacles();
    update();

    requestAnimationFrame(gameLoop);
}

// Ensure images load before starting
backgroundImage.onload = function() {
    carImage1.onload = function() {
        carImage2.onload = function() {
            mudImage.onload = function() {
                createObstacles();
                gameLoop();
            };
        };
    };
};

