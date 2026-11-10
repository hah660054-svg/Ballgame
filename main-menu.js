// STORAGE & LOCAL MEMORY SYSTEM
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

// INITIALIZE UI ELEMENTS
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
    container.innerHTML = '';

    HEROES_DATABASE.forEach((hero, index) => {
        const isSelected = hero.id === selectedHero;
        const card = document.createElement('div');
        card.className = `hero-card p-4 rounded-xl border-2 ${isSelected ? 'border-purple-500 bg-purple-950/40' : 'border-slate-800 bg-slate-900/60'} cursor-pointer hover:border-purple-400 transition flex flex-col items-center`;
        card.onclick = () => {
            selectedHero = hero.id;
            renderHeroCards();
        };

        card.innerHTML = `
            <div class="w-16 h-16 rounded-full bg-gradient-to-tr ${hero.gradient} shadow-lg flex items-center justify-center mb-2 border-2 border-white">
                <i class="fa-solid ${hero.icon} text-2xl text-white"></i>
            </div>
            <h3 class="font-bold text-lg text-purple-300">${hero.name}</h3>
            <span class="text-xs text-slate-300 font-mono mt-1">${hero.role}</span>
            <p class="text-[11px] text-slate-400 text-center mt-2">${hero.desc}</p>
        `;
        container.appendChild(card);
    });
}

function renderMapCards() {
    const container = document.getElementById('mapContainer');
    container.innerHTML = '';

    MAPS_DATABASE.forEach(map => {
        const isSelected = map.id === selectedMap;
        const card = document.createElement('div');
        card.className = `map-card p-3 rounded-xl border-2 ${isSelected ? 'border-red-500 bg-red-950/30' : 'border-slate-800 bg-slate-900/60'} cursor-pointer flex flex-col items-center`;
        card.onclick = () => {
            selectedMap = map.id;
            renderMapCards();
        };

        card.innerHTML = `
            <div class="w-full h-24 rounded-lg ${map.bgBox} border ${map.borderColor} flex items-center justify-center font-bold text-slate-200 text-center p-2 text-xs">
                MAP ${map.id}:<br>${map.name}
            </div>
            <span class="text-[11px] text-slate-300 font-semibold mt-2">${map.tag}</span>
            <span class="text-[10px] text-slate-400 text-center">${map.desc}</span>
        `;
        container.appendChild(card);
    });
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
