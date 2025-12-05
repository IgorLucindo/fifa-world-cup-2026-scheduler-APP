import { CITIES, DATES, GROUPS, REGIONS } from '../data/data.js';

export class SchedulerApp {
    constructor() {
        this.officialData = [];
        this.optimalData = [];
        this.scheduleData = []; 
        
        this.currentMode = 'optimal';
        // CHANGED: Detect unit based on user locale
        this.currentUnit = this.getPreferredUnit(); 
        this.baselineDist = 0;
        this.draggedMatch = null;

        this.init();
    }

    // NEW: Helper to determine default unit
    getPreferredUnit() {
        // Default to KM, but check for US/UK locales which typically use Miles
        const lang = navigator.language || 'en-US';
        if (lang.startsWith('en-US') || lang.startsWith('en-GB')) {
            return 'mi';
        }
        return 'km';
    }

    async init() {
        this.renderGridStructure();
        this.renderLegend();
        
        const distEl = document.getElementById('total-dist');
        if (distEl) distEl.innerText = 'Loading...';

        try {
            const [official, optimal] = await Promise.all([
                this.loadSchedule(`./dataset/${encodeURIComponent('official_schedule.csv')}`),
                this.loadSchedule(`./dataset/${encodeURIComponent('MIP_schedule.csv')}`)
            ]);

            this.officialData = official;
            this.optimalData = optimal;

            console.log("Loaded Official Data:", this.officialData.length, "matches");
            console.log("Loaded Optimal Data:", this.optimalData.length, "matches");

            // Baseline: Use Optimal (MIP)
            this.baselineDist = this.calculateTotalDistance(this.optimalData);

            // Default Mode: Start with Official
            this.setMode('official');

        } catch (error) {
            console.error("Error loading schedules:", error);
            if (distEl) distEl.innerText = 'Error';
            alert("Error loading CSV files. Please check the console.");
        }
        
        if (typeof lucide !== 'undefined') {
            lucide.createIcons();
        }
    }

    async loadSchedule(url) {
        const response = await fetch(url);
        if (!response.ok) throw new Error(`Failed to fetch ${url}`);
        const text = await response.text();
        return this.parseCSV(text);
    }

    parseCSV(csvText) {
        const lines = csvText.trim().split('\n');
        const headers = lines[0].split(',').map(h => h.trim()); 
        const matches = [];

        for (let i = 1; i < lines.length; i++) {
            if (!lines[i].trim()) continue;
            const row = lines[i].split(',');
            const cityKey = row[0].trim();
            if (!CITIES[cityKey]) continue; 

            for (let j = 1; j < row.length; j++) {
                const cellContent = row[j] ? row[j].trim() : '';
                const date = headers[j];
                if (cellContent && date) {
                    const matchRegex = /m(\d+)\s*\(([A-Z])\d*\):\s*(.*)\s*vs\s*(.*)/i;
                    const parsed = cellContent.match(matchRegex);
                    if (parsed) {
                        matches.push({
                            id: `m${parsed[1]}`,
                            group: parsed[2],
                            t1: parsed[3].trim(),
                            t2: parsed[4].trim(),
                            city: cityKey,
                            date: date
                        });
                    }
                }
            }
        }
        return matches;
    }

    // Calculates raw distance in KM
    calculateDistance(city1, city2) {
        if (!CITIES[city1] || !CITIES[city2]) return 0;
        if (city1 === city2) return 0;
        const R = 6371; 
        const dLat = (CITIES[city2].lat - CITIES[city1].lat) * (Math.PI / 180);
        const dLon = (CITIES[city2].lon - CITIES[city1].lon) * (Math.PI / 180);
        const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
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
        if (mode === 'official') this.scheduleData = JSON.parse(JSON.stringify(this.officialData));
        if (mode === 'optimal') this.scheduleData = JSON.parse(JSON.stringify(this.optimalData));
        this.updateUI();
    }

    toggleUnit() {
        this.currentUnit = this.currentUnit === 'km' ? 'mi' : 'km';
        this.updateUI();
    }

    updateUI() {
        const btnOfficial = document.getElementById('btn-official');
        const btnOptimal = document.getElementById('btn-optimal');
        const btnCustom = document.getElementById('btn-custom');
        
        // Update Unit Button Text
        const btnUnit = document.getElementById('btn-unit');
        if (btnUnit) btnUnit.innerText = `UNIT: ${this.currentUnit.toUpperCase()}`;

        const inactiveClass = "text-slate-400 hover:text-white bg-transparent shadow-none";
        const activeOfficial = "bg-slate-600 text-white shadow-sm";
        const activeOptimal = "bg-emerald-600 text-white shadow-sm";

        if (btnOfficial) btnOfficial.className = `px-3 py-1.5 rounded-md text-sm font-medium transition-all ${this.currentMode === 'official' ? activeOfficial : inactiveClass}`;
        if (btnOptimal) btnOptimal.className = `px-3 py-1.5 rounded-md text-sm font-medium transition-all ${this.currentMode === 'optimal' ? activeOptimal : inactiveClass}`;
        
        if (this.currentMode === 'custom') {
            if (btnCustom) btnCustom.classList.remove('hidden');
            if (btnOfficial) btnOfficial.className = `px-3 py-1.5 rounded-md text-sm font-medium transition-all ${inactiveClass}`;
            if (btnOptimal) btnOptimal.className = `px-3 py-1.5 rounded-md text-sm font-medium transition-all ${inactiveClass}`;
        } else {
            if (btnCustom) btnCustom.classList.add('hidden');
        }

        this.renderGridMatches();
        
        // --- METRICS UPDATE ---
        
        // 1. Determine Conversion Factor
        const factor = this.currentUnit === 'mi' ? 0.621371 : 1;
        
        // 2. Calculate Raw Distances (KM)
        const currentDistKm = this.calculateTotalDistance(this.scheduleData);
        
        // 3. Convert
        const currentDistDisplay = Math.round(currentDistKm * factor);
        const baselineDistDisplay = Math.round(this.baselineDist * factor);
        
        // 4. Update DOM
        const distEl = document.getElementById('total-dist');
        if (distEl) distEl.innerText = currentDistDisplay.toLocaleString();
        
        const unitEl = document.getElementById('dist-unit');
        if (unitEl) unitEl.innerText = this.currentUnit;
        
        const diff = currentDistDisplay - baselineDistDisplay;
        const effContainer = document.getElementById('efficiency-container');
        const effVal = document.getElementById('eff-val');
        
        if (effContainer && effVal) {
            if (this.currentMode === 'optimal') {
                 effContainer.className = "flex items-baseline gap-1 font-mono font-bold text-slate-400";
                 effVal.innerText = "Baseline";
            } else {
                if (diff < 0) {
                    effContainer.className = "flex items-baseline gap-1 font-mono font-bold text-green-400";
                    effVal.innerText = "-" + Math.abs(diff).toLocaleString();
                } else {
                    effContainer.className = "flex items-baseline gap-1 font-mono font-bold text-red-400";
                    effVal.innerText = "+" + Math.abs(diff).toLocaleString();
                }
            }
        }
    }

    renderGridStructure() {
        const header = document.getElementById('grid-header');
        const body = document.getElementById('grid-body');
        
        if (!header || !body) return;

        // GRID DEFINITION
        const colString = `40px 130px repeat(${DATES.length}, minmax(60px, 1fr))`;
        
        // --- HEADER ---
        header.style.gridTemplateColumns = colString;
        
        let headerHtml = `
            <div class="sticky left-0 z-30 bg-gray-50 p-2 border-r border-gray-200 flex items-center justify-center shadow-[2px_0_5px_-2px_rgba(0,0,0,0.1)]">
                <span class="text-[10px] font-bold text-slate-500 -rotate-90">REGION</span>
            </div>
            <div class="sticky left-[40px] z-30 bg-gray-50 p-2 border-r border-gray-200 flex items-center justify-center shadow-[4px_0_10px_-5px_rgba(0,0,0,0.1)]">
                <span class="text-xs font-bold text-gray-400">VENUE</span>
            </div>
        `;

        DATES.forEach(dateStr => {
            const day = dateStr.split('-')[2];
            const dateObj = new Date(parseInt(dateStr.split('-')[0]), parseInt(dateStr.split('-')[1])-1, parseInt(day));
            const dayName = dateObj.toLocaleDateString('en-US', { weekday: 'short' });
            
            headerHtml += `
                <div class="p-2 border-r border-gray-200 text-center overflow-hidden">
                    <div class="text-xs font-bold text-slate-500 uppercase">${dayName}</div>
                    <div class="text-lg font-bold text-slate-800">${day}</div>
                </div>
            `;
        });
        header.innerHTML = headerHtml;

        // --- BODY ---
        body.className = "grid relative";
        body.style.gridTemplateColumns = colString;

        const regionCounts = {};
        Object.values(CITIES).forEach(c => {
            regionCounts[c.region] = (regionCounts[c.region] || 0) + 1;
        });

        const processedRegions = new Set();
        let bodyHtml = '';

        Object.keys(CITIES).forEach(cityKey => {
            const cityData = CITIES[cityKey];
            const regionData = REGIONS[cityData.region];
            const stadiumNames = {
                'Foxborough': 'Gillette Stadium',
                'East_Rutherford': 'MetLife Stadium',
                'Arlington': 'AT&T Stadium',
                'Mexico_City': 'Estadio Azteca'
            };
            const subText = stadiumNames[cityKey] || 'Stadium';

            // 1. Region Cell (Merged)
            if (!processedRegions.has(cityData.region)) {
                const span = regionCounts[cityData.region];
                bodyHtml += `
                    <div class="sticky left-0 z-20 border-r border-white/20 border-b border-gray-100 flex items-center justify-center shadow-[2px_0_5px_-2px_rgba(0,0,0,0.1)]" 
                         style="grid-row: span ${span}; background-color: ${regionData.color}">
                        <span class="text-xs font-bold text-slate-800 uppercase tracking-widest whitespace-nowrap -rotate-90 transform">
                            ${regionData.label.split(' ')[0]}
                        </span>
                    </div>
                `;
                processedRegions.add(cityData.region);
            }

            // 2. City Cell
            bodyHtml += `
                <div class="sticky left-[40px] z-20 p-2 border-r border-white/20 border-b border-gray-100 flex flex-col justify-center shadow-[4px_0_10px_-5px_rgba(0,0,0,0.1)]"
                     style="background-color: ${regionData.color}">
                    <div class="font-bold text-slate-900 text-sm leading-tight truncate" title="${cityData.name}">
                        ${cityData.name}
                    </div>
                    <span class="text-[9px] text-slate-800/60 font-medium mt-0.5 truncate">${subText}</span>
                </div>
            `;

            // 3. Date Cells
            DATES.forEach(date => {
                bodyHtml += `
                    <div id="cell-${cityKey.replace(/ /g, '_')}-${date}" 
                         class="relative border-r border-gray-100 border-b border-gray-100 min-h-[80px] bg-white transition-all duration-200 drop-zone" 
                         data-city="${cityKey}" 
                         data-date="${date}">
                    </div>
                `;
            });
        });

        body.innerHTML = bodyHtml;
        
        // Attach Drop Listeners
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
        document.querySelectorAll('.drop-zone').forEach(zone => zone.innerHTML = '');

        this.scheduleData.forEach(match => {
            const cellId = `cell-${match.city.replace(/ /g, '_')}-${match.date}`;
            const cell = document.getElementById(cellId);
            if (cell) {
                const div = document.createElement('div');
                div.className = `absolute inset-0.5 rounded-sm shadow-sm border border-black/10 cursor-move flex flex-col items-center justify-center p-0.5 hover:scale-105 hover:shadow-md hover:z-50 transition-transform ${GROUPS[match.group] || 'bg-gray-500 text-white'}`;
                div.draggable = true;
                div.innerHTML = `
                    <div class="text-[8px] font-bold opacity-80 uppercase leading-none mb-0.5">Grp ${match.group}</div>
                    <div class="font-bold text-[10px] leading-tight text-center w-full truncate">${match.t1}</div>
                    <div class="text-[8px] opacity-60 leading-none">vs</div>
                    <div class="font-bold text-[10px] leading-tight text-center w-full truncate">${match.t2}</div>
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

        const otherMatchIndex = this.scheduleData.findIndex(m => m.city === newCity && m.date === newDate && m.id !== this.draggedMatch.id);
        const selfIndex = this.scheduleData.findIndex(m => m.id === this.draggedMatch.id);
        
        if (otherMatchIndex !== -1) {
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
        if (!legend) return;

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