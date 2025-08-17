const game = document.getElementById("game");
const player = document.getElementById("player");
const gameOverText = document.getElementById("gameOver");
const scoreText = document.getElementById("score");

const savedCharacter = localStorage.getItem("selectedCharacter") || "images/kevin.png";

// function monthsSinceJanuary2023() {
//     const startDate = new Date(2023, 0); // January 2023 (month index 0)
//     const today = new Date();

//     let months = (today.getFullYear() - startDate.getFullYear()) * 12;
//     months += today.getMonth() - startDate.getMonth();

//     return months;
// }

// const winningScore = monthsSinceJanuary2023();

let obstacleTimeout;
let score = 0;
let scoreInterval;
let isJumping = false;
let isGameOver = false;

let walkFrame = 0;
let walkInterval;

function createBalloon() {
  const balloon = document.createElement("img");
  balloon.classList.add("balloon");

  const balloonImages = [
    "balloon-blue.png",
    "balloon-green.png",
    "balloon-yellow.png",
    "balloon-pink.png"
  ];
  const randomImage = balloonImages[Math.floor(Math.random() * balloonImages.length)];
  balloon.src = "images/" + randomImage;

  const startLeft = Math.random() * game.offsetWidth;
  balloon.style.left = `${startLeft}px`;

  const scale = 0.5 + Math.random() * 0.5;
  balloon.style.transform = `scale(${scale})`;
  balloon.style.setProperty("--scale", scale);


  game.appendChild(balloon);

  let bottom = -200;
  const floatSpeed = 1 + Math.random() * 1.5;
  const floatInterval = setInterval(() => {
    if (bottom > game.offsetHeight + 100) {
      clearInterval(floatInterval);
      balloon.remove();
    } else {
      bottom += floatSpeed;
      balloon.style.bottom = `${bottom}px`;
    }
  }, 15);

  const nextBalloonDelay = Math.random() * 2000 + 1000;
  setTimeout(createBalloon, nextBalloonDelay);
}

function startWalkAnimation() {
  walkInterval = setInterval(() => {
    if (!isJumping && !isGameOver) {
      walkFrame = (walkFrame + 1) % 2;
      player.src = walkFrame === 0 ? "images/" + savedCharacter + "-walking1.png" : "images/" + savedCharacter + "-walking2.png";
    }
  }, 175);
}

function startJumpAnimation() {
  walkInterval = setInterval(() => {
    if (isGameOver) {
      walkFrame = (walkFrame + 1) % 2;
      player.src = walkFrame === 0 ? "images/" + savedCharacter + ".png" : "images/" + savedCharacter + "-jumping.png";
    }
  }, 175);
}

function stopWalkAnimation() {
  clearInterval(walkInterval);
}

function jump() {
    if (isJumping || isGameOver) return;
    isJumping = true;
    stopWalkAnimation();
    player.src = "images/" + savedCharacter + "-jumping.png";

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
                player.src = "images/" + savedCharacter + "-walking1.png";
                startWalkAnimation();
            } else {
                player.style.bottom = 20 + jumpHeight + "px";
            }
        }, 20);
    }
}

function createObstacle() {
    if (isGameOver) return;

    const obstacle = document.createElement("img");
    let hasScored = false;

    const obstacleImages = [
        "obstacle1.png",
        "obstacle2.png"
    ];
    const randomImage = obstacleImages[Math.floor(Math.random() * obstacleImages.length)];
    obstacle.src = "images/" + randomImage;

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
        scoreText.textContent = "score: " + score;
        hasScored = true;

        if (score >= 24) {
          winGame();
          clearInterval(moveObstacle);
          obstacle.remove();
          return;
        }

       if (obstacleLeft + obstacle.offsetWidth < 0) {
        clearInterval(moveObstacle);
        obstacle.remove();
        }
    }}, 20);

    const minDelay = 1000;
    const maxDelay = 3000;
    const nextObstacleDelay = Math.random() * (maxDelay - minDelay) + minDelay;

    setTimeout(createObstacle, nextObstacleDelay);
}

function endGame() {
  isGameOver = true;
  clearInterval(scoreInterval);
  gameOverText.style.display = "block";
  stopWalkAnimation();
  player.src = "images/" + savedCharacter + ".png"
}

function winGame() {
  isGameOver = true;
  clearInterval(scoreInterval);
  // gameOverText.textContent = "happy 24!! you've successfully jumped over a chair for every month the bars have been inside you!!!🎉";
  gameOverText.textContent = "you win!!!!! wahoooooo happy 24!!!! my sweet handsome boy who is scared of chairs!!!!!! teehee🎉 (press R to play again)"
  gameOverText.style.display = "block";
  gameOverText.style.fontSize = "22px";
  gameOverText.style.width = "100%";
  gameOverText.style.margin = "0 auto";
  gameOverText.style.textAlign = "center";
  stopWalkAnimation();
  startJumpAnimation();
  player.src = "images/" + savedCharacter + ".png";
}

function resetGame() {
    isGameOver = false;
    gameOverText.style.display = "none";
    player.style.bottom = "20px";

    const allObstacles = game.querySelectorAll(".obstacle");
    allObstacles.forEach(obstacle => obstacle.remove());

    clearTimeout(obstacleTimeout);
    score = 0;
    scoreText.textContent = "score: 0";
    console.log(allObstacles);
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

game.addEventListener("touchstart", (e) => {
    e.preventDefault(); // prevent scrolling
    if (!isGameOver) {
        jump();
    }
});

gameOverText.addEventListener("touchstart", (e) => {
    e.preventDefault();
    if (isGameOver) {
        resetGame();
    }
});

createBalloon();
createBalloon();
createBalloon();
createBalloon();
createObstacle();
startWalkAnimation();
