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

  const startLeft = Math.random() * page.offsetWidth;
  balloon.style.left = `${startLeft}px`;

  const scale = 0.5 + Math.random() * 0.5;
  balloon.style.transform = `scale(${scale})`;
  balloon.style.setProperty("--scale", scale);


  page.appendChild(balloon);

  let bottom = -150;
  const floatSpeed = 1 + Math.random() * 1.5;
  const floatInterval = setInterval(() => {
    if (bottom > page.offsetHeight + 100) {
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

createBalloon();
createBalloon();
createBalloon();
createBalloon();
createBalloon();
createBalloon();
createBalloon();
