const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const scoreElement = document.getElementById('score');
const timeElement = document.getElementById('time');
const missesElement = document.getElementById('misses');

let score = 0;
let misses = 0;
let timeRemaining = 30;
let gameInterval;
let moleTimeout;
let mode = 'easy';
let moleX, moleY, moleType;

const moleSize = 50;
const burrowPositions = [
    { x: 100, y: 100 },
    { x: 200, y: 100 },
    { x: 300, y: 100 },
    { x: 100, y: 200 },
    { x: 200, y: 200 },
    { x: 300, y: 200 },
    { x: 100, y: 300 },
    { x: 200, y: 300 },
    { x: 300, y: 300 },
];

// 載入圖片
const moleImage = new Image();
moleImage.src = 'images/mole.png';

const redMoleImage = new Image();
redMoleImage.src = 'images/redmole.png';

const goldMoleImage = new Image();
goldMoleImage.src = 'images/goldmole.png';

const burrowImage = new Image();
burrowImage.src = 'images/burrow.png';

function startGame(selectedMode) {
    mode = selectedMode;
    score = 0;
    misses = 0;
    timeRemaining = 30;
    moleType = 0;

    scoreElement.textContent = `分數: ${score}`;
    missesElement.textContent = `失誤次數: ${misses}`;
    timeElement.textContent = `剩餘時間: ${timeRemaining} 秒`;

    document.getElementById('main-menu').style.display = 'none';
    document.getElementById('game-container').style.display = 'block';

    drawBackground();
    spawnMole();
    gameInterval = setInterval(updateTime, 1000);
}

function drawBackground() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    burrowPositions.forEach((pos) => {
        ctx.drawImage(burrowImage, pos.x, pos.y, moleSize, moleSize);
    });
}

function spawnMole() {
    if (timeRemaining <= 0) return;

    const randomIndex = Math.floor(Math.random() * burrowPositions.length);
    const position = burrowPositions[randomIndex];
    moleX = position.x;
    moleY = position.y;

    drawBackground();

    if (mode === 'special') {
        const moleImages = [moleImage, redMoleImage, goldMoleImage];
        moleType = Math.floor(Math.random() * moleImages.length);
        ctx.drawImage(moleImages[moleType], moleX, moleY, moleSize, moleSize);
    } else {
        moleType = 0;
        ctx.drawImage(moleImage, moleX, moleY, moleSize, moleSize);
    }

    moleTimeout = setTimeout(spawnMole, mode === 'easy' ? 1000 : 800);
}

function updateScore() {
    if (mode === 'special') {
        if (moleType === 0) score += 1;
        if (moleType === 1) score = Math.max(0, score - 2);
        if (moleType === 2) score += 5;
    } else {
        score += 1;
    }
    scoreElement.textContent = `分數: ${score}`;
}

function updateTime() {
    timeRemaining--;
    timeElement.textContent = `剩餘時間: ${timeRemaining} 秒`;
    if (timeRemaining <= 0) {
        clearInterval(gameInterval);
        endGame();
    }
}

canvas.addEventListener('click', (event) => {
    const rect = canvas.getBoundingClientRect();
    const clickX = event.clientX - rect.left;
    const clickY = event.clientY - rect.top;

    const isHit = clickX >= moleX && clickX <= moleX + moleSize &&
                  clickY >= moleY && clickY <= moleY + moleSize;

    if (isHit) {
        updateScore();
        clearTimeout(moleTimeout);
        spawnMole();
    } else {
        misses += 1;
        missesElement.textContent = `失誤次數: ${misses}`;
    }
});

function endGame() {
    clearInterval(gameInterval);
    clearTimeout(moleTimeout);
    alert(`遊戲結束！你的分數是 ${score}`);
    document.getElementById('game-container').style.display = 'none';
    document.getElementById('main-menu').style.display = 'flex';
}

function exitGame() {
    window.close(); // 嘗試直接關閉頁面
}
