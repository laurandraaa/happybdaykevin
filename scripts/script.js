const game = document.getElementById("game");
const player = document.getElementById("player");
const gameOverText = document.getElementById("gameOver");
const scoreText = document.getElementById("score");

let score = 0;
let scoreInterval;
let isJumping = false;
let isGameOver = false;

function jump() {
    if (isJumping || isGameOver) return;
    isJumping = true;

    let jumpHeight = 0;
    const maxJumpHeight = 220;
    const jumpSpeed = 10;
    const jumpInterval = setInterval(() => {
        if (jumpHeight >= maxJumpHeight) {
            clearInterval(jumpInterval);
            fall();
        } else {
            jumpHeight += jumpSpeed;
            player.style.bottom = 20 + jumpHeight + "px";
        }
    }, 20);

    function fall() {
        const fallInterval = setInterval(() => {
        jumpHeight -= jumpSpeed;
        if (jumpHeight <= 0) {
            jumpHeight = 0;
            player.style.bottom = "20px";
            isJumping = false;
            clearInterval(fallInterval);
        } else {
            player.style.bottom = 20 + jumpHeight + "px";
        }}, 20);
    }
}

function createObstacle() {
    if (isGameOver) return;

    const obstacle = document.createElement("div");
    let hasScored = false;

    obstacle.classList.add("obstacle");
    obstacle.style.left = game.offsetWidth + "px";
    game.appendChild(obstacle);

    let obstacleLeft = game.offsetWidth;

    const obstacleSpeed = 7;
    const moveObstacle = setInterval(() => {
        if (isGameOver) {
            clearInterval(moveObstacle);
            obstacle.remove();
            return;
        }

        obstacleLeft -= obstacleSpeed;
        obstacle.style.left = obstacleLeft + "px";

        const playerRect = player.getBoundingClientRect();
        const obstacleRect = obstacle.getBoundingClientRect();

        const isCollision =
          playerRect.left < obstacleRect.right &&
          playerRect.right > obstacleRect.left &&
          playerRect.bottom > obstacleRect.top &&
          playerRect.top < obstacleRect.bottom;

        if (isCollision) {
          endGame();
          clearInterval(moveObstacle);
        }

    if (!hasScored && obstacleLeft + obstacle.offsetWidth < player.offsetLeft) {
        score++;
        scoreText.textContent = "Score: " + score;
        hasScored = true;

       if (obstacleLeft + obstacle.offsetWidth < 0) {
        clearInterval(moveObstacle);
        obstacle.remove();
        }
    }}, 20);

    const nextObstacleDelay = Math.random() * 2000 + 1000;
    setTimeout(createObstacle, nextObstacleDelay);
}

function endGame() {
  isGameOver = true;
  clearInterval(scoreInterval);
  gameOverText.style.display = "block";
}

function resetGame() {
    isGameOver = false;
    gameOverText.style.display = "none";
    player.style.bottom = "20px";
    document.querySelectorAll(".obstacle").forEach((o) => o.remove());
    score = 0;
    scoreText.textContent = "Score: 0";
    createObstacle();
}

document.addEventListener("keydown", (e) => {
    if (e.code === "Space") {
        e.preventDefault();
        jump();
      } else if (e.code === "KeyR" && isGameOver) {
        resetGame();
      }
    });

createObstacle();
