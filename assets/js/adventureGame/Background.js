<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Racing Game</title>
  <link rel="stylesheet" href="style.css">
</head>
<body>
  <div class="game-container">
    <canvas id="gameCanvas"></canvas>
  </div>

  <script src="game.js"></script>
</body>
</html>
body {
  margin: 0;
  padding: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: #333;
}

.game-container {
  position: relative;
}

canvas {
  background-color: #000;
  display: block;
  border: 2px solid #fff;
}const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Set canvas size
canvas.width = 800;
canvas.height = 600;

// Variables for the background and road
let roadY = 0; // Start the road at the top of the canvas
const roadHeight = 600; // Height of the road (equal to canvas height)
const roadColor = "#555"; // Road color
const roadLineColor = "#fff"; // Color of road lines

// Draw the background and road
function drawBackground() {
  // Draw the sky
  ctx.fillStyle = "#87CEEB"; // Light blue sky color
  ctx.fillRect(0, 0, canvas.width, canvas.height); // Sky fills entire canvas

  // Draw the road (a brown color)
  ctx.fillStyle = roadColor;
  ctx.fillRect(100, roadY, 600, roadHeight); // Road on the canvas
  
  // Draw road lines (centerline)
  ctx.strokeStyle = roadLineColor;
  ctx.lineWidth = 5;
  ctx.setLineDash([20, 20]); // Dashed line effect
  ctx.beginPath();
  ctx.moveTo(canvas.width / 2, roadY); // Starting point of the line
  ctx.lineTo(canvas.width / 2, roadY + roadHeight); // Ending point of the line
  ctx.stroke();
}

// Function to move the background
function moveBackground() {
  roadY += 5; // Move the road downward at a rate of 5 pixels per frame

  // If the road has moved past the canvas, reset its position to create a looping effect
  if (roadY >= roadHeight) {
    roadY = 0;
  }
}

// Game loop
function gameLoop() {
  ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear the canvas every frame
  drawBackground(); // Draw the moving background
  moveBackground(); // Move the background
  
  requestAnimationFrame(gameLoop); // Continue the game loop
}

gameLoop(); // Start the game loop


  