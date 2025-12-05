import { CITIES, DATES, GROUPS } from '../data/data.js';

export class SchedulerApp {
    constructor() {
        this.officialData = [];
        this.optimalData = [];
        this.scheduleData = []; // Current active data
        
        this.currentMode = 'optimal';
        this.baselineDist = 0;
        this.draggedMatch = null;

        this.init();
    }

    async init() {
        this.renderGridStructure();
        this.renderLegend();
        
        // Show loading state
        const distEl = document.getElementById('total-dist');
        if (distEl) distEl.innerText = 'Loading...';

        try {
            // Load CSVs using the specific filenames provided
            // Note: encodeURIComponent handles spaces in filenames for URL safety
            const [official, optimal] = await Promise.all([
                this.loadSchedule(`./dataset/${encodeURIComponent('official_schedule.csv')}`),
                this.loadSchedule(`./dataset/${encodeURIComponent('MIP_schedule.csv')}`)
            ]);

            this.officialData = official;
            this.optimalData = optimal;

            console.log("Loaded Official Data:", this.officialData.length, "matches");
            console.log("Loaded Optimal Data:", this.optimalData.length, "matches");

            // Set Baseline
            this.baselineDist = this.calculateTotalDistance(this.officialData);

            // Default to Optimal
            this.setMode('optimal');

        } catch (error) {
            console.error("Error loading schedules:", error);
            if (distEl) distEl.innerText = 'Error';
            alert("Error loading CSV files. Please check the console and ensure files exist in the 'website/dataset/' folder.");
        }
        
        if (typeof lucide !== 'undefined') {
            lucide.createIcons();
        }
    }

    async loadSchedule(url) {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Failed to fetch ${url}: ${response.statusText}`);
        }
        const text = await response.text();
        return this.parseCSV(text);
    }

    parseCSV(csvText) {
        const lines = csvText.trim().split('\n');
        // Handle potential empty first cell in header row (common in some export formats)
        const headers = lines[0].split(',').map(h => h.trim()); 
        const matches = [];

        // Loop rows (Cities) - Start at index 1 to skip header
        for (let i = 1; i < lines.length; i++) {
            // Skip empty lines
            if (!lines[i].trim()) continue;

            const row = lines[i].split(',');
            const cityKey = row[0].trim();

            if (!CITIES[cityKey]) {
                // Optional: Log if a city key isn't found to help debugging
                // console.warn(`City key '${cityKey}' not found in CITIES map.`);
                continue; 
            }

            // Loop columns (Dates) - Start at index 1 to skip city column
            for (let j = 1; j < row.length; j++) {
                const cellContent = row[j] ? row[j].trim() : '';
                // headers[j] contains the date string (e.g., "2026-06-11")
                const date = headers[j];

                if (cellContent && date) {
                    // Regex to parse cell content like: "m1 (A1): Mex vs TBD"
                    // Captures: 
                    // 1: ID (e.g., "1")
                    // 2: Group (e.g., "A")
                    // 3: Team 1
                    // 4: Team 2
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
            // Normalize team names to handle "TBD" or inconsistencies
            [match.t1, match.t2].forEach(team => {
                // If you want to track TBD travel, remove this check. 
                // Usually for optimization comparisons, we only track known teams or placeholders if they are consistent.
                // For this demo, we'll track everything to show numbers.
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

    updateUI() {
        // Update Buttons
        const btnOfficial = document.getElementById('btn-official');
        const btnOptimal = document.getElementById('btn-optimal');
        const btnCustom = document.getElementById('btn-custom');

        // Reset styles
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

        // Update Grid
        this.renderGridMatches();
        
        // Update Metrics
        const currentDist = this.calculateTotalDistance(this.scheduleData);
        const distEl = document.getElementById('total-dist');
        if (distEl) distEl.innerText = currentDist.toLocaleString();
        
        // Compare against baseline (Official)
        const diff = currentDist - this.baselineDist;
        const effContainer = document.getElementById('efficiency-container');
        const effVal = document.getElementById('eff-val');
        
        if (effContainer && effVal) {
            // If we are viewing official, diff is 0
            if (this.currentMode === 'official') {
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

        // Setup Columns
        const colString = `150px repeat(${DATES.length}, minmax(100px, 1fr))`;
        header.style.gridTemplateColumns = colString;
        
        // Render Dates Header
        let headerHtml = `<div class="p-3 border-r border-gray-200 font-bold text-gray-400 text-sm flex items-center justify-center bg-gray-50 z-20 sticky left-0 shadow-[4px_0_10px_-5px_rgba(0,0,0,0.1)]">VENUES</div>`;
        DATES.forEach(dateStr => {
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
                'Foxborough': 'Gillette Stadium',
                'East_Rutherford': 'MetLife Stadium',
                'Arlington': 'AT&T Stadium',
                'Mexico_City': 'Estadio Azteca'
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