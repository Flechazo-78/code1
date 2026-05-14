const dragon = document.getElementById('dragon');
const obstacle = document.getElementById('obstacle');
const scoreNode = document.getElementById('score');
const bestNode = document.getElementById('best');
const overlay = document.getElementById('overlay');
const overlayText = document.getElementById('overlayText');
const startBtn = document.getElementById('startBtn');
const game = document.getElementById('game');

let playing = false;
let score = 0;
let best = Number(localStorage.getItem('dragon-best') || 0);
let obstacleX = -70;
let speed = 5.5;
let loopId;
let scoreTimer;
let jumpLocked = false;

bestNode.textContent = best;

function jump() {
  if (!playing || jumpLocked) return;
  jumpLocked = true;
  dragon.classList.add('jump');

  setTimeout(() => {
    dragon.classList.remove('jump');
    jumpLocked = false;
  }, 560);
}

function randomObstacleStart() {
  const base = game.clientWidth + 80;
  const extra = Math.random() * 180;
  obstacleX = base + extra;
}

function hitTest() {
  const dragonRect = dragon.getBoundingClientRect();
  const obstacleRect = obstacle.getBoundingClientRect();

  return !(
    dragonRect.right - 10 < obstacleRect.left + 6 ||
    dragonRect.left + 10 > obstacleRect.right - 6 ||
    dragonRect.bottom - 8 < obstacleRect.top + 6 ||
    dragonRect.top + 10 > obstacleRect.bottom - 8
  );
}

function stopGame() {
  playing = false;
  cancelAnimationFrame(loopId);
  clearInterval(scoreTimer);
  overlay.classList.remove('hidden');
  overlayText.textContent = `游戏结束！得分 ${score}`;
  startBtn.textContent = '再来一局';

  if (score > best) {
    best = score;
    localStorage.setItem('dragon-best', String(best));
    bestNode.textContent = best;
  }
}

function gameLoop() {
  obstacleX -= speed;
  obstacle.style.transform = `translateX(${obstacleX}px)`;

  if (obstacleX < -game.clientWidth - 120) {
    randomObstacleStart();
    speed += 0.15;
  }

  if (hitTest()) {
    stopGame();
    return;
  }

  loopId = requestAnimationFrame(gameLoop);
}

function startGame() {
  playing = true;
  score = 0;
  speed = 5.5;
  jumpLocked = false;
  scoreNode.textContent = score;
  overlay.classList.add('hidden');
  randomObstacleStart();

  scoreTimer = setInterval(() => {
    score += 1;
    scoreNode.textContent = score;
  }, 120);

  loopId = requestAnimationFrame(gameLoop);
}

function handleKey(event) {
  if (event.code === 'Space' || event.code === 'ArrowUp') {
    event.preventDefault();

    if (!playing) {
      startGame();
    }

    jump();
  }
}

startBtn.addEventListener('click', startGame);
document.addEventListener('keydown', handleKey);
