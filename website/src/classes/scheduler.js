import { CITIES, DATES, GROUPS, REGIONS } from '../data/data.js';

export class SchedulerApp {
    constructor() {
        this.officialData = [];
        this.optimalData = [];
        this.scheduleData = []; 
        this.customData = null;
        
        this.currentMode = 'optimal';
        this.currentUnit = this.getPreferredUnit(); 
        this.baselineDist = 0;
        this.baselineRegions = 0;
        this.draggedMatch = null;
        
        this.errorTimeout = null; 

        this.init();
    }

    getPreferredUnit() {
        const lang = navigator.language || 'en-US';
        if (lang.startsWith('en-US') || lang.startsWith('en-GB')) {
            return 'mi';
        }
        return 'km';
    }

    async init() {
        this.renderGridStructure();
        this.renderLegend();
        this.injectToastContainer(); 
        
        const distEl = document.getElementById('total-dist');
        if (distEl) distEl.innerText = 'Loading...';

        try {
            const [official, optimal] = await Promise.all([
                this.loadSchedule(`./dataset/${encodeURIComponent('official_schedule.csv')}`),
                this.loadSchedule(`./dataset/${encodeURIComponent('mip_schedule.csv')}`)
            ]);

            this.officialData = official;
            this.optimalData = optimal;

            // Baseline: Use Optimal (MIP)
            this.baselineDist = this.calculateTotalDistance(this.optimalData);
            this.baselineRegions = this.calculateRegionCrossings(this.optimalData);

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

    injectToastContainer() {
        if (!document.getElementById('toast-error')) {
            const toast = document.createElement('div');
            toast.id = 'toast-error';
            toast.className = 'toast-error';
            toast.innerHTML = '<span>Constraint Violation</span>';
            document.body.appendChild(toast);
        }
    }

    showError(message) {
        const toast = document.getElementById('toast-error');
        if (toast) {
            if (this.errorTimeout) clearTimeout(this.errorTimeout);
            toast.innerHTML = `
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" x2="12" y1="8" y2="12"/><line x1="12" x2="12.01" y1="16" y2="16"/></svg>
                <span>${message}</span>
            `;
            toast.classList.add('show');
            this.errorTimeout = setTimeout(() => {
                toast.classList.remove('show');
                this.errorTimeout = null;
            }, 4000);
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

    calculateDistance(city1, city2) {
        if (!CITIES[city1] || !CITIES[city2]) return 0;
        if (city1 === city2) return 0;

        const R = 3958.8; 
        const dLat = (CITIES[city2].lat - CITIES[city1].lat) * (Math.PI / 180);
        const dLon = (CITIES[city2].lon - CITIES[city1].lon) * (Math.PI / 180);
        const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(CITIES[city1].lat * (Math.PI / 180)) * Math.cos(CITIES[city2].lat * (Math.PI / 180)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

        return R * c;
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

    calculateRegionCrossings(data) {
        const teamPaths = {};
        const sorted = [...data].sort((a, b) => new Date(a.date) - new Date(b.date));
        
        sorted.forEach(match => {
            [match.t1, match.t2].forEach(team => {
                if (!teamPaths[team]) teamPaths[team] = [];
                teamPaths[team].push(match.city);
            });
        });

        let totalCrossings = 0;
        Object.values(teamPaths).forEach(cities => {
            for (let i = 0; i < cities.length - 1; i++) {
                if (CITIES[cities[i]] && CITIES[cities[i+1]]) {
                    const region1 = CITIES[cities[i]].region;
                    const region2 = CITIES[cities[i+1]].region;
                    if (region1 !== region2) totalCrossings++;
                }
            }
        });
        return totalCrossings;
    }

    setMode(mode) {
        this.currentMode = mode;
        if (mode === 'official') this.scheduleData = JSON.parse(JSON.stringify(this.officialData));
        if (mode === 'optimal') this.scheduleData = JSON.parse(JSON.stringify(this.optimalData));
        if (mode === 'custom' && this.customData) this.scheduleData = JSON.parse(JSON.stringify(this.customData));
        
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
        const btnUnit = document.getElementById('btn-unit');

        if (btnUnit) btnUnit.innerText = `UNIT: ${this.currentUnit.toUpperCase()}`;

        const inactiveClass = "text-slate-400 hover:text-white bg-transparent shadow-none cursor-pointer";
        const activeOfficial = "bg-slate-600 text-white shadow-sm";
        const activeOptimal = "bg-emerald-600 text-white shadow-sm";
        const activeCustom = "bg-amber-600 text-white shadow-sm";

        if (btnOfficial) btnOfficial.className = `px-3 py-1.5 rounded-md text-sm font-medium transition-all ${this.currentMode === 'official' ? activeOfficial : inactiveClass}`;
        if (btnOptimal) btnOptimal.className = `px-3 py-1.5 rounded-md text-sm font-medium transition-all ${this.currentMode === 'optimal' ? activeOptimal : inactiveClass}`;
        
        if (btnCustom) {
            if (this.currentMode === 'custom' || this.customData) {
                btnCustom.classList.remove('hidden');
                btnCustom.className = `px-3 py-1.5 rounded-md text-sm font-medium transition-all ${this.currentMode === 'custom' ? activeCustom : inactiveClass}`;
                btnCustom.classList.remove('animate-pulse');
            } else {
                btnCustom.classList.add('hidden');
            }
        }

        this.renderGridMatches();
        
        const factor = this.currentUnit === 'km' ? 1.609344 : 1;
        const currentDistBase = this.calculateTotalDistance(this.scheduleData);
        const currentDistDisplay = Math.round(currentDistBase * factor);
        const baselineDistDisplay = Math.round(this.baselineDist * factor);
        
        const currentRegions = this.calculateRegionCrossings(this.scheduleData);
        const diffRegions = currentRegions - this.baselineRegions;
        const diffDist = currentDistDisplay - baselineDistDisplay;

        const distEl = document.getElementById('total-dist');
        const unitEl = document.getElementById('dist-unit');
        const zonesEl = document.getElementById('total-zones');

        if (distEl) {
            // Update values only if elements exist to prevent clearing user selection
            distEl.innerText = currentDistDisplay.toLocaleString();
            if (unitEl) unitEl.innerText = this.currentUnit;
            if (zonesEl) zonesEl.innerText = currentRegions;

            // Layout Structure Update
            // We target parentElement (the value container), NOT closest 'flex-col' (the wrapper with Title)
            const valueRow = distEl.parentElement;
            
            if (valueRow) {
                // Ensure Side-by-Side layout
                valueRow.className = "flex items-baseline gap-4"; 
                
                // Only inject HTML if the Zones element is missing (first run after refresh)
                if (!zonesEl) {
                    valueRow.innerHTML = `
                        <div class="flex items-baseline gap-1">
                            <span id="total-dist" class="text-lg sm:text-1xl font-mono font-bold text-white">${currentDistDisplay.toLocaleString()}</span>
                            <span id="dist-unit" class="text-xs text-slate-400">${this.currentUnit}</span>
                        </div>
                        <div class="flex items-baseline gap-1">
                            <span id="total-zones" class="text-lg sm:text-1xl font-mono font-bold text-white">${currentRegions}</span>
                            <span class="text-[10px] text-slate-400 uppercase">Zones</span>
                        </div>
                    `;
                }
            }
        }
        
        const effContainer = document.getElementById('efficiency-container');
        if (effContainer) {
            const getStatHtml = (val, label) => {
                if (this.currentMode === 'optimal') return `<span class="text-slate-400">Baseline</span>`;
                
                const color = val <= 0 ? 'text-green-400' : 'text-red-400';
                const sign = val > 0 ? '+' : '';
                return `<span class="${color}">${sign}${val.toLocaleString()} ${label}</span>`;
            };

            const distHtml = getStatHtml(diffDist, '');
            const regHtml = getStatHtml(diffRegions, '');

            effContainer.className = "flex flex-col items-end font-mono font-bold text-[10px] sm:text-xs leading-tight";
            effContainer.innerHTML = `
                <div class="flex items-center gap-1">
                    <span>Dist: </span>
                    ${distHtml}
                </div>
                <div class="flex items-center gap-1 border-t border-slate-700 mt-0.5 pt-0.5 w-full justify-end">
                    <span>Zones:</span>
                    ${regHtml}
                </div>
            `;
        }
    }

    renderGridStructure() {
        const header = document.getElementById('grid-header');
        const body = document.getElementById('grid-body');
        if (!header || !body) return;

        const isMobile = window.innerWidth < 640;

        const colString = isMobile 
            ? `20px 60px repeat(${DATES.length}, minmax(45px, 1fr))`
            : `40px 130px repeat(${DATES.length}, minmax(60px, 1fr))`;
        
        header.style.gridTemplateColumns = colString;

        let headerHtml = `<div class="bg-gray-50 p-1 sm:p-2 border-r border-gray-200 flex items-center justify-center"><span class="text-[8px] sm:text-[10px] font-bold text-slate-500 -rotate-90">REG</span></div><div class="bg-gray-50 p-1 sm:p-2 border-r border-gray-200 flex items-center justify-center"><span class="text-[8px] sm:text-xs font-bold text-gray-400">VENUE</span></div>`;
        
        DATES.forEach(dateStr => {
            const day = dateStr.split('-')[2];
            const dateObj = new Date(parseInt(dateStr.split('-')[0]), parseInt(dateStr.split('-')[1])-1, parseInt(day));
            const dayName = dateObj.toLocaleDateString('en-US', { weekday: 'short' });
            headerHtml += `<div class="p-1 sm:p-2 border-r border-gray-200 text-center overflow-hidden"><div class="text-[8px] sm:text-xs font-bold text-slate-500 uppercase">${dayName}</div><div class="text-xs sm:text-lg font-bold text-slate-800">${day}</div></div>`;
        });
        header.innerHTML = headerHtml;
        
        body.className = "grid relative";
        body.style.gridTemplateColumns = colString;
        
        const regionCounts = {};
        Object.values(CITIES).forEach(c => { regionCounts[c.region] = (regionCounts[c.region] || 0) + 1; });
        const processedRegions = new Set();
        let bodyHtml = '';
        
        Object.keys(CITIES).forEach(cityKey => {
            const cityData = CITIES[cityKey];
            const regionData = REGIONS[cityData.region];
            if (!processedRegions.has(cityData.region)) {
                const span = regionCounts[cityData.region];
                bodyHtml += `<div class="border-r border-white/20 border-b border-gray-100 flex items-center justify-center" style="grid-row: span ${span}; background-color: ${regionData.color}"><span class="text-[8px] sm:text-xs font-bold text-slate-800 uppercase tracking-widest whitespace-nowrap -rotate-90 transform">${regionData.label.split(' ')[0]}</span></div>`;
                processedRegions.add(cityData.region);
            }
            bodyHtml += `<div class="p-1 sm:p-2 border-r border-white/20 border-b border-gray-100 flex flex-col justify-center" style="background-color: ${regionData.color}"><div class="font-bold text-slate-900 text-[10px] sm:text-sm leading-tight truncate" title="${cityData.name}">${cityData.name}</div><span class="text-[7px] sm:text-[9px] text-slate-800/60 font-medium mt-0.5 truncate hidden sm:block">${cityKey}</span></div>`;
            
            DATES.forEach(date => {
                bodyHtml += `<div id="cell-${cityKey.replace(/ /g, '_')}-${date}" class="relative border-r border-gray-100 border-b border-gray-100 min-h-[60px] sm:min-h-[80px] bg-white transition-all duration-200 drop-zone" data-city="${cityKey}" data-date="${date}"></div>`;
            });
        });
        body.innerHTML = bodyHtml;

        document.querySelectorAll('.drop-zone').forEach(zone => {
            zone.addEventListener('dragenter', (e) => { 
                e.preventDefault(); 
                e.dataTransfer.dropEffect = "move"; 
                zone.classList.add('drag-over'); 
            });
            zone.addEventListener('dragover', (e) => { 
                e.preventDefault(); 
                e.dataTransfer.dropEffect = "move"; 
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
                div.id = `match-${match.id}`;
                div.className = `match-card absolute inset-0.5 rounded-sm shadow-sm border border-black/10 cursor-move flex flex-col items-center justify-center p-0.5 hover:scale-105 hover:shadow-md hover:z-50 transition-transform ${GROUPS[match.group] || 'bg-gray-500 text-white'}`;
                div.draggable = true;

                const getTeamDisplay = (name) => {
                    if (name.includes('/')) {
                        return {
                            html: name.replace(/\//g, '/<wbr>'),
                            css: "font-bold text-[6px] sm:text-[9.5px] leading-[7px] sm:leading-[10px] text-center w-full break-words whitespace-normal"
                        };
                    }
                    return {
                        html: name,
                        css: "font-bold text-[9px] sm:text-xs leading-tight text-center w-full truncate"
                    };
                };

                const t1 = getTeamDisplay(match.t1);
                const t2 = getTeamDisplay(match.t2);

                div.innerHTML = `
                    <div class="text-[6px] sm:text-[8px] font-bold opacity-80 uppercase leading-none mb-0.5">Grp ${match.group}</div>
                    <div class="${t1.css}">${t1.html}</div>
                    <div class="text-[6px] sm:text-[8px] opacity-60 leading-none">vs</div>
                    <div class="${t2.css}">${t2.html}</div>
                `;
                
                div.addEventListener('dragstart', (e) => {
                    this.draggedMatch = match;
                    div.classList.add('dragging');
                    e.dataTransfer.effectAllowed = "move";
                    e.dataTransfer.setData('text/plain', JSON.stringify(match));
                });
                
                div.addEventListener('dragend', () => {
                    this.draggedMatch = null;
                    div.classList.remove('dragging');
                });

                cell.appendChild(div);
            }
        });
    }

    validateConstraints(tempSchedule, changedMatches) {
        const getDayDiff = (d1, d2) => {
            const date1 = new Date(d1);
            const date2 = new Date(d2);
            return Math.abs((date2 - date1) / (1000 * 60 * 60 * 24));
        };

        for (const m of changedMatches) {
            const cityMatches = tempSchedule.filter(x => x.city === m.city).sort((a, b) => new Date(a.date) - new Date(b.date));
            const mIndex = cityMatches.findIndex(x => x.id === m.id);
            
            if (mIndex > 0) {
                const prev = cityMatches[mIndex - 1];
                if (getDayDiff(m.date, prev.date) < 2) {
                    return `Stadium ${m.city} needs a rest day after ${prev.date}.`;
                }
            }
            if (mIndex < cityMatches.length - 1) {
                const next = cityMatches[mIndex + 1];
                if (getDayDiff(m.date, next.date) < 2) {
                    return `Stadium ${m.city} needs a rest day before ${next.date}.`;
                }
            }

            for (const team of [m.t1, m.t2]) {
                const teamMatches = tempSchedule
                    .filter(x => x.t1 === team || x.t2 === team)
                    .sort((a, b) => new Date(a.date) - new Date(b.date));
                
                const tIndex = teamMatches.findIndex(x => x.id === m.id);
                
                if (tIndex > 0) {
                    const prev = teamMatches[tIndex - 1];
                    if (getDayDiff(m.date, prev.date) < 4) {
                        return `${team} plays too soon after ${prev.date} (Min 3 rest days).`;
                    }
                }
                if (tIndex < teamMatches.length - 1) {
                    const next = teamMatches[tIndex + 1];
                    if (getDayDiff(m.date, next.date) < 4) {
                        return `${team} plays too soon before ${next.date} (Min 3 rest days).`;
                    }
                }
            }
        }
        return null;
    }

    handleDrop(e) {
        e.preventDefault();
        const zone = e.currentTarget;
        zone.classList.remove('drag-over');

        if (!this.draggedMatch) return;

        const newCity = zone.dataset.city;
        const newDate = zone.dataset.date;

        const tempSchedule = JSON.parse(JSON.stringify(this.scheduleData));
        const changedMatches = [];

        const selfIndex = tempSchedule.findIndex(m => m.id === this.draggedMatch.id);
        const otherMatchIndex = tempSchedule.findIndex(m => m.city === newCity && m.date === newDate && m.id !== this.draggedMatch.id);

        if (selfIndex === -1) return;

        if (otherMatchIndex !== -1) {
            tempSchedule[otherMatchIndex].city = this.draggedMatch.city;
            tempSchedule[otherMatchIndex].date = this.draggedMatch.date;
            changedMatches.push(tempSchedule[otherMatchIndex]);
        }

        tempSchedule[selfIndex].city = newCity;
        tempSchedule[selfIndex].date = newDate;
        changedMatches.push(tempSchedule[selfIndex]);

        const errorMsg = this.validateConstraints(tempSchedule, changedMatches);

        if (errorMsg) {
            this.showError(errorMsg);
            
            const el = document.getElementById(`match-${this.draggedMatch.id}`);
            if (el) {
                el.classList.add('shake-invalid');
                setTimeout(() => el.classList.remove('shake-invalid'), 500);
            }
            return;
        }

        this.scheduleData = tempSchedule;
        this.customData = JSON.parse(JSON.stringify(this.scheduleData));
        this.currentMode = 'custom';
        this.updateUI();
    }

    renderLegend() {
        const legend = document.getElementById('legend');
        if (!legend) return;
        let html = '<span class="font-bold text-gray-700">LEGEND:</span>';
        Object.keys(GROUPS).forEach(g => {
            const colorClass = GROUPS[g].split(' ')[0];
            html += `<div class="flex items-center gap-1"><div class="w-3 h-3 rounded-sm ${colorClass}"></div><span>Grp ${g}</span></div>`;
        });
        legend.innerHTML = html;
    }
}