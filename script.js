// 宣告需要的變數和元素
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const scoreElement = document.getElementById('score');
const timeElement = document.getElementById('time');
const missesElement = document.getElementById('misses');
const easyHighScoreElement = document.getElementById('easy-high-score');
const hardHighScoreElement = document.getElementById('hard-high-score');

let score = 0; // 分數
let misses = 0; // 失誤次數
let timeRemaining = 30; // 遊戲時間
let moleX, moleY, moleType; // 地鼠位置和類型
let moleSize = 50; // 地鼠大小
let moleAppearTime = 1000; // 地鼠出現時間間隔
let gameInterval; // 計時器
let mode = 'easy'; // 遊戲模式
let highScores = { easy: 0, hard: 0 }; // 高分記錄
let moleTimeout;
let maxMisses = 5; // 最大失誤次數

// 圖片
const moleImage = new Image();
moleImage.src = 'images/mole.png';

const redMoleImage = new Image();
redMoleImage.src = 'images/redmole.png';

const goldMoleImage = new Image();
goldMoleImage.src = 'images/goldmole.png';

const burrowImage = new Image();
burrowImage.src = 'images/burrow.png';

const backgroundImage = new Image();
backgroundImage.src = 'images/background.png';

// 九個地洞的位置
const burrowPositions = [
    { x: 125, y: 125 }, { x: 225, y: 125 }, { x: 325, y: 125 },
    { x: 125, y: 225 }, { x: 225, y: 225 }, { x: 325, y: 225 },
    { x: 125, y: 325 }, { x: 225, y: 325 }, { x: 325, y: 325 }
];

// 讀取高分記錄
if (localStorage.getItem('easyHighScore')) {
    highScores.easy = parseInt(localStorage.getItem('easyHighScore'), 10);
    easyHighScoreElement.textContent = highScores.easy;
}
if (localStorage.getItem('hardHighScore')) {
    highScores.hard = parseInt(localStorage.getItem('hardHighScore'), 10);
    hardHighScoreElement.textContent = highScores.hard;
}

// 開始遊戲
function startGame(selectedMode) {
    mode = selectedMode;
    score = 0;
    misses = 0;
    timeRemaining = 30;
    moleAppearTime = mode === 'easy' ? 1000 : 800;
    scoreElement.textContent = `分數: ${score}`;
    missesElement.textContent = `失誤次數: ${misses}`;
    timeElement.textContent = `剩餘時間: ${timeRemaining} 秒`;
    document.getElementById('main-menu').style.display = 'none';
    document.getElementById('game-container').style.display = 'block';

    clearInterval(gameInterval);
    clearTimeout(moleTimeout);
    drawBackground();
    drawBurrows();
    spawnMole();
    gameInterval = setInterval(updateTime, 1000);
}

// 背景
function drawBackground() {
    ctx.drawImage(backgroundImage, 0, 0, canvas.width, canvas.height);
}

// 地洞
function drawBurrows() {
    burrowPositions.forEach(pos => {
        ctx.drawImage(burrowImage, pos.x, pos.y, moleSize, moleSize);
    });
}

// 生成地鼠區
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
        ctx.drawImage(moleImage, moleX, moleY, moleSize, moleSize);
    }

    clearTimeout(moleTimeout);
    moleTimeout = setTimeout(spawnMole, moleAppearTime);
}

// 結束即時更新分數
function updateScore() {
    if (mode === 'special') {
        if (moleType === 0) score += 1;
        else if (moleType === 1) score = Math.max(0, score - 2);
        else if (moleType === 2) score += 5;
    } else {
        score++;
    }
    scoreElement.textContent = `分數: ${score}`;
}

// 更新遊戲的時間
function updateTime() {
    timeRemaining--;
    timeElement.textContent = `剩餘時間: ${timeRemaining} 秒`;

    if (timeRemaining <= 0) {
        clearInterval(gameInterval);
        clearTimeout(moleTimeout);
        endGame();
    }
}

// 處理玩家有沒有點到
canvas.addEventListener('click', (e) => {
    const rect = canvas.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const clickY = e.clientY - rect.top;

    const isHit = clickX >= moleX && clickX <= moleX + moleSize &&
                  clickY >= moleY && clickY <= moleY + moleSize;

    if (isHit) {
        updateScore();
        drawBackground();
        drawBurrows();
        clearTimeout(moleTimeout);
        spawnMole();
    } else {
        misses++;
        missesElement.textContent = `失誤次數: ${misses}`;
        if (misses >= maxMisses) {
            endGame();
        }
    }
});

// 結束遊戲
function endGame() {
    alert(`遊戲結束！你的分數是 ${score} 分`);
    if (score > highScores[mode]) {
        highScores[mode] = score;
        localStorage.setItem(`${mode}HighScore`, score);
        if (mode === 'easy') easyHighScoreElement.textContent = highScores.easy;
        else if (mode === 'hard') hardHighScoreElement.textContent = highScores.hard;
    }
    goBack();
}

// 重新開始遊戲
function restartGame() {
    startGame(mode);
}

// 返回主選單
function goBack() {
    clearInterval(gameInterval);
    clearTimeout(moleTimeout);
    document.getElementById('game-container').style.display = 'none';
    document.getElementById('main-menu').style.display = 'flex';
}

// 離開遊戲
function exitGame() {
    if (confirm('確定要離開遊戲嗎？')) {
        window.close();
    } else {
        alert('請允許關閉此頁面或手動退出');
    }
}
