// Canvas Setup
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// UI Elements
const scoreElement = document.getElementById('score');
const autoFireToggle = document.getElementById('auto-fire-toggle');
const gameOverScreen = document.getElementById('game-over-screen');
const finalScoreElement = document.getElementById('final-score');
const continueButton = document.getElementById('continue-button');
const restartButton = document.getElementById('restart-button');

// Game Variables
let score = 0;
let lives = 3;
let gameOver = false;
let autoFire = false;
let lastFireTime = 0; // Used to limit fire rate

// Player Ship
const player = {
    x: canvas.width / 2,
    y: canvas.height - 50,
    width: 30, // Placeholder size
    height: 30, // Placeholder size
    speed: 5,
    color: 'var(--color-green)' // Placeholder color
};

// Bullets
const bullets = [];
const bulletSpeed = 7;
const fireRate = 250; // milliseconds between shots

// Enemies
const enemies = [];
const enemySpeed = 1;
const enemySpawnRate = 2000; // milliseconds

// Functions to draw game elements
function drawPlayer() {
    ctx.fillStyle = player.color;
    ctx.fillRect(player.x - player.width / 2, player.y - player.height / 2, player.width, player.height);
}

function drawBullet(bullet) {
    ctx.fillStyle = 'white';
    ctx.fillRect(bullet.x - 2, bullet.y - 5, 4, 10);
}

function drawEnemy(enemy) {
    ctx.fillStyle = 'var(--color-purple)';
    ctx.fillRect(enemy.x - 15, enemy.y - 15, 30, 30);
}

// Input Handlers
const canvasRect = canvas.getBoundingClientRect();

canvas.addEventListener('mousemove', (e) => {
    player.x = e.clientX - canvasRect.left;

    //Keep player within bounds
    if (player.x < player.width/2) {
      player.x = player.width/2;
    } else if(player.x > canvas.width - player.width/2){
      player.x = canvas.width - player.width/2;
    }
});

canvas.addEventListener('mousedown', (e) => {
    if (e.button === 2) { // Right click
        e.preventDefault(); // PREVENT CONTEXT MENU
        fireBullet();
    }
});

// Prevent context menu on canvas
canvas.addEventListener('contextmenu', (e) => {
  e.preventDefault();
});

autoFireToggle.addEventListener('click', () => {
    autoFire = !autoFire;
    autoFireToggle.textContent = `Auto-Fire: ${autoFire ? 'On' : 'Off'}`;
});

// Game Logic

function fireBullet() {
    if(gameOver) return;

    const now = Date.now();
    if(now - lastFireTime > fireRate){
        bullets.push({
            x: player.x,
            y: player.y
        });
        lastFireTime = now;
    }

}

function spawnEnemy() {
    if(gameOver) return;
    const x = Math.random() * canvas.width;
    const y = 0;
    enemies.push({ x, y });
}

function updateScore(points) {
    score += points;
    scoreElement.textContent = `Score: ${score}`;
}

function checkCollision(rect1, rect2) {
    return (
        rect1.x < rect2.x + rect2.width &&
        rect1.x + rect1.width > rect2.x &&
        rect1.y < rect2.y + rect2.height &&
        rect1.y + rect1.height > rect2.y
    );
}

function handleCollisions() {

    for (let i = 0; i < enemies.length; i++) {
        const enemy = enemies[i];

        // Player-Enemy Collision
        if (checkCollision(player, { x: enemy.x - 15, y: enemy.y - 15, width: 30, height: 30 })) {
            lives--;
            enemies.splice(i, 1); // Remove the enemy that collided
            i--; // Adjust index after removing enemy

            if (lives <= 0) {
                endGame();
            }
            continue; // Skip bullet collision check for this enemy
        }

        // Bullet-Enemy Collision
        for (let j = 0; j < bullets.length; j++) {
            const bullet = bullets[j];
            if (checkCollision({ x: bullet.x - 2, y: bullet.y - 5, width: 4, height: 10 }, { x: enemy.x - 15, y: enemy.y - 15, width: 30, height: 30 })) {
                enemies.splice(i, 1);
                bullets.splice(j, 1);
                i--; // Adjust index after removing enemy
                j--; // Adjust index after removing bullet
                updateScore(100);
                break; // Only one bullet can hit one enemy
            }
        }
    }
}

function endGame() {
    gameOver = true;
    finalScoreElement.textContent = `Final Score: ${score}`;
    gameOverScreen.style.display = 'block';
}

continueButton.addEventListener('click', () => {
    if (score >= 100) {
        score = Math.floor(score / 2); // Half points
        scoreElement.textContent = `Score: ${score}`;
        lives = 3;
        gameOver = false;
        gameOverScreen.style.display = 'none';
    } else {
        alert("Not enough points to continue!"); // Or a nicer UI message
    }
});

restartButton.addEventListener('click', () => {
    resetGame();
});

function resetGame() {
    score = 0;
    lives = 3;
    gameOver = false;
    scoreElement.textContent = `Score: ${score}`;
    gameOverScreen.style.display = 'none';
    enemies.length = 0; // Clear enemies array
    bullets.length = 0; // Clear bullets array
}

// Game Loop
function gameLoop() {
    if(gameOver) return;

    // Update game state
    if (autoFire) {
        fireBullet();
    }

    // Update bullets position
    for (let i = 0; i < bullets.length; i++) {
        bullets[i].y -= bulletSpeed;
        if (bullets[i].y < 0) {
            bullets.splice(i, 1);
            i--;
        }
    }

    // Update enemies position
    for (let i = 0; i < enemies.length; i++) {
        enemies[i].y += enemySpeed;
        if (enemies[i].y > canvas.height) {
            enemies.splice(i, 1);
            i--;
            lives--;
            if (lives <= 0) {
                endGame();
            }
        }
    }

    handleCollisions();

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw everything
    drawPlayer();
    bullets.forEach(drawBullet);
    enemies.forEach(drawEnemy);

    // Request next frame
    requestAnimationFrame(gameLoop);
}

// Initialize the game
function init() {
    // Start spawning enemies
    setInterval(spawnEnemy, enemySpawnRate);

    // Set the player color from CSS variable
    player.color = getComputedStyle(document.documentElement).getPropertyValue('--color-green').trim();

    // Start the game loop
    gameLoop();
}

// Call init to start the game
init();