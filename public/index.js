const canvas = document.querySelector("canvas");
const c = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let loaded = false;
let spawning = false;
let shots = [];
const robotHeight = 100;
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
    const isFlipped = this.dir.startsWith("r");
    c.save();
    // if (isFlipped) {
    //   c.translate(this.x + this.width, this.y);
    //   c.scale(-1, 1);
    // }
    c.drawImage(
      robotImg,
      0,
      0,
      robotImg.width,
      robotImg.height,
      // this.x * (isFlipped ? -1 : 1),
      this.x,
      this.y,
      this.width,
      this.height
    );
    c.restore();
  }

  update() {
    this.draw();
    this.x += this.velocityX;
    this.y += this.velocityY;
  }
}

const robots = [
  new Robot(canvas.width, 0, robotHeight, -1, 0),
  new Robot(canvas.width, 200, robotHeight, -2, 0),
];

const spawnRobots = () => {
  setInterval(() => {
    const x = canvas.width;
    const y =
      Math.random() * (((canvas.height - robotHeight) * 2) / 3) +
      canvas.height / 6;
    const vx = -1;

    robots.push(new Robot(x, y, 100, vx));
  }, 1000);
};

document.addEventListener("click", (e) => {
  shots.push([e.x, e.y]);
  console.log(JSON.stringify(shots));
});

const animate = () => {
  requestAnimationFrame(animate);

  if (!loaded) return;
  if (loaded && !spawning) {
    spawning = true;
    spawnRobots();
  }

  c.clearRect(0, 0, canvas.width, canvas.height);

  robots.forEach((r, robotIndex) => {
    shots.forEach(([x, y]) => {
      if (r.x <= x && r.x + r.width >= x && r.y <= y && r.y + r.height >= y) {
        setTimeout(() => {
          robots.splice(robotIndex, 1);
        });
      }
    });

    r.update();

    if (r.x < 0 - r.width) {
      setTimeout(() => {
        robots.splice(robotIndex, 1);
      });
    }
  });
  shots = [];
};

animate();
