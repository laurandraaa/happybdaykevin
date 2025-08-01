const game = document.getElementById("game");
    const player = document.getElementById("player");
    const gameOverText = document.getElementById("gameOver");

    let isJumping = false;
    let isGameOver = false;

    // Player jump control
    function jump() {
      if (isJumping || isGameOver) return;
      isJumping = true;

      let jumpHeight = 0;
      const maxJumpHeight = 230;
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
          }
        }, 20);
      }
    }

    // Create and move obstacles
    function createObstacle() {
      if (isGameOver) return;

      const obstacle = document.createElement("div");
      obstacle.classList.add("obstacle");
      obstacle.style.left = game.offsetWidth + "px";
      game.appendChild(obstacle);

      let obstacleLeft = game.offsetWidth;

      const obstacleSpeed = 7; // px per frame (~20ms)
      const moveObstacle = setInterval(() => {
        if (isGameOver) {
          clearInterval(moveObstacle);
          obstacle.remove();
          return;
        }

        obstacleLeft -= obstacleSpeed;
        obstacle.style.left = obstacleLeft + "px";

        // Collision detection using bounding boxes
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

        // Remove obstacle when offscreen left
        if (obstacleLeft + obstacle.offsetWidth < 0) {
          clearInterval(moveObstacle);
          obstacle.remove();
        }
      }, 20);

      // Random delay between next obstacles
      const nextObstacleDelay = Math.random() * 2000 + 1000;
      setTimeout(createObstacle, nextObstacleDelay);
    }

    function endGame() {
      isGameOver = true;
      gameOverText.style.display = "block";
    }

    function resetGame() {
      isGameOver = false;
      gameOverText.style.display = "none";
      player.style.bottom = "20px";
      document.querySelectorAll(".obstacle").forEach((o) => o.remove());
      createObstacle();
    }

    document.addEventListener("keydown", (e) => {
      if (e.code === "Space") {
        e.preventDefault(); // Prevent page scrolling
        jump();
      } else if (e.code === "KeyR" && isGameOver) {
        resetGame();
      }
    });

    createObstacle();
