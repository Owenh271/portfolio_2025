const canvas = document.createElement("canvas");
const ctx = canvas.getContext("2d");
document.body.appendChild(canvas);
canvas.width = 1200;
canvas.height = 600;

// Load the car images
const carImage1 = new Image();
const carImage2 = new Image();
carImage1.src = 'car.png'; // Player 1's car image
carImage2.src = 'car2.png'; // Player 2's car image

// Load the obstacle image (mud)
const mudImage = new Image();
mudImage.src = 'mud.png'; // Mud image for obstacles

let player1 = { x: 20, y: (canvas.height / 2) - 50, width: 90, height: 40, speed: 5, angle: 0, penaltyTime: 0 };  // Player 1 made wider
let player2 = { x: 20, y: (canvas.height / 2), width: 70, height: 40, speed: 5, angle: 0, penaltyTime: 0 };  // Player 2 remains the same

let finishLineWidth = 15;
let finishLineHeight = 70;

// Randomize finish line position within canvas constraints
let finishLineX = Math.random() * (canvas.width - finishLineWidth - 200) + 200; // Ensure it's not too close to the right edge
let finishLineY = Math.random() * (canvas.height - finishLineHeight); // Ensure it's within the canvas height

let obstacles = [];

// Generate more obstacles (now 15 obstacles instead of 8)
function createObstacles() {
    obstacles = [];
    for (let i = 0; i < 15; i++) {  // Changed to 15 obstacles
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
    
    // Draw the car image
    ctx.drawImage(image, -car.width / 2, -car.height / 2, car.width, car.height); // Adjust the car size to fit the carImage

    ctx.restore();
}

// Draw obstacles (using the mud image)
function drawObstacles() {
    obstacles.forEach(obstacle => {
        // Draw the mud image at the obstacle's location and with its width and height
        ctx.drawImage(mudImage, obstacle.x, obstacle.y, obstacle.width, obstacle.height);
    });
}

// Draw borders
function drawBorders() {
    ctx.fillStyle = "black";
    // Draw the racetrack boundaries (you can adjust the track's shape and size)
    ctx.lineWidth = 10;

    // Track left side
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(0, canvas.height);
    ctx.stroke();

    // Track right side
    ctx.beginPath();
    ctx.moveTo(canvas.width, 0);
    ctx.lineTo(canvas.width, canvas.height);
    ctx.stroke();

    // Track top side
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(canvas.width, 0);
    ctx.stroke();

    // Track bottom side
    ctx.beginPath();
    ctx.moveTo(0, canvas.height);
    ctx.lineTo(canvas.width, canvas.height);
    ctx.stroke();
}

// Collision detection with track borders
function checkCollision(car) {
    // Check if car goes outside the track area (borders)
    if (car.x <= 10 || car.x + car.width >= canvas.width - 10 || car.y <= 10 || car.y + car.height >= canvas.height - 10) {
        return true; // Collision with border
    }
    
    // Check for obstacles
    for (let i = 0; i < obstacles.length; i++) {
        let obstacle = obstacles[i];
        if (
            car.x < obstacle.x + obstacle.width &&
            car.x + car.width > obstacle.x &&
            car.y < obstacle.y + obstacle.height &&
            car.y + car.height > obstacle.y
        ) {
            return true; // Collision with obstacle
        }
    }
    return false;
}

// Update car movement and rotation
function updateCar(car, controls, image) {
    if (car.penaltyTime > 0) car.penaltyTime--;

    if (keys[controls.left]) car.angle -= 0.05;
    if (keys[controls.right]) car.angle += 0.05;

    if (keys[controls.forward]) {
        let newX = car.x + Math.cos(car.angle) * car.speed;
        let newY = car.y + Math.sin(car.angle) * car.speed;

        // Prevent moving outside the track (borders)
        if (newX > 10 && newX + car.width < canvas.width - 10) {
            car.x = newX;
        }

        if (newY > 10 && newY + car.height < canvas.height - 10) {
            car.y = newY;
        }
    }

    if (keys[controls.backward]) {
        let newX = car.x - Math.cos(car.angle) * (car.speed / 2); // Move slower by halving the speed
        let newY = car.y - Math.sin(car.angle) * (car.speed / 2); // Move slower by halving the speed

        // Prevent moving outside the track (borders)
        if (newX > 10 && newX + car.width < canvas.width - 10) {
            car.x = newX;
        }

        if (newY > 10 && newY + car.height < canvas.height - 10) {
            car.y = newY;
        }
    }

    // Check for collisions
    if (checkCollision(car) && car.penaltyTime === 0) {
        car.penaltyTime = 60;
        car.speed = 2;
    } else if (car.penaltyTime === 0) {
        car.speed = 5;
    }

    // Draw the car with the correct image
    drawCar(car, image);
}

// Game update function
function update() {
    updateCar(player1, { left: "a", right: "d", forward: "w", backward: "s" }, carImage1);
    updateCar(player2, { left: "j", right: "l", forward: "i", backward: "k" }, carImage2);

    // Check for finish line (smaller hitbox on x, larger on y)
    let finishLineTop = finishLineY;
    let finishLineBottom = finishLineTop + finishLineHeight;

    // Check if players cross the finish line within the updated hitbox
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

// Reset game state
function resetGame() {
    player1.x = 20; // Start at left border
    player1.y = (canvas.height / 2) - 50;
    player1.angle = 0;
    player2.x = 20; // Start at left border
    player2.y = (canvas.height / 2);
    player2.angle = 0;
    createObstacles();
    // Randomize finish line position again on reset
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

    drawBorders(); // Draw the track's borders

    // Draw the updated finish line with more central positioning on the Y-axis
    ctx.fillStyle = "black";
    ctx.fillRect(finishLineX, finishLineY, finishLineWidth, finishLineHeight);

    drawObstacles();
    update();

    requestAnimationFrame(gameLoop);
}

// Ensure the images are loaded before starting the game loop
carImage1.onload = function() {
    carImage2.onload = function() {
        mudImage.onload = function() {
            createObstacles(); // Create obstacles only after all images are loaded
            gameLoop();
        };
    };
};
