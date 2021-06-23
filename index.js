const canvas = document.querySelector("canvas");
const c = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let loaded = false;
let started = false;
let startLoaded = false;
let spawning = false;
let score = 0;
const robots = [];
let shots = [];
const robotHeight = 100;

let startImg = new Image();
startImg.onload = () => {
  startLoaded = true;
  const hRatio = canvas.width / startImg.width;
  console.log("hRatio = ", hRatio);
  const vRatio = canvas.height / (startImg.height - 100);
  console.log("vRatio = ", vRatio);
  const ratio = Math.max(hRatio, vRatio);
  c.drawImage(
    startImg,
    0,
    0,
    startImg.width,
    startImg.height - 100,
    // (startImg.width * ratio * -1) / 4,
    0,
    0,
    startImg.width * ratio,
    (startImg.height - 100) * ratio
  );
  c.beginPath();
  c.rect(canvas.width / 2 - 150, canvas.height / 3 - 150, 300, 300);
  c.fill();
};
startImg.src =
  "https://d1z39p6l75vw79.cloudfront.net/u/562343/7bd6482b1d14db826464a94fa34e00c0856b226c/original/eoti-album-art.jpg/!!/meta:eyJzcmNCdWNrZXQiOiJiemdsZmlsZXMifQ==/b:W1sidCIsMF0sWyJyZXNpemUiLDEwMDBdLFsibWF4Il0sWyJ3ZSJdXQ==.jpg";

let robotImg = new Image();
robotImg.onload = () => {
  loaded = true;
};
let escaped = 0;
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
  setInterval(() => {
    const x = canvas.width;
    const y =
      Math.random() * (((canvas.height - robotHeight) * 2) / 3) +
      canvas.height / 6;
    const vx = -1 * (Math.round(Math.random() * 2) + 1);

    robots.push(new Robot(x, y, 100, vx));
  }, 250);
};

const animate = () => {
  if (escaped < 5) requestAnimationFrame(animate);

  if (!loaded) return;
  if (loaded && !spawning) {
    spawning = true;
    spawnRobots();
  }

  c.clearRect(0, 0, canvas.width, canvas.height);

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

  c.font = "20px Verdana";
  c.fillText(`Escaped: ${escaped}`, 10, 30);
  c.fillText(`Score: ${score}`, 10, 60);
};

document.addEventListener("click", (e) => {
  if (startLoaded && loaded && !started) {
    started = true;
    animate();
  }
  shots.push([e.x, e.y]);
});
