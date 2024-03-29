const canvas = document.querySelector("canvas");
const c = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let loaded = false;
let over = false;
let readyToRestart = false;
let started = false;
let startLoaded = false;
let escaped = 0;
let score = 0;
let countdown = 3;
let robots = [];
let shots = [];
const robotHeight = 100;

let startImg = new Image();
startImg.onload = () => {
  startLoaded = true;
  const vCrop = startImg.height - 100;
  const hRatio = canvas.width / startImg.width;
  const vRatio = canvas.height / vCrop;
  const ratio = Math.max(hRatio, vRatio);
  c.drawImage(
    startImg,
    0,
    0,
    startImg.width,
    vCrop,
    hRatio > vRatio ? 0 : (startImg.width * vRatio - canvas.width) / -2,
    0,
    startImg.width * ratio,
    vCrop * ratio
  );
};
startImg.src =
  "https://d1z39p6l75vw79.cloudfront.net/u/562343/7bd6482b1d14db826464a94fa34e00c0856b226c/original/eoti-album-art.jpg/!!/meta:eyJzcmNCdWNrZXQiOiJiemdsZmlsZXMifQ==/b:W1sidCIsMF0sWyJyZXNpemUiLDEwMDBdLFsibWF4Il0sWyJ3ZSJdXQ==.jpg";

let robotImg = new Image();
robotImg.onload = () => {
  loaded = true;
};
robotImg.src =
  "https://d1z39p6l75vw79.cloudfront.net/u/562343/33d9a7769650e2c7d8f1d6d51e0b5d9c26eb7f2f/original/waxrobot-low-res-webreadypng.png/!!/b%3AW1sicmVzaXplIiw2NjBdLFsibWF4Il0sWyJ3ZSJdXQ%3D%3D/meta%3AeyJzcmNCdWNrZXQiOiJjb250ZW50LnNpdGV6b29nbGUuY29tIn0%3D.png";

class Robot {
  constructor(x, y, size, vX = 0, vY = 0, dir = "left") {
    this.x = x;
    this.y = y;
    this.width = size;
    this.height = size;
    this.velocityX = vX;
    this.velocityY = vY;
    this.dir = dir;
  }

  draw() {
    c.drawImage(
      robotImg,
      0,
      0,
      robotImg.width,
      robotImg.height,
      this.x,
      this.y,
      this.width,
      this.height
    );
  }

  update() {
    this.draw();
    this.x += this.velocityX;
    this.y += this.velocityY;
  }
}

const spawnRobots = () => {
  const spawnInterval = setInterval(() => {
    if (over) return clearInterval(spawnInterval);
    const x = canvas.width;
    const y =
      Math.random() * (((canvas.height - robotHeight) * 2) / 3) +
      canvas.height / 6;
    const vx = -1 * (Math.round(Math.random() * 2) + 1);

    robots.push(new Robot(x, y, 100, vx));
  }, 250);
};

const end = () => {
  document.querySelector(".end").classList.remove("hide");
  document.querySelector("#cooldown").innerText = `restart in ${countdown}`;
  const cooldownInterval = setInterval(() => {
    if (countdown > 0) countdown -= 1;
    document.querySelector("#cooldown").innerText = `restart in ${countdown}`;
  }, 1000);
  setTimeout(() => {
    readyToRestart = true;
    clearInterval(cooldownInterval);
    document.querySelector("#cooldown").innerText = "[  restart  ]";
  }, countdown * 1000);
};

const animate = () => {
  requestAnimationFrame(animate);
  if (escaped > 0 && !over) {
    over = true;
    end();
  }

  if (!loaded) return;

  c.fillStyle = "#000";
  c.fillRect(0, 0, canvas.width, canvas.height);

  let toDelete = [];
  let hit = false;

  robots.forEach((r, robotIndex) => {
    shots.forEach(([x, y]) => {
      if (
        !hit &&
        r.x <= x &&
        r.x + r.width >= x &&
        r.y <= y &&
        r.y + r.height >= y
      ) {
        toDelete.push(robotIndex);
        score += 1;
        hit = true;
      }
    });

    r.update();

    if (r.x < 0 - r.width) {
      toDelete.push(robotIndex);
      escaped += 1;
    }
  });

  toDelete.forEach((i, j) => {
    robots.splice(i - j, 1);
  });

  shots = [];

  c.fillStyle = "#fff";
  c.font = "20px Verdana";
  c.fillText(`Escaped: ${escaped}`, 10, 30);
  c.fillText(`Score: ${score}`, 10, 60);
};

document.addEventListener("click", (e) => {
  if (startLoaded && loaded && !started) {
    started = true;
    const instructions = document.querySelector(".instructions");
    instructions.classList.add("hide");
    animate();
    spawnRobots();
  }
  if (!over) shots.push([e.x, e.y]);
  if (over && readyToRestart) {
    document.querySelector(".end").classList.add("hide");
    over = false;
    readyToRestart = false;
    escaped = 0;
    score = 0;
    countdown = 3;
    robots = [];
    shots = [];
    spawnRobots();
  }
});

const loop = setInterval(() => {
  if (!startLoaded && !loaded) return;
  document.querySelector(".instructions").classList.remove("hide");
  clearInterval(loop);
}, 1000);
