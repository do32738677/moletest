const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const scoreDisplay = document.getElementById('score');

let score = 0;
let moleX = 0;
let moleY = 0;
let gameInterval;

// 載入圖片
const moleImage = new Image();
moleImage.src = 'images/mole.png';

// 隨機生成地鼠位置
function getRandomPosition() {
    const x = Math.floor(Math.random() * (canvas.width - 50));
    const y = Math.floor(Math.random() * (canvas.height - 50));
    return { x, y };
}

// 畫地鼠
function drawMole() {
    const position = getRandomPosition();
    moleX = position.x;
    moleY = position.y;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(moleImage, moleX, moleY, 50, 50);
}

// 更新分數
function updateScore() {
    score++;
    scoreDisplay.textContent = score;
}

// 處理滑鼠點擊事件
canvas.addEventListener('click', (event) => {
    const rect = canvas.getBoundingClientRect();
    const clickX = event.clientX - rect.left;
    const clickY = event.clientY - rect.top;

    if (clickX >= moleX && clickX <= moleX + 50 && clickY >= moleY && clickY <= moleY + 50) {
        updateScore();
        drawMole();
    }
});

// 開始遊戲
function startGame() {
    score = 0;
    scoreDisplay.textContent = score;
    drawMole();
    gameInterval = setInterval(drawMole, 1000);
}

// 結束遊戲
function endGame() {
    clearInterval(gameInterval);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    alert(`遊戲結束！您的最終分數是 ${score}`);
}
