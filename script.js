// 選取畫布與上下文
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// 選取主選單與遊戲容器
const mainMenu = document.getElementById('main-menu');
const gameContainer = document.getElementById('game-container');

// 遊戲狀態變數
let score = 0;
let timeRemaining = 30;
let moleX, moleY;
const moleSize = 50;
let timerInterval;

// 地鼠圖片
const moleImage = new Image();
moleImage.src = './images/mole.png'; // 地鼠圖片

// 開始遊戲
function startGame(mode) {
    // 切換到遊戲畫面
    mainMenu.style.display = 'none';
    gameContainer.style.display = 'block';

    // 初始化分數與時間
    score = 0;
    timeRemaining = 30; // 統一遊戲時間為 30 秒
    updateScoreAndTime();

    // 開始計時與刷新地鼠
    spawnMole();
    timerInterval = setInterval(updateTime, 1000);
}

// 返回主選單
function goBack() {
    clearInterval(timerInterval); // 停止計時器
    mainMenu.style.display = 'flex';
    gameContainer.style.display = 'none';
}

// 離開遊戲
function exitGame() {
    alert('感謝遊玩！');
    window.location.reload(); // 重新載入頁面
}

// 重新開始遊戲
function restartGame() {
    clearInterval(timerInterval); // 清除計時器
    startGame('easy'); // 默認重新開始為簡單模式
}

// 更新時間
function updateTime() {
    timeRemaining--;
    updateScoreAndTime();

    if (timeRemaining <= 0) {
        clearInterval(timerInterval);
        alert(`遊戲結束！您的分數是 ${score}`);
        goBack(); // 返回主畫面
    }
}

// 更新分數與時間
function updateScoreAndTime() {
    document.getElementById('score').textContent = `分數: ${score}`;
    document.getElementById('time').textContent = `剩餘時間: ${timeRemaining} 秒`;
}

// 產生地鼠
function spawnMole() {
    moleX = Math.random() * (canvas.width - moleSize);
    moleY = Math.random() * (canvas.height - moleSize);
    drawMole();
}

// 畫地鼠
function drawMole() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(moleImage, moleX, moleY, moleSize, moleSize);
}

// 點擊事件判定
canvas.addEventListener('click', (e) => {
    const rect = canvas.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const clickY = e.clientY - rect.top;

    if (clickX >= moleX && clickX <= moleX + moleSize &&
        clickY >= moleY && clickY <= moleY + moleSize) {
        score++; // 點擊命中加分
        spawnMole();
    }
});
