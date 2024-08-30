const player = document.getElementById('player');
let enemies = document.getElementsByClassName('enemy');
const timerDisplay = document.getElementById('timer');
const hearts = document.querySelectorAll('.hearts img');

let playerPos = { x: 375, y: 275 }; // Center of the game container
let playerLives = 3;
let startTime = Date.now();
let gameInterval;
let speedIncreaseInterval;

let keys = {
    up: false,
    down: false,
    left: false,
    right: false
};

// Movement speed
let speed = 5; // Initial player speed
let enemySpeed = 2; // Initial enemy speed
let enemyCount = 4; // Initial number of enemies

// Colors for life display
const lifeColors = ['#28a745', '#ffc107', '#dc3545'];

// Function to update lives display
function updateLivesDisplay() {
    // Update the hearts display based on the remaining lives
    for (let i = 0; i < hearts.length; i++) {
        if (i < playerLives) {
            hearts[i].style.opacity = '1';
        } else {
            hearts[i].style.opacity = '0.2'; // Dim the heart when a life is lost
        }
    }

    // Trigger the life-lost animation
    document.querySelector('.hearts').classList.add('life-lost');
    setTimeout(() => {
        document.querySelector('.hearts').classList.remove('life-lost');
    }, 500);
}

// Initialize enemy positions randomly within the game container
function initializeEnemies() {
    for (let enemy of enemies) {
        enemy.style.left = Math.floor(Math.random() * 780) + 'px';
        enemy.style.top = Math.floor(Math.random() * 580) + 'px';
    }
    updateLivesDisplay(); // Initialize lives display
}

// Update player position
function movePlayer() {
    if (keys.up) playerPos.y = Math.max(0, playerPos.y - speed);
    if (keys.down) playerPos.y = Math.min(580, playerPos.y + speed);
    if (keys.left) playerPos.x = Math.max(0, playerPos.x - speed);
    if (keys.right) playerPos.x = Math.min(780, playerPos.x + speed);

    player.style.left = playerPos.x + 'px';
    player.style.top = playerPos.y + 'px';
}

// Make enemies chase the player
function moveEnemies() {
    for (let enemy of enemies) {
        let ex = parseInt(enemy.style.left) || 0;
        let ey = parseInt(enemy.style.top) || 0;

        let deltaX = playerPos.x - ex;
        let deltaY = playerPos.y - ey;

        let distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
        let moveX = (deltaX / distance) * enemySpeed;
        let moveY = (deltaY / distance) * enemySpeed;

        let newEx = Math.max(0, Math.min(780, ex + moveX));
        let newEy = Math.max(0, Math.min(580, ey + moveY));

        enemy.style.left = newEx + 'px';
        enemy.style.top = newEy + 'px';
    }
}

// Check for collision
function checkCollision() {
    for (let enemy of enemies) {
        let ex = parseInt(enemy.style.left);
        let ey = parseInt(enemy.style.top);

        if (
            playerPos.x < ex + 25 &&
            playerPos.x + 20 > ex &&
            playerPos.y < ey + 35 &&
            playerPos.y + 20 > ey
        ) {
            playerLives -= 1;
            updateLivesDisplay();

            if (playerLives <= 0) {
                clearInterval(gameInterval);
                clearInterval(speedIncreaseInterval);
                alert('Game Over! Time survived: ' + ((Date.now() - startTime) / 1000).toFixed(2) + ' seconds');
                // Optionally, reload the game
                location.reload();
                return true;
            }
            break; // Prevent losing more than one life per collision
        }
    }
    return false;
}

// Update game timer
function updateTimer() {
    let elapsedTime = ((Date.now() - startTime) / 1000).toFixed(2);
    timerDisplay.textContent = `Time: ${elapsedTime}s`;
}

// Increase game difficulty over time
function increaseDifficulty() {
    // Increase enemy speed
    enemySpeed += 0.2;

    // Add a new enemy every 10 seconds
    if (enemyCount < 20) { // Limit the maximum number of enemies
        const newEnemy = document.createElement('div');
        newEnemy.className = 'enemy';
        newEnemy.style.backgroundImage = 'url("img/fire.png")';
        document.getElementById('game-container').appendChild(newEnemy);
        enemies = document.getElementsByClassName('enemy');
        enemyCount++;
        initializeEnemies(); // Reinitialize positions to avoid overlap
    }
}

// Game loop
function gameLoop() {
    movePlayer();
    if (checkCollision()) return;
    moveEnemies();
    updateTimer();
}

// Start game
initializeEnemies();
gameInterval = setInterval(gameLoop, 50); // Reduced interval for smoother gameplay
speedIncreaseInterval = setInterval(increaseDifficulty, 10000); // Increase difficulty every 10 seconds

// Player movement controls
document.addEventListener('keydown', (event) => {
    if (event.key === 'ArrowUp' || event.key === 'w') keys.up = true;
    if (event.key === 'ArrowDown' || event.key === 's') keys.down = true;
    if (event.key === 'ArrowLeft' || event.key === 'a') keys.left = true;
    if (event.key === 'ArrowRight' || event.key === 'd') keys.right = true;
});

document.addEventListener('keyup', (event) => {
    if (event.key === 'ArrowUp' || event.key === 'w') keys.up = false;
    if (event.key === 'ArrowDown' || event.key === 's') keys.down = false;
    if (event.key === 'ArrowLeft' || event.key === 'a') keys.left = false;
    if (event.key === 'ArrowRight' || event.key === 'd') keys.right = false;
});
