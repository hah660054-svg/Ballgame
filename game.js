// CANVAS & GAME ENGINE CONTROLLER
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

let camera = { x: 0, y: 0 };
let activeMapData = null;
let isRunning = false;
let player1 = null;
let villain = null;

let moveVec = { x: 0, y: 0 };
let aimVec = { x: 0, y: 0 };
const keys = {};

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
window.addEventListener('resize', resizeCanvas);
resizeCanvas();

// TOUCH CONTROLS BINDINGS
function setupJoystick(baseId, thumbId, onMove, onEnd) {
    const base = document.getElementById(baseId);
    const thumb = document.getElementById(thumbId);
    let activeId = null;

    function handleMove(clientX, clientY) {
        const rect = base.getBoundingClientRect();
        const cx = rect.left + rect.width / 2;
        const cy = rect.top + rect.height / 2;
        let dx = clientX - cx;
        let dy = clientY - cy;
        const maxR = rect.width / 2 - 15;
        const dist = Math.hypot(dx, dy);

        if (dist > maxR) {
            dx = (dx / dist) * maxR;
            dy = (dy / dist) * maxR;
        }
        thumb.style.transform = `translate(calc(-50% + ${dx}px), calc(-50% + ${dy}px))`;
        onMove(dx / maxR, dy / maxR);
    }

    base.addEventListener('pointerdown', (e) => {
        activeId = e.pointerId;
        handleMove(e.clientX, e.clientY);
    });

    window.addEventListener('pointermove', (e) => {
        if (e.pointerId === activeId) handleMove(e.clientX, e.clientY);
    });

    const stop = (e) => {
        if (e.pointerId === activeId) {
            activeId = null;
            thumb.style.transform = 'translate(-50%, -50%)';
            onEnd();
        }
    };
    window.addEventListener('pointerup', stop);
    window.addEventListener('pointercancel', stop);
}

setupJoystick('moveJoystickBase', 'moveJoystickThumb', (x, y) => { moveVec.x = x; moveVec.y = y; }, () => { moveVec.x = 0; moveVec.y = 0; });
setupJoystick('aimJoystickBase', 'aimJoystickThumb', (x, y) => { aimVec.x = x; aimVec.y = y; }, () => { aimVec.x = 0; aimVec.y = 0; });

document.getElementById('btnJump').addEventListener('pointerdown', () => { if (player1 && player1.isGrounded) player1.vy = -15; });
document.getElementById('btnSkill1').addEventListener('pointerdown', () => { if (player1 && villain) player1.useSkill1(aimVec, villain, activeMapData.worldWidth, activeMapData.worldHeight); });
document.getElementById('btnSkill2').addEventListener('pointerdown', () => { if (player1 && villain) player1.useSkill2(aimVec, villain); });
document.getElementById('btnSkill3').addEventListener('pointerdown', () => { if (player1 && villain) player1.useSkill3(aimVec, villain); });

window.addEventListener('keydown', (e) => {
    keys[e.code] = true;
    if (e.code === 'KeyW' || e.code === 'ArrowUp') if (player1?.isGrounded) player1.vy = -15;
    if (e.code === 'Digit1') player1?.useSkill1(aimVec, villain, activeMapData.worldWidth, activeMapData.worldHeight);
    if (e.code === 'Digit2') player1?.useSkill2(aimVec, villain);
    if (e.code === 'Digit3') player1?.useSkill3(aimVec, villain);
});
window.addEventListener('keyup', (e) => { keys[e.code] = false; });

// START GAME ENTRY POINT
document.getElementById('startBattleBtn').addEventListener('click', () => {
    document.getElementById('mapSelectScreen').classList.add('hidden');
    activeMapData = getMapData(selectedMap, canvas.width, canvas.height);

    const chosenHero = HEROES_DATABASE.find(h => h.id === selectedHero) || HEROES_DATABASE[0];

    player1 = new Fighter({ x: 100, y: 100, name: chosenHero.name, color: chosenHero.color, heroId: chosenHero.id, isAI: false });
    villain = new Fighter({ x: activeMapData.worldWidth - 140, y: 100, name: 'Infernal Villain', color: '#ff2200', heroId: 'Hero2', isAI: true });

    document.getElementById('hudP1Name').innerText = player1.name;
    document.getElementById('hudP2Name').innerText = villain.name;

    isRunning = true;
});

document.getElementById('restartBtn').addEventListener('click', () => {
    document.getElementById('gameOverModal').classList.add('hidden');
    document.getElementById('heroSelectScreen').classList.remove('hidden');
    updateMemoryUI();
});

// ENGINE MAIN LOOP
function gameLoop() {
    requestAnimationFrame(gameLoop);
    if (!isRunning) return;

    let inputX = moveVec.x;
    if (keys['KeyA'] || keys['ArrowLeft']) inputX = -1;
    if (keys['KeyD'] || keys['ArrowRight']) inputX = 1;
    player1.vx = inputX * player1.speed;

    player1.update(activeMapData, villain, activeMapData.worldWidth, activeMapData.worldHeight);
    villain.update(activeMapData, player1, activeMapData.worldWidth, activeMapData.worldHeight);

    if (activeMapData.isMassive) {
        camera.x = player1.x + player1.width / 2 - canvas.width / 2;
        camera.y = player1.y + player1.height / 2 - canvas.height / 2;
        camera.x = Math.max(0, Math.min(activeMapData.worldWidth - canvas.width, camera.x));
        camera.y = Math.max(0, Math.min(activeMapData.worldHeight - canvas.height, camera.y));
    } else {
        camera.x = 0;
        camera.y = 0;
    }

    ctx.fillStyle = activeMapData.bg;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.save();
    ctx.translate(-camera.x, -camera.y);

    activeMapData.platforms.forEach(p => {
        ctx.fillStyle = p.color;
        ctx.fillRect(p.x, p.y, p.w, p.h);
        ctx.strokeStyle = p.border;
        ctx.lineWidth = 2;
        ctx.strokeRect(p.x, p.y, p.w, 3);
    });

    activeMapData.obstacles.forEach(o => {
        ctx.fillStyle = o.color;
        ctx.fillRect(o.x, o.y, o.w, o.h);
        ctx.strokeStyle = o.border;
        ctx.strokeRect(o.x, o.y, o.w, o.h);
    });

    player1.draw(ctx);
    villain.draw(ctx);

    activeMapData.bushes.forEach(b => {
        ctx.fillStyle = b.color;
        ctx.fillRect(b.x, b.y, b.w, b.h);
        ctx.strokeStyle = b.border;
        ctx.lineWidth = 1;
        ctx.strokeRect(b.x, b.y, b.w, b.h);
    });

    ctx.restore();

    document.getElementById('hudP1HpBar').style.width = `${(player1.health / player1.maxHealth) * 100}%`;
    document.getElementById('hudP2HpBar').style.width = `${(villain.health / villain.maxHealth) * 100}%`;
    document.getElementById('hudP1HpText').innerText = `${Math.ceil(player1.health)} / 100`;
    document.getElementById('hudP2HpText').innerText = `${Math.ceil(villain.health)} / 100`;

    if (player1.health <= 0 || villain.health <= 0) {
        isRunning = false;
        const modal = document.getElementById('gameOverModal');
        const winText = document.getElementById('winnerText');
        const winSub = document.getElementById('winnerSubText');
        modal.classList.remove('hidden');

        if (player1.health > 0) {
            winText.innerText = "VICTORY!";
            winText.className = "text-3xl font-black text-amber-400 mb-2";
            winSub.innerText = "You defeated the Infernal Villain!";
            Storage.addWin();
        } else {
            winText.innerText = "DEFEAT!";
            winText.className = "text-3xl font-black text-red-500 mb-2";
            winSub.innerText = "The Villain claimed your soul.";
            Storage.addLoss();
        }
    }
}

requestAnimationFrame(gameLoop);
