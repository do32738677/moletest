const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

let score = 0;
let timeRemaining = 30;
let moleX, moleY;
const moleSize = 50;

function startGame() {
    score = 0;
    timeRemaining = 30;
    spawnMole();
    setInterval(updateTime, 1000);
}

function spawnMole() {
    moleX = Math.random() * (canvas.width - moleSize);
    moleY = Math.random() * (canvas.height - moleSize);
    drawMole();
}

function drawMole() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "brown";
    ctx.fillRect(moleX, moleY, moleSize, moleSize);
}

function updateTime() {
    timeRemaining--;
    if (timeRemaining <= 0) alert(`遊戲結束！分數: ${score}`);
}

canvas.addEventListener('click', (e) => {
    const rect = canvas.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const clickY = e.clientY - rect.top;

    if (clickX >= moleX && clickX <= moleX + moleSize &&
        clickY >= moleY && clickY <= moleY + moleSize) {
        score++;
        spawnMole();
    }
});
