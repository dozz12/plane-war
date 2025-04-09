const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const player = {
  x: 175,
  y: 550,
  width: 50,
  height: 20,
  color: "lime"
};

const bullets = [];
const enemies = [];

let keys = {};

function drawPlayer() {
  ctx.fillStyle = player.color;
  ctx.fillRect(player.x, player.y, player.width, player.height);
}

function drawBullets() {
  ctx.fillStyle = "yellow";
  bullets.forEach(b => {
    ctx.fillRect(b.x, b.y, b.width, b.height);
    b.y -= 5;
  });
}

function drawEnemies() {
  ctx.fillStyle = "red";
  enemies.forEach(e => {
    ctx.fillRect(e.x, e.y, e.width, e.height);
    e.y += 1;
  });
}

function detectCollisions() {
  for (let i = enemies.length - 1; i >= 0; i--) {
    for (let j = bullets.length - 1; j >= 0; j--) {
      const e = enemies[i];
      const b = bullets[j];
      if (b.x < e.x + e.width &&
          b.x + b.width > e.x &&
          b.y < e.y + e.height &&
          b.y + b.height > e.y) {
        enemies.splice(i, 1);
        bullets.splice(j, 1);
        break;
      }
    }
  }
}

function gameLoop() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawPlayer();
  drawBullets();
  drawEnemies();
  detectCollisions();
  movePlayer();
  requestAnimationFrame(gameLoop);
}

function movePlayer() {
  if (keys["ArrowLeft"] && player.x > 0) {
    player.x -= 5;
  }
  if (keys["ArrowRight"] && player.x + player.width < canvas.width) {
    player.x += 5;
  }
}

function shootBullet() {
  bullets.push({
    x: player.x + player.width / 2 - 2.5,
    y: player.y,
    width: 5,
    height: 10
  });
}

function spawnEnemy() {
  const x = Math.random() * (canvas.width - 40);
  enemies.push({ x, y: 0, width: 40, height: 20 });
}

setInterval(spawnEnemy, 1500);
gameLoop();

// Keyboard
document.addEventListener("keydown", (e) => {
  keys[e.key] = true;
  if (e.key === " ") shootBullet();
});

document.addEventListener("keyup", (e) => {
  keys[e.key] = false;
});

// Mobile Controls
document.getElementById("left").addEventListener("touchstart", () => keys["ArrowLeft"] = true);
document.getElementById("right").addEventListener("touchstart", () => keys["ArrowRight"] = true);
document.getElementById("left").addEventListener("touchend", () => keys["ArrowLeft"] = false);
document.getElementById("right").addEventListener("touchend", () => keys["ArrowRight"] = false);
document.getElementById("shoot").addEventListener("touchstart", shootBullet);
