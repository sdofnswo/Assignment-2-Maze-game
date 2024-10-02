// Dark/Light Mode Toggle
const toggleModeButton = document.getElementById('toggleMode');
let isDarkMode = false;
toggleModeButton.addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
    isDarkMode = !isDarkMode;
    toggleModeButton.textContent = isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode';
});

// Timer
let startTime;
let interval;
const timerElement = document.getElementById('timer');
function startTimer() {
    startTime = Date.now();
    interval = setInterval(updateTimer, 1000);
}

function updateTimer() {
    const elapsed = Date.now() - startTime;
    const minutes = Math.floor(elapsed / 60000);
    const seconds = Math.floor((elapsed % 60000) / 1000);
    timerElement.textContent = `${minutes < 10 ? '0' : ''}${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
}

function stopTimer() {
    clearInterval(interval);
}

// Number of times played
let timesPlayed = 0;
const timesPlayedElement = document.getElementById('timesPlayed');
function incrementTimesPlayed() {
    timesPlayed++;
    timesPlayedElement.textContent = timesPlayed;
}

// Result modal
const resultModal = document.getElementById('resultModal');
const resultText = document.getElementById('resultText');
const closeModal = document.querySelector('.close');

closeModal.onclick = function() {
    resultModal.style.display = 'none';
}

// Show modal when game is over
function showResult(result) {
    resultText.textContent = `Game Over! You ${result}`;
    resultModal.style.display = 'block';
    stopTimer();
}

// Simple Maze Game Logic (with obstacles)
const canvas = document.getElementById('mazeCanvas');
const ctx = canvas.getContext('2d');
let playerX = 10, playerY = 10;
const goalX = 480, goalY = 480;

// Define obstacles (walls)
const walls = [
    { x: 100, y: 0, width: 20, height: 300 },
    { x: 200, y: 200, width: 300, height: 20 },
    { x: 400, y: 0, width: 20, height: 200 },
    { x: 300, y: 300, width: 20, height: 200 },
];

// Draw maze including walls
function drawMaze() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    // Draw player
    ctx.fillStyle = 'black';
    ctx.fillRect(playerX, playerY, 20, 20);

    // Draw goal
    ctx.fillStyle = 'green';
    ctx.fillRect(goalX, goalY, 20, 20);

    // Draw walls
    ctx.fillStyle = 'red';
    walls.forEach(wall => {
        ctx.fillRect(wall.x, wall.y, wall.width, wall.height);
    });
}

function movePlayer(dx, dy) {
    const newX = playerX + dx;
    const newY = playerY + dy;

    // Check for collision with walls
    if (!isColliding(newX, newY)) {
        playerX = newX;
        playerY = newY;
        drawMaze();
        checkGoal();
    }
}

function isColliding(newX, newY) {
    // Check canvas boundaries
    if (newX < 0 || newY < 0 || newX > canvas.width - 20 || newY > canvas.height - 20) {
        return true;
    }
    
    // Check collision with each wall
    return walls.some(wall => {
        return newX < wall.x + wall.width &&
               newX + 20 > wall.x &&
               newY < wall.y + wall.height &&
               newY + 20 > wall.y;
    });
}

function checkGoal() {
    if (playerX === goalX && playerY === goalY) {
        showResult("won!");
    }
}

document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowUp') movePlayer(0, -10);
    if (e.key === 'ArrowDown') movePlayer(0, 10);
    if (e.key === 'ArrowLeft') movePlayer(-10, 0);
    if (e.key === 'ArrowRight') movePlayer(10, 0);
});

// Player name input modal
const nameInputModal = document.getElementById('nameInputModal');
const saveNameButton = document.getElementById('saveName');
const userNameElement = document.getElementById('userName');
const nameInput = document.getElementById('nameInput');

saveNameButton.addEventListener('click', () => {
    const name = nameInput.value;
    if (name) {
        userNameElement.textContent = name;
        nameInputModal.style.display = 'none';
        startTimer();
        incrementTimesPlayed();
        drawMaze();
    }
});

// Show name input on page load
window.onload = function() {
    nameInputModal.style.display = 'block';
};
