// 宣告遊戲需要的變數
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const scoreElement = document.getElementById('score');
const timeElement = document.getElementById('time');
const missesElement = document.getElementById('misses');
const easyHighScoreElement = document.getElementById('easy-high-score');
const hardHighScoreElement = document.getElementById('hard-high-score');

// 初始化數據
let score = 0; // 分數
let misses = 0; // 失誤次數
let timeRemaining = 30; // 遊戲時間
let moleX, moleY, moleType; // 地鼠的位置和類型
let moleSize = 50; // 地鼠的大小
let moleAppearTime = 1000; // 地鼠出現的間隔時間
let gameInterval; // 遊戲倒數計時器
let moleTimeout; // 地鼠的計時器
let mode = 'easy'; // 當前模式
let maxMisses = 5; // 最大失誤次數
let highScores = { easy: 0, hard: 0 }; // 儲存高分

// 載入圖片
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

// 地洞位置
const burrowPositions = [
    { x: 125, y: 125 }, { x: 225, y: 125 }, { x: 325, y: 125 },
    { x: 125, y: 225 }, { x: 225, y: 225 }, { x: 325, y: 225 },
    { x: 125, y: 325 }, { x: 225, y: 325 }, { x: 325, y: 325 }
];

// 載入高分紀錄
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
    mode = selectedMode; // 設定模式
    score = 0;
    misses = 0;
    timeRemaining = 30;
    moleAppearTime = mode === 'easy' ? 1000 : 800;
    updateUI();

    // 顯示遊戲畫面，隱藏主選單
    document.getElementById('main-menu').style.display = 'none';
    document.getElementById('game-container').style.display = 'block';

    clearInterval(gameInterval); // 確保計時器不會重複
    clearTimeout(moleTimeout);
    drawBackground();
    drawBurrows();
    spawnMole(); // 生成地鼠
    gameInterval = setInterval(updateTime, 1000); // 每秒更新時間
}

// 更新 UI
function updateUI() {
    scoreElement.textContent = `分數: ${score}`;
    missesElement.textContent = `失誤次數: ${misses}`;
    timeElement.textContent = `剩餘時間: ${timeRemaining} 秒`;
}

// 繪製背景
function drawBackground() {
    ctx.drawImage(backgroundImage, 0, 0, canvas.width, canvas.height);
}

// 繪製地洞
function drawBurrows() {
    burrowPositions.forEach(pos => {
        ctx.drawImage(burrowImage, pos.x, pos.y, moleSize, moleSize);
    });
}

// 生成地鼠
function spawnMole() {
    if (timeRemaining <= 0) return; // 時間到就不生成地鼠了

    drawBackground();
    drawBurrows();

    // 隨機生成地鼠
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

// 點擊事件
canvas.addEventListener('click', (e) => {
    const rect = canvas.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const clickY = e.clientY - rect.top;

    const isHit = clickX >= moleX && clickX <= moleX + moleSize &&
                  clickY >= moleY && clickY <= moleY + moleSize;

    if (isHit) {
        if (mode === 'special') {
            if (moleType === 0) score += 1;
            if (moleType === 1) score = Math.max(0, score - 2);
            if (moleType === 2) score += 5;
        } else {
            score++;
        }
        spawnMole();
    } else {
        misses++;
    }

    if (misses >= maxMisses) endGame();
    updateUI();
});

// 時間倒數
function updateTime() {
    timeRemaining--;
    updateUI();

    if (timeRemaining <= 0) endGame();
}

// 結束遊戲
function endGame() {
    alert(`遊戲結束！分數：${score}`);
    goBack();
}

// 返回主選單
function goBack() {
    clearInterval(gameInterval);
    clearTimeout(moleTimeout);
    document.getElementById('game-container').style.display = 'none';
    document.getElementById('main-menu').style.display = 'block';
}

// 離開遊戲
function exitGame() {
    if (confirm('確定要離開遊戲嗎？')) {
        window.close();
    } else {
        alert('手動關閉頁面即可！');
    }
}
