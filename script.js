const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

let score = 0;
let misses = 0;
let timeRemaining = 30;
let moleX, moleY, moleType;
let moleSize = 50;
let gameInterval, moleTimeout;
let mode = 'easy';
const maxMisses = 5;
const highScores = {
    easy: localStorage.getItem('easyHighScore') ? parseInt(localStorage.getItem('easyHighScore'), 10) : 0,
    hard: localStorage.getItem('hardHighScore') ? parseInt(localStorage.getItem('hardHighScore'), 10) : 0,
};

const moleImage = new Image();
const redMoleImage = new Image();
const goldMoleImage = new Image();
const burrowImage = new Image();
const backgroundImage = new Image();

moleImage.src = './images/mole.png';
redMoleImage.src = './images/redmole.png';
goldMoleImage.src = './images/goldmole.png';
burrowImage.src = './images/burrow.png';
backgroundImage.src = './images/background.png';

const burrowPositions = [
    { x: 100, y: 100 }, { x: 200, y: 100 }, { x: 300, y: 100 },
    { x: 100, y: 200 }, { x: 200, y: 200 }, { x: 300, y: 200 },
    { x: 100, y: 300 }, { x: 200, y: 300 }, { x: 300, y: 300 }
];

function startGame(selectedMode) {
    mode = selectedMode;
    score = 0;
    misses = 0;
    timeRemaining = 30;
    updateUI();
    document.getElementById('main-menu').style.display = 'none';
    document.getElementById('game-container').style.display = 'block';
    drawBackground();
    drawBurrows();
    spawnMole();
    gameInterval = setInterval(updateTime, 1000);
}

function drawBackground() {
    ctx.drawImage(backgroundImage, 0, 0, canvas.width, canvas.height);
}

function drawBurrows() {
    burrowPositions.forEach(pos => {
        ctx.drawImage(burrowImage, pos.x, pos.y, moleSize, moleSize);
    });
}

function spawnMole() {
    if (timeRemaining <= 0) return;

    drawBackground();
    drawBurrows();

    const randomPos = burrowPositions[Math.floor(Math.random() * burrowPositions.length)];
    moleX = randomPos.x;
    moleY = randomPos.y;

    if (mode === 'special') {
        const moleTypes = [moleImage, redMoleImage, goldMoleImage];
        moleType = Math.floor(Math.random() * moleTypes.length);
        ctx.drawImage(moleTypes[moleType], moleX, moleY, moleSize, moleSize);
    } else {
        moleType = 0;
        ctx.drawImage(moleImage, moleX, moleY, moleSize, moleSize);
    }

    // 每次地鼠生成時，確保重新設定定時器
    clearTimeout(moleTimeout);
    moleTimeout = setTimeout(spawnMole, mode === 'easy' ? 1000 : 800);
}

function updateUI() {
    document.getElementById('score').textContent = `分數: ${score}`;
    document.getElementById('misses').textContent = `失誤次數: ${misses}`;
    document.getElementById('time').textContent = `剩餘時間: ${timeRemaining} 秒`;
    document.getElementById('easy-high-score').textContent = highScores.easy;
    document.getElementById('hard-high-score').textContent = highScores.hard;
}

function updateTime() {
    timeRemaining--;
    updateUI();
    if (timeRemaining <= 0) endGame();
}

canvas.addEventListener('click', (e) => {
    const rect = canvas.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const clickY = e.clientY - rect.top;

    const isHit = clickX >= moleX && clickX <= moleX + moleSize &&
                  clickY >= moleY && clickY <= moleY + moleSize;

    if (isHit) {
        if (mode === 'special') {
            score += moleType === 2 ? 5 : moleType === 1 ? -2 : 1;
        } else {
            score++;
        }
        clearTimeout(moleTimeout);
        spawnMole();
    } else {
        misses++;
        if (misses >= maxMisses) endGame();
    }
    updateUI();
});

function endGame() {
    clearInterval(gameInterval);
    clearTimeout(moleTimeout);

    alert(`遊戲結束！得分: ${score}`);
    if (score > highScores[mode]) {
        highScores[mode] = score;
        localStorage.setItem(`${mode}HighScore`, score);
    }
    goBack();
}

function restartGame() {
    startGame(mode);
}

function goBack() {
    document.getElementById('game-container').style.display = 'none';
    document.getElementById('main-menu').style.display = 'flex';
}

function exitGame() {
    if (confirm('您確定要離開遊戲嗎？')) {
        window.close();
    }
}
