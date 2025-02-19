const canvas = document.getElementById('game-canvas');
const ctx = canvas.getContext('2d');
const scoreElement = document.getElementById('score');
const autoFireButton = document.getElementById('auto-fire-button');

// Game dimensions (adjust as needed)
const GAME_WIDTH = 350;
const GAME_HEIGHT = 500;

canvas.width = GAME_WIDTH;
canvas.height = GAME_HEIGHT;

// Player
const PLAYER_WIDTH = 30;
const PLAYER_HEIGHT = 30;
let playerX = GAME_WIDTH / 2 - PLAYER_WIDTH / 2;
let playerY = GAME_HEIGHT - PLAYER_HEIGHT - 10;
const PLAYER_SPEED = 3; // pixels per frame

// Bullets
const BULLET_WIDTH = 5;
const BULLET_HEIGHT = 15;
const BULLET_SPEED = 5;
let bullets = [];

// Enemies
const ENEMY_WIDTH = 25;
const ENEMY_HEIGHT = 25;
const ENEMY_SPEED = 1;
let enemies = [];

let score = 0;
let autoFire = false;
let lastFireTime = 0;
const FIRE_RATE = 200; // milliseconds between shots

// Game State
let gameRunning = true;

// --- HELPER FUNCTIONS ---

function getRandomNumber(min, max) {
    return Math.random() * (max - min) + min;
}

function createEnemy() {
    const x = getRandomNumber(0, GAME_WIDTH - ENEMY_WIDTH);
    const y = 0;
    enemies.push({ x, y });
}

function drawPlayer() {
    ctx.fillStyle = 'green';
    ctx.fillRect(playerX, playerY, PLAYER_WIDTH, PLAYER_HEIGHT);
}

function drawBullet(bullet) {
    ctx.fillStyle = 'white';
    ctx.fillRect(bullet.x, bullet.y, BULLET_WIDTH, BULLET_HEIGHT);
}

function drawEnemy(enemy) {
    ctx.fillStyle = 'red';
    ctx.fillRect(enemy.x, enemy.y, ENEMY_WIDTH, ENEMY_HEIGHT);
}

function updateScore() {
    scoreElement.textContent = `Score: ${score}`;
}

function handleCollisions() {
    // Bullet-Enemy Collisions
    for (let i = 0; i < bullets.length; i++) {
        for (let j = 0; j < enemies.length; j++) {
            if (
                bullets[i].x < enemies[j].x + ENEMY_WIDTH &&
                bullets[i].x + BULLET_WIDTH > enemies[j].x &&
                bullets[i].y < enemies[j].y + ENEMY_HEIGHT &&
                bullets[i].y + BULLET_HEIGHT > enemies[j].y
            ) {
                // Collision detected!
                bullets.splice(i, 1); // Remove bullet
                enemies.splice(j, 1); // Remove enemy
                score += 10;
                updateScore();
                return; // Prevent multiple collisions with the same bullet/enemy
            }
        }
    }

    // Player-Enemy Collisions (Game Over)
    for (let i = 0; i < enemies.length; i++) {
        if (
            playerX < enemies[i].x + ENEMY_WIDTH &&
            playerX + PLAYER_WIDTH > enemies[i].x &&
            playerY < enemies[i].y + ENEMY_HEIGHT &&
            playerY + PLAYER_HEIGHT > enemies[i].y
        ) {
            // Game Over!
            gameRunning = false;
            alert('Game Over! Score: ' + score);
            location.reload(); // Restart the game (optional)
            return;
        }
    }
}

function fireBullet() {
    const bulletX = playerX + PLAYER_WIDTH / 2 - BULLET_WIDTH / 2;
    const bulletY = playerY;
    bullets.push({ x: bulletX, y: bulletY });
}

// --- EVENT LISTENERS ---

canvas.addEventListener('mousemove', (e) => {
    const rect = canvas.getBoundingClientRect();
    playerX = e.clientX - rect.left - PLAYER_WIDTH / 2;
    playerY = e.clientY - rect.top - PLAYER_HEIGHT / 2;

    // Keep player within bounds
    playerX = Math.max(0, Math.min(playerX, GAME_WIDTH - PLAYER_WIDTH));
    playerY = Math.max(0, Math.min(playerY, GAME_HEIGHT - PLAYER_HEIGHT));
});

canvas.addEventListener('click', () => {
    fireBullet();
});

autoFireButton.addEventListener('click', () => {
    autoFire = !autoFire;
    autoFireButton.textContent = `Auto-Fire: ${autoFire ? 'On' : 'Off'}`;
});

// --- GAME LOOP ---

function update() {
    if (!gameRunning) return; // Stop updating if game is over

    // Move bullets
    for (let i = 0; i < bullets.length; i++) {
        bullets[i].y -= BULLET_SPEED;
        if (bullets[i].y < 0) {
            bullets.splice(i, 1); // Remove bullets that are off-screen
        }
    }

    // Move enemies
    for (let i = 0; i < enemies.length; i++) {
        enemies[i].y += ENEMY_SPEED;
        if (enemies[i].y > GAME_HEIGHT) {
            enemies.splice(i, 1); // Remove enemies that are off-screen
        }
    }

    // Create new enemies (spawning)
    if (Math.random() < 0.01) {
        createEnemy();
    }

    // Handle Auto-Fire
    if (autoFire && Date.now() - lastFireTime > FIRE_RATE) {
        fireBullet();
        lastFireTime = Date.now();
    }

    handleCollisions();
}

function draw() {
    ctx.clearRect(0, 0, GAME_WIDTH, GAME_HEIGHT); // Clear the canvas

    drawPlayer();

    for (const bullet of bullets) {
        drawBullet(bullet);
    }

    for (const enemy of enemies) {
        drawEnemy(enemy);
    }
}

function gameLoop() {
    update();
    draw();

    requestAnimationFrame(gameLoop); // Call gameLoop again in the next frame
}

// --- START GAME ---

gameLoop();