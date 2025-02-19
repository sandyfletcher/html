const character = document.getElementById('character');
const gameContainer = document.getElementById('game-container');
const characterSize = 50; // Size of the character (matches CSS)

let characterX = 0;
let characterY = 0;

const cornerLinks = {
    topLeft: "https://www.example.com/top-left",
    topRight: "https://www.example.com/top-right",
    bottomLeft: "https://www.example.com/bottom-left",
    bottomRight: "https://www.example.com/bottom-right"
};

// Function to update character position
function updateCharacterPosition() {
    character.style.transform = `translate(${characterX}px, ${characterY}px)`;
}

// Function to check for collision with a wall
function checkCollision(x, y) {
    const walls = document.querySelectorAll('.wall');
    for (const wall of walls) {
        const wallRect = wall.getBoundingClientRect();
        const gameContainerRect = gameContainer.getBoundingClientRect();

        const relativeWallLeft = wallRect.left - gameContainerRect.left;
        const relativeWallTop = wallRect.top - gameContainerRect.top;

        const wallLeft = relativeWallLeft;
        const wallTop = relativeWallTop;
        const wallWidth = wallRect.width;
        const wallHeight = wallRect.height;

        if (
            x + characterSize > wallLeft &&
            x < wallLeft + wallWidth &&
            y + characterSize > wallTop &&
            y < wallTop + wallHeight
        ) {
            return true; // Collision detected
        }
    }
    return false; // No collision
}

// Keep character within the bounds of the game container AND prevent wall collision
function keepInBounds(proposedX, proposedY) {
    const containerWidth = gameContainer.offsetWidth;
    const containerHeight = gameContainer.offsetHeight;

    // First, check container bounds
    proposedX = Math.max(0, Math.min(proposedX, containerWidth - characterSize));
    proposedY = Math.max(0, Math.min(proposedY, containerHeight - characterSize));

    // Then, check for wall collisions at the proposed position
    if (checkCollision(proposedX, proposedY)) {
        return { x: characterX, y: characterY }; // Return current position if collision
    }

    return { x: proposedX, y: proposedY }; // Return proposed position if no collision
}

let animationRequestId = null; // Store the ID of the current animation frame
let targetX = null; // Store the target X coordinate
let targetY = null; // Store the target Y coordinate

// Keyboard controls
document.addEventListener('keydown', (event) => {
    let proposedX = characterX;
    let proposedY = characterY;

    const step = 10; // Movement speed
    switch (event.key) {
        case 'ArrowUp':
            proposedY -= step;
            break;
        case 'ArrowDown':
            proposedY += step;
            break;
        case 'ArrowLeft':
            proposedX -= step;
            break;
        case 'ArrowRight':
            proposedX += step;
            break;
    }

    const newPosition = keepInBounds(proposedX, proposedY); // Pass proposed position to keepInBounds
    characterX = newPosition.x;
    characterY = newPosition.y;

    updateCharacterPosition();
    checkCornerProximity();
});

// Mouse click controls
document.addEventListener('click', (event) => {
    const gameContainerRect = gameContainer.getBoundingClientRect();
    const mouseX = event.clientX - gameContainerRect.left;
    const mouseY = event.clientY - gameContainerRect.top;

    // Update the target coordinates
    targetX = mouseX;
    targetY = mouseY;

    // Cancel any existing animation
    if (animationRequestId) {
        cancelAnimationFrame(animationRequestId);
        animationRequestId = null;
    }

    const step = 5; // Smaller step for smoother movement

    function moveTowardsTarget() {
        if (targetX === null || targetY === null) {
            return; // Exit if no target is set
        }

        const dx = targetX - characterX;
        const dy = targetY - characterY;

        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance > step) {
            const moveX = (dx / distance) * step;
            const moveY = (dy / distance) * step;

            let proposedX = characterX + moveX;
            let proposedY = characterY + moveY;

            const newPosition = keepInBounds(proposedX, proposedY);
            characterX = newPosition.x;
            characterY = newPosition.y;

            updateCharacterPosition();
            checkCornerProximity();
            animationRequestId = requestAnimationFrame(moveTowardsTarget); // Continue moving

        } else {
            // Close enough - move directly to the target
            const newPosition = keepInBounds(targetX, targetY);
            characterX = newPosition.x;
            characterY = newPosition.y;
            updateCharacterPosition();
            checkCornerProximity();
            animationRequestId = null;

            targetX = null;
            targetY = null;
        }

    }

    moveTowardsTarget(); // Start moving
});

// Touch controls (swipe)
let touchStartX = 0;
let touchStartY = 0;

gameContainer.addEventListener('touchstart', (event) => {
    touchStartX = event.touches[0].clientX;
    touchStartY = event.touches[0].clientY;
});

gameContainer.addEventListener('touchend', (event) => {
    const touchEndX = event.changedTouches[0].clientX;
    const touchEndY = event.changedTouches[0].clientY;

    let proposedX = characterX;
    let proposedY = characterY;

    const step = 20; //Swipe movement speed
    if (Math.abs(deltaX) > Math.abs(deltaY)) {
        // Horizontal swipe
        if (deltaX > 0) {
            proposedX += step; // Right swipe
        } else {
            proposedX -= step; // Left swipe
        }
    } else {
        // Vertical swipe
        if (deltaY > 0) {
            // Vertical swipe
            if (deltaY > 0) {
                proposedY += step; // Down swipe
            } else {
                proposedY -= step; // Up swipe
            }
        }
    }

    const newPosition = keepInBounds(proposedX, proposedY);
    characterX = newPosition.x;
    characterY = newPosition.y;

    updateCharacterPosition();
    checkCornerProximity();
});

// Check if character is near a corner and redirect
function checkCornerProximity() {
    const proximityThreshold = 50; // How close to the corner to trigger

    if (characterX < proximityThreshold && characterY < proximityThreshold) {
        window.location.href = cornerLinks.topLeft;
    } else if (characterX > gameContainer.offsetWidth - proximityThreshold - characterSize && characterY < proximityThreshold) {
        window.location.href = cornerLinks.topRight;
    } else if (characterX < proximityThreshold && characterY > gameContainer.offsetHeight - proximityThreshold - characterSize) {
        window.location.href = cornerLinks.bottomLeft;
    } else if (characterX > gameContainer.offsetWidth - proximityThreshold - characterSize && characterY > gameContainer.offsetHeight - proximityThreshold - characterSize) {
        window.location.href = cornerLinks.bottomRight;
    }
}

// Initialize character position on load.
window.addEventListener('load', () => {
  characterX = gameContainer.offsetWidth / 2 - characterSize / 2;
  characterY = gameContainer.offsetHeight / 2 - characterSize / 2;
  updateCharacterPosition();
});

// Resize listener, to update the character position
window.addEventListener('resize', () => {
    updateCharacterPosition();
});