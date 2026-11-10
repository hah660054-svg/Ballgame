// ==========================================
// MAP 1: SUNNY SUMMER BEACH (Summer Special)
// ==========================================

const MAP_1_DATA = {
    id: 1,
    name: 'Sunny Summer Beach',
    tag: 'Summer Special',
    desc: 'Sunny golden beach with palm tree bushes and ocean waves.',
    borderColor: 'border-cyan-400',
    bgBox: 'bg-cyan-900/50'
};

function getMap1Data(windowWidth, windowHeight) {
    const worldWidth = Math.max(900, windowWidth);
    const worldHeight = Math.max(500, windowHeight);
    const groundY = worldHeight - 50;

    return {
        id: 1,
        name: 'Sunny Summer Beach',
        isMassive: false,
        worldWidth: worldWidth,
        worldHeight: worldHeight,
        bg: '#38bdf8', // Light Summer Sky Blue Background
        platforms: [
            { x: 0, y: groundY, w: worldWidth, h: 50, type: 'ground', color: '#fde047', border: '#eab308' }, // Golden Sand Ground
            { x: worldWidth * 0.15, y: groundY - 120, w: worldWidth * 0.25, h: 16, type: 'plat', color: '#854d0e', border: '#facc15' }, // Wooden Dock Left
            { x: worldWidth * 0.6, y: groundY - 120, w: worldWidth * 0.25, h: 16, type: 'plat', color: '#854d0e', border: '#facc15' }, // Wooden Dock Right
            { x: worldWidth * 0.35, y: groundY - 240, w: worldWidth * 0.3, h: 16, type: 'plat', color: '#854d0e', border: '#facc15' }  // Upper Deck Platform
        ],
        obstacles: [
            { x: worldWidth * 0.48, y: groundY - 90, w: 40, h: 90, color: '#0284c7', border: '#38bdf8' } // Beach Rock / Tiki Pillar
        ],
        bushes: [
            { x: worldWidth * 0.2, y: groundY - 165, w: 80, h: 45, color: 'rgba(34, 197, 94, 0.8)', border: '#4ade80' }, // Palm Leaves Hiding Spot 1
            { x: worldWidth * 0.7, y: groundY - 165, w: 80, h: 45, color: 'rgba(34, 197, 94, 0.8)', border: '#4ade80' }  // Palm Leaves Hiding Spot 2
        ]
    };
}
