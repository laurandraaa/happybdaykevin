document.addEventListener("DOMContentLoaded", () => {
    const game = document.getElementById("game");
    const player = document.getElementById("player");
    const tileSize = 40;
    const gameHeight = 600;
    const midpointRow = 7;

    let posX = 180;
    let logicalY = 0;
    let worldOffset = 0;

    const lanes = [];

    function createLane(yIndex) {
        if (yIndex % 2 !== 0) return; // skip odd indexes (empty space)

        const lane = document.createElement('div');
        lane.classList.add('lane');
        lane.style.top = `${gameHeight - (yIndex - worldOffset) * tileSize}px`;

        if (yIndex !== 0) {
            const car = document.createElement('div');
            car.classList.add('car');
            car.style.left = `${Math.random() * 320}px`;
            car.style.top = `0px`; // inside lane
            car.dataset.speed = (Math.random() * 2 + 1).toFixed(2);
            lane.appendChild(car);
        }

        game.appendChild(lane);
        lanes.push({ element: lane, yIndex });
    }

    // Initial lanes (0–19 logical rows, even rows only)
    for (let i = 0; i < 20; i++) {
        createLane(i);
    }

    function movePlayer(dx, dy) {
        // console.log(lanes.car.length);
        posX += dx * tileSize;
        posX = Math.max(0, Math.min(360, posX));

        logicalY += dy;
        if (logicalY < 0) logicalY = 0;

        // Scrolling mode: player passes midpoint
        if (logicalY - worldOffset > midpointRow) {
            worldOffset++;

            // Scroll lanes
            lanes.forEach(({ element, yIndex }) => {
                element.style.top = `${gameHeight - (yIndex - worldOffset) * tileSize}px`;
            });

            // Remove old lanes
            if (lanes.length && lanes[0].yIndex < worldOffset - 1) {
                game.removeChild(lanes[0].element);
                lanes.shift();
            }

            // Add new lane if it's an even row
            const newLaneIndex = lanes[lanes.length - 1].yIndex + 2;
            createLane(newLaneIndex);
        } else {
            // Player moves visually up
            player.style.top = `${gameHeight - (logicalY - worldOffset + 1) * tileSize}px`;
        }

        player.style.left = posX + 'px';
    }

    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowUp') movePlayer(0, 1);
        else if (e.key === 'ArrowDown') movePlayer(0, -1);
        else if (e.key === 'ArrowLeft') movePlayer(-1, 0);
        else if (e.key === 'ArrowRight') movePlayer(1, 0);
    });

    function checkCollision(rect1, rect2) {
        return !(
            rect1.top > rect2.bottom ||
            rect1.bottom < rect2.top ||
            rect1.right < rect2.left ||
            rect1.left > rect2.right
        );
    }

    function gameLoop() {
        const playerRect = player.getBoundingClientRect();

        lanes.forEach(({ element }) => {
            const car = element.querySelector(".car");
            if (!car) return;

            let x = parseFloat(car.style.left);
            const speed = parseFloat(car.dataset.speed);
            x += speed;
            if (x > 400) x = -80;
            car.style.left = x + "px";

            const carRect = car.getBoundingClientRect();
            if (checkCollision(playerRect, carRect)) {
                // alert("💥 You got hit!");
                location.reload();
            }
        });

        requestAnimationFrame(gameLoop);
    }

      gameLoop();
});
