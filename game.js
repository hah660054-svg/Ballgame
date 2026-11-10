// ==========================================
// FIGHTER CLASS FALLBACK (If fighter.js is missing)
// ==========================================
if (typeof Fighter === 'undefined') {
    window.Fighter = class Fighter {
        constructor({ x, y, name, color, heroId = 'Hero1', isAI = false }) {
            this.x = x;
            this.y = y;
            this.name = name;
            this.color = color;
            this.heroId = heroId;
            this.width = 40;
            this.height = 40;
            this.vx = 0;
            this.vy = 0;
            this.speed = 6.5;
            this.health = 100;
            this.maxHealth = 100;
            this.isGrounded = false;
            this.isAI = isAI;
            this.isStealth = false;
            this.cd1 = 0;
            this.cd2 = 0;
            this.cd3 = 0;
        }

        draw(ctx) {
            ctx.save();
            if (this.isStealth) ctx.globalAlpha = 0.35;

            ctx.fillStyle = 'rgba(0,0,0,0.5)';
            ctx.beginPath();
            ctx.ellipse(this.x + 20, this.y + 38, 18, 6, 0, 0, Math.PI * 2);
            ctx.fill();

            const centerX = this.x + 20;
            const centerY = this.y + 20;
            const grad = ctx.createRadialGradient(centerX, centerY, 3, centerX, centerY, 20);
            grad.addColorStop(0, '#ffffff');
            grad.addColorStop(0.5, this.color);
            grad.addColorStop(1, '#000000');

            ctx.beginPath();
            ctx.arc(centerX, centerY, 20, 0, Math.PI * 2);
            ctx.fillStyle = grad;
            ctx.shadowColor = this.color;
            ctx.shadowBlur = 12;
            ctx.fill();
            ctx.strokeStyle = '#ffffff';
            ctx.lineWidth = 1.5;
            ctx.stroke();
            ctx.restore();
        }

        update(mapData, opponent, worldWidth, worldHeight) {
            if (this.cd1 > 0) this.cd1 -= 1/60;
            if (this.cd2 > 0) this.cd2 -= 1/60;
            if (this.cd3 > 0) this.cd3 -= 1/60;

            this.x += this.vx;
            this.vy += 0.65;
            this.y += this.vy;

            if (this.x < 0) this.x = 0;
            if (this.x + this.width > worldWidth) this.x = worldWidth - this.width;

            this.isGrounded = false;
            if (mapData && mapData.platforms) {
                mapData.platforms.forEach(p => {
                    if (
                        this.x + this.width > p.x &&
                        this.x < p.x + p.w &&
                        this.y + this.height >= p.y &&
                        this.y + this.height - this.vy <= p.y + 14 &&
                        this.vy >= 0
                    ) {
                        this.vy = 0;
                        this.y = p.y - this.height;
                        this.isGrounded = true;
                    }
                });
            }

            if (this.isAI && opponent) {
                const dx = opponent.x - this.x;
                if (Math.abs(dx) > 60) {
                    this.vx = dx > 0 ? 3.5 : -3.5;
                } else {
                    this.vx = 0;
                    if (Math.random() < 0.04) this.useSkill1({ x: dx > 0 ? 1 : -1, y: 0 }, opponent, worldWidth, worldHeight);
                }
                if (opponent.y < this.y - 40 && this.isGrounded && Math.random() < 0.03) {
                    this.vy = -14;
                }
            }
        }

        useSkill1(aimVector, opponent, worldWidth, worldHeight) {
            if (this.cd1 > 0) return;
            let dirX = aimVector.x || (this.vx >= 0 ? 1 : -1);
            let dirY = aimVector.y || 0;
            this.x = Math.max(0, Math.min(worldWidth - this.width, this.x + dirX * 180));
            this.y = Math.max(0, Math.min(worldHeight - this.height, this.y + dirY * 180));
            this.cd1 = 3.0;
        }

        useSkill2(aimVector, opponent) {
            if (this.cd2 > 0 || !opponent) return;
            if (Math.hypot(opponent.x - this.x, opponent.y - this.y) < 320) {
                opponent.health = Math.max(0, opponent.health - 18);
                opponent.vx = (opponent.x - this.x) > 0 ? 8 : -8;
                opponent.vy = -6;
            }
            this.cd2 = 5.0;
        }

        useSkill3(aimVector, opponent) {
            if (this.cd3 > 0 || !opponent) return;
            this.cd3 = 10.0;
            for (let i = 0; i < 5; i++) {
                setTimeout(() => {
                    if (opponent) {
                        this.x = opponent.x + (Math.random() * 100 - 50);
                        this.y = opponent.y - 30;
                        opponent.health = Math.max(0, opponent.health - 6);
                    }
                }, i * 250);
            }
        }
    };
}

// ==========================================
// MAP DATA FALLBACK (If map files are missing)
// ==========================================
if (typeof getMapData === 'undefined') {
    window.getMapData = function(mapIndex, windowWidth, windowHeight) {
        const worldWidth = Math.max(900, windowWidth);
        const worldHeight = Math.max(500, windowHeight);
        const groundY = worldHeight - 50;
        return {
            isMassive: false,
            worldWidth: worldWidth,
            worldHeight: worldHeight,
            bg: '#38bdf8',
            platforms: [
                { x: 0, y: groundY, w: worldWidth, h: 50, type: 'ground', color: '#fde047', border: '#eab308' },
                { x: worldWidth * 0.15, y: groundY - 120, w: worldWidth * 0.25, h: 16, type: 'plat', color: '#854d0e', border: '#facc15' },
                { x: worldWidth * 0.6, y: groundY - 120, w: worldWidth * 0.25, h: 16, type: 'plat', color: '#854d0e', border: '#facc15' },
                { x: worldWidth * 0.35, y: groundY - 240, w: worldWidth * 0.3, h: 16, type: 'plat', color: '#854d0e', border: '#facc15' }
            ],
            obstacles: [{ x: worldWidth * 0.48, y: groundY - 90, w: 40, h: 90, color: '#0284c7', border: '#38bdf8' }],
            bushes: [{ x: worldWidth * 0.2, y: groundY - 165, w: 80, h: 45, color: 'rgba(34, 197, 94, 0.8)', border: '#4ade80' }]
        };
    };
}

// ==========================================
// GAME ENGINE CONTROLLER
// ==========================================
const canvas = document.getElementById('gameCanvas');
const ctx = canvas ? canvas.getContext('2d') : null;

let camera = { x: 0, y: 0 };
let activeMapData = null;
let isRunning = false;
let player1 = null;
let villain = null;

let moveVec = { x: 0, y: 0 };
let aimVec = { x: 0, y: 0 };
const keys = {};

function resizeCanvas() {
    if (!canvas) return;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
window.addEventListener('resize', resizeCanvas);
resizeCanvas();

function setupJoystick(baseId, thumbId, onMove, onEnd) {
    const base = document.getElementById(baseId);
    const thumb = document.getElementById(thumbId);
    if (!base || !thumb) return;
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

document.getElementById('btnJump')?.addEventListener('pointerdown', () => { if (player1 && player1.isGrounded) player1.vy = -15; });
document.getElementById('btnSkill1')?.addEventListener('pointerdown', () => { if (player1 && villain && activeMapData) player1.useSkill1(aimVec, villain, activeMapData.worldWidth, activeMapData.worldHeight); });
document.getElementById('btnSkill2')?.addEventListener('pointerdown', () => { if (player1 && villain) player1.useSkill2(aimVec, villain); });
document.getElementById('btnSkill3')?.addEventListener('pointerdown', () => { if (player1 && villain) player1.useSkill3(aimVec, villain); });

window.addEventListener('keydown', (e) => {
    keys[e.code] = true;
    if (e.code === 'KeyW' || e.code === 'ArrowUp') if (player1?.isGrounded) player1.vy = -15;
});
window.addEventListener('keyup', (e) => { keys[e.code] = false; });

document.getElementById('startBattleBtn')?.addEventListener('click', () => {
    document.getElementById('mapSelectScreen')?.classList.add('hidden');
    
    const w = canvas ? canvas.width : window.innerWidth;
    const h = canvas ? canvas.height : window.innerHeight;
    
    activeMapData = typeof getMapData === 'function' ? getMapData(selectedMap, w, h) : {
        isMassive: false, worldWidth: w, worldHeight: h, bg: '#38bdf8',
        platforms: [{ x: 0, y: h - 50, w: w, h: 50, type: 'ground', color: '#fde047', border: '#eab308' }],
        obstacles: [], bushes: []
    };

    const chosenHero = (typeof HEROES_DATABASE !== 'undefined' ? HEROES_DATABASE.find(h => h.id === selectedHero) : null) || { name: 'Portal Ball', color: '#ab00ff' };

    player1 = new Fighter({ x: 100, y: 100, name: chosenHero.name, color: chosenHero.color, heroId: selectedHero, isAI: false });
    villain = new Fighter({ x: activeMapData.worldWidth - 140, y: 100, name: 'Infernal Villain', color: '#ff2200', heroId: 'Hero2', isAI: true });

    const p1NameEl = document.getElementById('hudP1Name');
    const p2NameEl = document.getElementById('hudP2Name');
    if (p1NameEl) p1NameEl.innerText = player1.name;
    if (p2NameEl) p2NameEl.innerText = villain.name;

    isRunning = true;
});

document.getElementById('restartBtn')?.addEventListener('click', () => {
    document.getElementById('gameOverModal')?.classList.add('hidden');
    document.getElementById('heroSelectScreen')?.classList.remove('hidden');
    if (typeof updateMemoryUI === 'function') updateMemoryUI();
});

function gameLoop() {
    requestAnimationFrame(gameLoop);
    if (!isRunning || !ctx || !activeMapData) return;

    let inputX = moveVec.x;
    if (keys['KeyA'] || keys['ArrowLeft']) inputX = -1;
    if (keys['KeyD'] || keys['ArrowRight']) inputX = 1;
    player1.vx = inputX * player1.speed;

    player1.update(activeMapData, villain, activeMapData.worldWidth, activeMapData.worldHeight);
    villain.update(activeMapData, player1, activeMapData.worldWidth, activeMapData.worldHeight);

    if (activeMapData.isMassive && canvas) {
        camera.x = player1.x + player1.width / 2 - canvas.width / 2;
        camera.y = player1.y + player1.height / 2 - canvas.height / 2;
        camera.x = Math.max(0, Math.min(activeMapData.worldWidth - canvas.width, camera.x));
        camera.y = Math.max(0, Math.min(activeMapData.worldHeight - canvas.height, camera.y));
    } else {
        camera.x = 0;
        camera.y = 0;
    }

    ctx.fillStyle = activeMapData.bg || '#08030c';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.save();
    ctx.translate(-camera.x, -camera.y);

    if (activeMapData.platforms) {
        activeMapData.platforms.forEach(p => {
            ctx.fillStyle = p.color;
            ctx.fillRect(p.x, p.y, p.w, p.h);
            ctx.strokeStyle = p.border;
            ctx.lineWidth = 2;
            ctx.strokeRect(p.x, p.y, p.w, 3);
        });
    }

    if (activeMapData.obstacles) {
        activeMapData.obstacles.forEach(o => {
            ctx.fillStyle = o.color;
            ctx.fillRect(o.x, o.y, o.w, o.h);
            ctx.strokeStyle = o.border;
            ctx.strokeRect(o.x, o.y, o.w, o.h);
        });
    }

    if (player1) player1.draw(ctx);
    if (villain) villain.draw(ctx);

    if (activeMapData.bushes) {
        activeMapData.bushes.forEach(b => {
            ctx.fillStyle = b.color;
            ctx.fillRect(b.x, b.y, b.w, b.h);
            ctx.strokeStyle = b.border;
            ctx.lineWidth = 1;
            ctx.strokeRect(b.x, b.y, b.w, b.h);
        });
    }

    ctx.restore();

    const p1HpBar = document.getElementById('hudP1HpBar');
    const p2HpBar = document.getElementById('hudP2HpBar');
    const p1HpText = document.getElementById('hudP1HpText');
    const p2HpText = document.getElementById('hudP2HpText');

    if (p1HpBar) p1HpBar.style.width = `${(player1.health / player1.maxHealth) * 100}%`;
    if (p2HpBar) p2HpBar.style.width = `${(villain.health / villain.maxHealth) * 100}%`;
    if (p1HpText) p1HpText.innerText = `${Math.ceil(player1.health)} / 100`;
    if (p2HpText) p2HpText.innerText = `${Math.ceil(villain.health)} / 100`;

    if (player1.health <= 0 || villain.health <= 0) {
        isRunning = false;
        const modal = document.getElementById('gameOverModal');
        const winText = document.getElementById('winnerText');
        const winSub = document.getElementById('winnerSubText');
        modal?.classList.remove('hidden');

        if (player1.health > 0) {
            if (winText) { winText.innerText = "VICTORY!"; winText.className = "text-3xl font-black text-amber-400 mb-2"; }
            if (winSub) winSub.innerText = "You defeated the Infernal Villain!";
            if (typeof Storage !== 'undefined') Storage.addWin();
        } else {
            if (winText) { winText.innerText = "DEFEAT!"; winText.className = "text-3xl font-black text-red-500 mb-2"; }
            if (winSub) winSub.innerText = "The Villain claimed your soul.";
            if (typeof Storage !== 'undefined') Storage.addLoss();
        }
    }
}

requestAnimationFrame(gameLoop);
