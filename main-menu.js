const Storage = {
    getWins: () => parseInt(localStorage.getItem('infernal_wins') || '0'),
    getMatches: () => parseInt(localStorage.getItem('infernal_matches') || '0'),
    addWin: () => {
        localStorage.setItem('infernal_wins', Storage.getWins() + 1);
        localStorage.setItem('infernal_matches', Storage.getMatches() + 1);
    },
    addLoss: () => {
        localStorage.setItem('infernal_matches', Storage.getMatches() + 1);
    }
};

let selectedHero = 'Hero1';
let selectedMap = 1;

document.addEventListener('DOMContentLoaded', () => {
    updateMemoryUI();
    renderHeroCards();
    renderMapCards();
    setupNavigationEvents();
});

function updateMemoryUI() {
    document.getElementById('memWins').innerText = Storage.getWins();
    document.getElementById('memMatches').innerText = Storage.getMatches();
}

function renderHeroCards() {
    const container = document.getElementById('heroContainer');
    if (!container) return;
    container.innerHTML = `
        <div class="hero-card p-4 rounded-xl border-2 border-purple-500 bg-purple-950/40 cursor-pointer flex flex-col items-center">
            <div class="w-16 h-16 rounded-full bg-gradient-to-tr from-purple-600 to-pink-400 shadow-lg flex items-center justify-center mb-2 border-2 border-white">
                <i class="fa-solid fa-atom text-2xl text-white"></i>
            </div>
            <h3 class="font-bold text-lg text-purple-300">Portal Ball</h3>
            <span class="text-xs text-slate-300 font-mono mt-1">Specialist / Teleporter</span>
            <p class="text-[11px] text-slate-400 text-center mt-2">Uses Aim Joystick for directional Blinks & Blitzes.</p>
        </div>
    `;
}

function renderMapCards() {
    const container = document.getElementById('mapContainer');
    if (!container) return;
    container.innerHTML = `
        <div class="map-card p-3 rounded-xl border-2 border-red-500 bg-red-950/30 cursor-pointer flex flex-col items-center">
            <div class="w-full h-24 rounded-lg bg-cyan-900/50 border border-cyan-400 flex items-center justify-center font-bold text-slate-200 text-center p-2 text-xs">
                MAP 1:<br>Sunny Summer Beach
            </div>
            <span class="text-[11px] text-slate-300 font-semibold mt-2">Summer Special</span>
            <span class="text-[10px] text-slate-400 text-center">Sunny golden beach arena.</span>
        </div>
    `;
}

function setupNavigationEvents() {
    const heroSelectScreen = document.getElementById('heroSelectScreen');
    const mapSelectScreen = document.getElementById('mapSelectScreen');

    document.getElementById('toSelectMapBtn').addEventListener('click', () => {
        heroSelectScreen.classList.add('hidden');
        mapSelectScreen.classList.remove('hidden');
    });

    document.getElementById('backToHeroBtn').addEventListener('click', () => {
        mapSelectScreen.classList.add('hidden');
        heroSelectScreen.classList.remove('hidden');
    });
}
