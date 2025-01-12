const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

let score = 0, misses = 0, timeRemaining = 30, moleX, moleY, moleType;
let moleSize = 50, gameInterval, moleTimeout, mode = 'easy';
let highScores = { easy: 0, hard: 0 };
const maxMisses = 5;

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

function drawBackground() {
    ctx.drawImage(backgroundImage, 0, 0, canvas.width, canvas.height);
    burrowPositions.forEach(pos => ctx.drawImage(burrowImage, pos.x, pos.y, moleSize, moleSize));
}

function spawnMole() {
    if (timeRemaining <= 0) return;
    drawBackground();

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

    clearTimeout(moleTimeout);
    moleTimeout = setTimeout(spawnMole, mode === 'easy' ? 1000 : 800);
}

function updateScore() {
    score += (moleType === 2 ? 5 : 1);
    document.getElementById('score').textContent = `分數: ${score}`;
}

function updateTime() {
    timeRemaining--;
    document.getElementById('time').textContent = `剩餘時間: ${timeRemaining} 秒`;
    if (timeRemaining <= 0) endGame();
}

function endGame() {
    alert(`遊戲結束！得分: ${score}`);
    goBack();
}

function exitGame() {
    alert('感謝遊玩！請手動關閉視窗。');
}
