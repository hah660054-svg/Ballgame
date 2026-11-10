// ==========================================
// HERO 1: PORTAL BALL (Specialist / Teleporter)
// ==========================================

class PortalBallFighter extends Fighter {
    constructor({ x, y, name = 'Portal Ball', color = '#ab00ff', isAI = false }) {
        super({ x, y, name, color, heroId: 'Hero1', isAI });
        this.speed = 6.5; // Portal Ball has high mobility
    }

    // SKILL 1: DIRECTIONAL BLINK (Uses Aim Joystick)
    useSkill1(aimVector, opponent, worldWidth, worldHeight) {
        if (this.cd1 > 0) return;
        let dirX = aimVector.x;
        let dirY = aimVector.y;

        if (Math.hypot(dirX, dirY) < 0.2) {
            dirX = this.vx >= 0 ? 1 : -1;
            dirY = 0;
        }

        const dist = 180;
        let targetX = this.x + dirX * dist;
        let targetY = this.y + dirY * dist;

        // Boundary safety check
        targetX = Math.max(0, Math.min(worldWidth - this.width, targetX));
        targetY = Math.max(0, Math.min(worldHeight - this.height, targetY));

        this.x = targetX;
        this.y = targetY;
        this.cd1 = 3.0; // 3 seconds cooldown
    }

    // SKILL 2: AURA CHAIN STRIKE
    useSkill2(aimVector, opponent) {
        if (this.cd2 > 0 || !opponent) return;
        const dist = Math.hypot(opponent.x - this.x, opponent.y - this.y);
        if (dist < 320) {
            opponent.health -= 18;
            if (opponent.health < 0) opponent.health = 0;
            opponent.vx = (opponent.x - this.x) > 0 ? 8 : -8;
            opponent.vy = -6;
        }
        this.cd2 = 5.0; // 5 seconds cooldown
    }

    // SKILL 3: ULTIMATE MULTI-PORTAL BLITZ
    useSkill3(aimVector, opponent) {
        if (this.cd3 > 0 || !opponent) return;
        this.cd3 = 10.0; // 10 seconds cooldown

        for (let i = 0; i < 5; i++) {
            setTimeout(() => {
                if (opponent) {
                    this.x = opponent.x + (Math.random() * 100 - 50);
                    this.y = opponent.y - 30;
                    opponent.health -= 6;
                    if (opponent.health < 0) opponent.health = 0;
                }
            }, i * 250);
        }
    }
}
