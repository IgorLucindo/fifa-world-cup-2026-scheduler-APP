// --- DATA & CONSTANTS ---
const CITIES = {
    'Vancouver': { lat: 49.2827, lon: -123.1207, name: 'Vancouver' },
    'Seattle': { lat: 47.6062, lon: -122.3321, name: 'Seattle' },
    'San Francisco': { lat: 37.4030, lon: -121.9698, name: 'San Francisco' },
    'Los Angeles': { lat: 33.9583, lon: -118.3398, name: 'Los Angeles' },
    'Guadalajara': { lat: 20.6597, lon: -103.3496, name: 'Guadalajara' },
    'Mexico City': { lat: 19.4326, lon: -99.1332, name: 'Mexico City' },
    'Monterrey': { lat: 25.6866, lon: -100.3161, name: 'Monterrey' },
    'Houston': { lat: 29.7604, lon: -95.3698, name: 'Houston' },
    'Dallas': { lat: 32.7357, lon: -97.1081, name: 'Dallas' },
    'Kansas City': { lat: 39.0997, lon: -94.5786, name: 'Kansas City' },
    'Atlanta': { lat: 33.7490, lon: -84.3880, name: 'Atlanta' },
    'Miami': { lat: 25.9580, lon: -80.2389, name: 'Miami' },
    'Toronto': { lat: 43.6532, lon: -79.3832, name: 'Toronto' },
    'Boston': { lat: 42.0909, lon: -71.2643, name: 'Boston' },
    'Philadelphia': { lat: 39.9526, lon: -75.1652, name: 'Philadelphia' },
    'New York/NJ': { lat: 40.8128, lon: -74.0742, name: 'New York/NJ' },
};

const DATES = [
    '2026-06-11', '2026-06-12', '2026-06-13', '2026-06-14', '2026-06-15', '2026-06-16',
    '2026-06-17', '2026-06-18', '2026-06-19', '2026-06-20', '2026-06-21', '2026-06-22',
    '2026-06-23', '2026-06-24', '2026-06-25', '2026-06-26', '2026-06-27'
];

const GROUPS = {
    'A': 'bg-red-500 text-white',
    'B': 'bg-blue-500 text-white',
    'C': 'bg-green-500 text-white',
    'D': 'bg-yellow-500 text-black',
    'E': 'bg-purple-500 text-white',
    'F': 'bg-pink-500 text-white',
    'G': 'bg-indigo-500 text-white',
    'H': 'bg-orange-500 text-white',
    'I': 'bg-teal-500 text-white',
    'J': 'bg-cyan-500 text-black',
    'K': 'bg-lime-600 text-white',
    'L': 'bg-rose-500 text-white',
};

// --- MOCK DATA ---
const OFFICIAL_DATA = [
    { id: 'm1', group: 'A', t1: 'A1', t2: 'A2', city: 'Mexico City', date: '2026-06-11' },
    { id: 'm2', group: 'A', t1: 'A3', t2: 'A4', city: 'Guadalajara', date: '2026-06-11' },
    { id: 'm3', group: 'B', t1: 'B1', t2: 'B2', city: 'Toronto', date: '2026-06-12' },
    { id: 'm4', group: 'D', t1: 'D1', t2: 'D2', city: 'Los Angeles', date: '2026-06-12' },
    { id: 'm5', group: 'C', t1: 'C1', t2: 'C2', city: 'Boston', date: '2026-06-13' },
    { id: 'm6', group: 'D', t1: 'D3', t2: 'D4', city: 'Vancouver', date: '2026-06-13' },
    { id: 'm7', group: 'C', t1: 'C3', t2: 'C4', city: 'New York/NJ', date: '2026-06-13' },
    { id: 'm8', group: 'B', t1: 'B3', t2: 'B4', city: 'San Francisco', date: '2026-06-13' },
    { id: 'm9', group: 'E', t1: 'E1', t2: 'E2', city: 'Philadelphia', date: '2026-06-14' },
    { id: 'm10', group: 'E', t1: 'E3', t2: 'E4', city: 'Houston', date: '2026-06-14' },
    { id: 'm11', group: 'F', t1: 'F1', t2: 'F2', city: 'Dallas', date: '2026-06-14' },
    { id: 'm12', group: 'F', t1: 'F3', t2: 'F4', city: 'Monterrey', date: '2026-06-14' },
    { id: 'm13', group: 'H', t1: 'H1', t2: 'H2', city: 'Miami', date: '2026-06-15' },
    { id: 'm14', group: 'H', t1: 'H3', t2: 'H4', city: 'Atlanta', date: '2026-06-15' },
    { id: 'm15', group: 'G', t1: 'G1', t2: 'G2', city: 'Los Angeles', date: '2026-06-15' },
    { id: 'm16', group: 'G', t1: 'G3', t2: 'G4', city: 'Seattle', date: '2026-06-15' },
    { id: 'm26', group: 'A', t1: 'A1', t2: 'A3', city: 'Guadalajara', date: '2026-06-18' }, 
    { id: 'm53', group: 'A', t1: 'A1', t2: 'A4', city: 'Mexico City', date: '2026-06-24' },
];

const OPTIMAL_DATA = [
    { id: 'm6', group: 'B', t1: 'B3', t2: 'B4', city: 'Vancouver', date: '2026-06-13' },
    { id: 'm27', group: 'B', t1: 'B1', t2: 'B3', city: 'Vancouver', date: '2026-06-18' },
    { id: 'm51', group: 'B', t1: 'B1', t2: 'B4', city: 'Vancouver', date: '2026-06-24' },
    { id: 'm8', group: 'C', t1: 'C3', t2: 'C4', city: 'Seattle', date: '2026-06-13' },
    { id: 'm20', group: 'J', t1: 'J3', t2: 'J4', city: 'Seattle', date: '2026-06-15' },
    { id: 'm32', group: 'C', t1: 'C1', t2: 'C3', city: 'Seattle', date: '2026-06-19' },
    { id: 'm52', group: 'B', t1: 'B2', t2: 'B3', city: 'Seattle', date: '2026-06-24' },
    { id: 'm19', group: 'J', t1: 'J1', t2: 'J2', city: 'San Francisco', date: '2026-06-15' },
    { id: 'm31', group: 'C', t1: 'C2', t2: 'C4', city: 'San Francisco', date: '2026-06-19' },
    { id: 'm44', group: 'J', t1: 'J2', t2: 'J4', city: 'San Francisco', date: '2026-06-23' },
    { id: 'm60', group: 'C', t1: 'C2', t2: 'C3', city: 'San Francisco', date: '2026-06-25' },
    { id: 'm69', group: 'J', t1: 'J1', t2: 'J4', city: 'San Francisco', date: '2026-06-27' },
    { id: 'm4', group: 'C', t1: 'C1', t2: 'C2', city: 'Los Angeles', date: '2026-06-12' },
    { id: 'm28', group: 'B', t1: 'B2', t2: 'B4', city: 'Los Angeles', date: '2026-06-18' },
    { id: 'm43', group: 'J', t1: 'J1', t2: 'J3', city: 'Los Angeles', date: '2026-06-23' },
    { id: 'm59', group: 'C', t1: 'C1', t2: 'C4', city: 'Los Angeles', date: '2026-06-25' },
    { id: 'm70', group: 'J', t1: 'J2', t2: 'J3', city: 'Los Angeles', date: '2026-06-27' },
    { id: 'm14', group: 'H', t1: 'H3', t2: 'H4', city: 'Guadalajara', date: '2026-06-15' },
    { id: 'm26', group: 'A', t1: 'A1', t2: 'A3', city: 'Guadalajara', date: '2026-06-18' },
    { id: 'm37', group: 'H', t1: 'H1', t2: 'H3', city: 'Guadalajara', date: '2026-06-20' },
    { id: 'm54', group: 'A', t1: 'A2', t2: 'A3', city: 'Guadalajara', date: '2026-06-24' },
    { id: 'm65', group: 'H', t1: 'H1', t2: 'H4', city: 'Guadalajara', date: '2026-06-26' },
    { id: 'm1', group: 'A', t1: 'A1', t2: 'A2', city: 'Mexico City', date: '2026-06-11' },
    { id: 'm13', group: 'H', t1: 'H1', t2: 'H2', city: 'Mexico City', date: '2026-06-15' },
    { id: 'm25', group: 'A', t1: 'A2', t2: 'A4', city: 'Mexico City', date: '2026-06-18' },
    { id: 'm38', group: 'H', t1: 'H2', t2: 'H4', city: 'Mexico City', date: '2026-06-20' },
    { id: 'm53', group: 'A', t1: 'A1', t2: 'A4', city: 'Mexico City', date: '2026-06-24' },
    { id: 'm2', group: 'A', t1: 'A3', t2: 'A4', city: 'Monterrey', date: '2026-06-11' },
    { id: 'm16', group: 'G', t1: 'G3', t2: 'G4', city: 'Monterrey', date: '2026-06-15' },
    { id: 'm39', group: 'G', t1: 'G1', t2: 'G3', city: 'Monterrey', date: '2026-06-20' },
    { id: 'm63', group: 'G', t1: 'G1', t2: 'G4', city: 'Monterrey', date: '2026-06-26' },
];


export class SchedulerApp {
    constructor() {
        this.scheduleData = JSON.parse(JSON.stringify(OPTIMAL_DATA));
        this.currentMode = 'optimal';
        this.baselineDist = this.calculateTotalDistance(OFFICIAL_DATA);
        
        // Drag state
        this.draggedMatch = null;

        this.init();
    }


    init() {
        this.renderGridStructure();
        this.renderLegend();
        this.updateUI();
        
        // Init Lucide icons
        lucide.createIcons();
    }


    // Haversine
    calculateDistance(city1, city2) {
        if (!CITIES[city1] || !CITIES[city2]) return 0;
        if (city1 === city2) return 0;

        const R = 6371; 
        const dLat = (CITIES[city2].lat - CITIES[city1].lat) * (Math.PI / 180);
        const dLon = (CITIES[city2].lon - CITIES[city1].lon) * (Math.PI / 180);
        const a = 
            Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(CITIES[city1].lat * (Math.PI / 180)) * Math.cos(CITIES[city2].lat * (Math.PI / 180)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return Math.round(R * c);
    }


    calculateTotalDistance(data) {
        const teamPaths = {};
        const sorted = [...data].sort((a, b) => new Date(a.date) - new Date(b.date));

        sorted.forEach(match => {
            [match.t1, match.t2].forEach(team => {
                if (!teamPaths[team]) teamPaths[team] = [];
                teamPaths[team].push(match.city);
            });
        });

        let totalDistance = 0;
        Object.values(teamPaths).forEach(cities => {
            for (let i = 0; i < cities.length - 1; i++) {
                totalDistance += this.calculateDistance(cities[i], cities[i+1]);
            }
        });
        return totalDistance;
    }


    setMode(mode) {
        this.currentMode = mode;
        if (mode === 'official') this.scheduleData = JSON.parse(JSON.stringify(OFFICIAL_DATA));
        if (mode === 'optimal') this.scheduleData = JSON.parse(JSON.stringify(OPTIMAL_DATA));
        this.updateUI();
    }


    updateUI() {
        // Update Buttons
        const btnOfficial = document.getElementById('btn-official');
        const btnOptimal = document.getElementById('btn-optimal');
        const btnCustom = document.getElementById('btn-custom');

        // Reset styles
        const inactiveClass = "text-slate-400 hover:text-white bg-transparent shadow-none";
        const activeOfficial = "bg-slate-600 text-white shadow-sm";
        const activeOptimal = "bg-emerald-600 text-white shadow-sm";

        btnOfficial.className = `px-3 py-1.5 rounded-md text-sm font-medium transition-all ${this.currentMode === 'official' ? activeOfficial : inactiveClass}`;
        btnOptimal.className = `px-3 py-1.5 rounded-md text-sm font-medium transition-all ${this.currentMode === 'optimal' ? activeOptimal : inactiveClass}`;
        
        if (this.currentMode === 'custom') {
            btnCustom.classList.remove('hidden');
            // Reset others
            btnOfficial.className = `px-3 py-1.5 rounded-md text-sm font-medium transition-all ${inactiveClass}`;
            btnOptimal.className = `px-3 py-1.5 rounded-md text-sm font-medium transition-all ${inactiveClass}`;
        } else {
            btnCustom.classList.add('hidden');
        }

        // Update Grid
        this.renderGridMatches();
        
        // Update Metrics
        const currentDist = this.calculateTotalDistance(this.scheduleData);
        document.getElementById('total-dist').innerText = currentDist.toLocaleString();
        
        const diff = currentDist - this.baselineDist;
        const effContainer = document.getElementById('efficiency-container');
        const effVal = document.getElementById('eff-val');
        
        if (diff < 0) {
            effContainer.className = "flex items-baseline gap-1 font-mono font-bold text-green-400";
            effVal.innerText = "-" + Math.abs(diff).toLocaleString();
        } else {
            effContainer.className = "flex items-baseline gap-1 font-mono font-bold text-red-400";
            effVal.innerText = "+" + Math.abs(diff).toLocaleString();
        }
    }


    renderGridStructure() {
        const header = document.getElementById('grid-header');
        const body = document.getElementById('grid-body');
        
        // Setup Columns
        const colString = `150px repeat(${DATES.length}, minmax(100px, 1fr))`;
        header.style.gridTemplateColumns = colString;
        
        // Render Dates Header
        let headerHtml = `<div class="p-3 border-r border-gray-200 font-bold text-gray-400 text-sm flex items-center justify-center bg-gray-50 z-20 sticky left-0 shadow-[4px_0_10px_-5px_rgba(0,0,0,0.1)]">VENUES</div>`;
        DATES.forEach(dateStr => {
            const d = new Date(dateStr);
            // Manually fix timezone offset issue simply by using split for demo
            const day = dateStr.split('-')[2];
            const dateObj = new Date(parseInt(dateStr.split('-')[0]), parseInt(dateStr.split('-')[1])-1, parseInt(day));
            const dayName = dateObj.toLocaleDateString('en-US', { weekday: 'short' });
            
            headerHtml += `
                <div class="p-2 border-r border-gray-200 text-center min-w-[100px]">
                    <div class="text-xs font-bold text-slate-500 uppercase">${dayName}</div>
                    <div class="text-lg font-bold text-slate-800">${day}</div>
                    <div class="text-[10px] text-slate-400">June</div>
                </div>
            `;
        });
        header.innerHTML = headerHtml;

        // Render City Rows Structure
        let bodyHtml = '';
        Object.keys(CITIES).forEach(city => {
            const stadiumNames = {
                'Boston': 'Gillette Stadium',
                'New York/NJ': 'MetLife Stadium',
                'Dallas': 'AT&T Stadium',
                'Mexico City': 'Estadio Azteca'
            };
            const subText = stadiumNames[city] || 'Stadium';

            bodyHtml += `
                <div class="grid border-b border-gray-100 hover:bg-slate-50 transition-colors" style="grid-template-columns: ${colString}">
                    <div class="p-3 border-r border-gray-200 bg-white font-semibold text-slate-700 text-xs flex flex-col justify-center sticky left-0 z-10 shadow-[4px_0_10px_-5px_rgba(0,0,0,0.1)]">
                        ${CITIES[city].name}
                        <span class="text-[9px] text-gray-400 font-normal mt-0.5">${subText}</span>
                    </div>
                    ${DATES.map(date => `<div id="cell-${city.replace(/ /g, '_')}-${date}" class="relative border-r border-gray-100 min-h-[80px] transition-all duration-200 drop-zone" data-city="${city}" data-date="${date}"></div>`).join('')}
                </div>
            `;
        });
        body.innerHTML = bodyHtml;
        
        // Attach Drop Listeners to Zones
        document.querySelectorAll('.drop-zone').forEach(zone => {
            zone.addEventListener('dragover', (e) => {
                e.preventDefault();
                zone.classList.add('drag-over');
            });
            zone.addEventListener('dragleave', (e) => {
                zone.classList.remove('drag-over');
            });
            zone.addEventListener('drop', (e) => this.handleDrop(e));
        });
    }


    renderGridMatches() {
        // Clear all cells
        document.querySelectorAll('.drop-zone').forEach(zone => zone.innerHTML = '');

        // Place matches
        this.scheduleData.forEach(match => {
            const cellId = `cell-${match.city.replace(/ /g, '_')}-${match.date}`;
            const cell = document.getElementById(cellId);
            if (cell) {
                const div = document.createElement('div');
                div.className = `absolute inset-1 rounded-md shadow-sm border border-white/20 cursor-move flex flex-col items-center justify-center gap-1 hover:scale-105 hover:shadow-md hover:z-20 transition-transform ${GROUPS[match.group] || 'bg-gray-500 text-white'}`;
                div.draggable = true;
                div.innerHTML = `
                    <div class="text-[9px] font-bold opacity-80 uppercase tracking-widest">Group ${match.group}</div>
                    <div class="font-bold text-xs whitespace-nowrap">${match.t1} <span class="opacity-60 text-[10px]">vs</span> ${match.t2}</div>
                    <div class="text-[9px] opacity-75">${match.id}</div>
                `;
                
                div.addEventListener('dragstart', (e) => {
                    this.draggedMatch = match;
                    div.classList.add('dragging');
                    e.dataTransfer.effectAllowed = "move";
                });
                
                div.addEventListener('dragend', () => {
                    this.draggedMatch = null;
                    div.classList.remove('dragging');
                });

                cell.appendChild(div);
            }
        });
    }


    handleDrop(e) {
        e.preventDefault();
        const zone = e.currentTarget;
        zone.classList.remove('drag-over');

        if (!this.draggedMatch) return;

        const newCity = zone.dataset.city;
        const newDate = zone.dataset.date;

        // Logic: Remove from old, add to new. Swap if occupied.
        const otherMatchIndex = this.scheduleData.findIndex(m => m.city === newCity && m.date === newDate && m.id !== this.draggedMatch.id);
        const selfIndex = this.scheduleData.findIndex(m => m.id === this.draggedMatch.id);
        
        if (otherMatchIndex !== -1) {
            // Swap
            this.scheduleData[otherMatchIndex].city = this.draggedMatch.city;
            this.scheduleData[otherMatchIndex].date = this.draggedMatch.date;
        }

        this.scheduleData[selfIndex].city = newCity;
        this.scheduleData[selfIndex].date = newDate;

        this.currentMode = 'custom';
        this.updateUI();
    }

    
    renderLegend() {
        const legend = document.getElementById('legend');
        let html = '<span class="font-bold text-gray-700">LEGEND:</span>';
        Object.keys(GROUPS).forEach(g => {
            const colorClass = GROUPS[g].split(' ')[0];
            html += `
                <div class="flex items-center gap-1">
                    <div class="w-3 h-3 rounded-sm ${colorClass}"></div>
                    <span>Grp ${g}</span>
                </div>
            `;
        });
        legend.innerHTML = html;
    }
}