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
            // Update values
            distEl.innerText = currentDistDisplay.toLocaleString('en-US');
            if (unitEl) unitEl.innerText = this.currentUnit;
            if (zonesEl) zonesEl.innerText = currentRegions;

            // CORRECT LOGIC: Identify 'valueRow' correctly based on whether structure is already modified
            let valueRow = distEl.parentElement;
            if (zonesEl) {
                // If zonesEl exists, distEl is wrapped in an inner div, so valueRow is parent's parent
                valueRow = valueRow.parentElement;
            }

            if (valueRow) {
                // Ensure Single Line Layout (flex-nowrap) persists
                valueRow.className = "flex items-baseline gap-4 flex-nowrap"; 
                
                const travelWrapper = valueRow.parentElement;
                if (travelWrapper) {
                    // CENTER on Mobile
                    travelWrapper.className = "flex flex-col items-center sm:items-end flex-1";
                    
                    const mainStatBox = travelWrapper.parentElement;
                    if (mainStatBox) {
                        // ALIGN TITLES Vertically
                        if (mainStatBox.classList.contains('items-center')) {
                            mainStatBox.classList.remove('items-center');
                            mainStatBox.classList.add('items-stretch');
                        }
                    }
                }

                if (!zonesEl) {
                    valueRow.innerHTML = `
                        <div class="flex items-baseline gap-1">
                            <span id="total-dist" class="text-lg sm:text-2xl font-mono font-bold text-white">${currentDistDisplay.toLocaleString()}</span>
                            <span id="dist-unit" class="text-xs text-slate-400">${this.currentUnit}</span>
                        </div>
                        
                        <div class="flex items-center gap-1">
                            <span id="total-zones" class="text-lg sm:text-2xl font-mono font-bold text-white">${currentRegions}</span>
                            <span class="text-[8px] text-slate-400 uppercase leading-3">Crossed<br>Zones</span>
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
                return `<span class="${color}">${sign}${val.toLocaleString('en-US')} ${label}</span>`;
            };

            const distHtml = getStatHtml(diffDist, '');
            const regHtml = getStatHtml(diffRegions, '');

            effContainer.className = "flex flex-col items-start font-mono font-bold text-[10px] sm:text-xs leading-tight";
            effContainer.innerHTML = `
                <div class="flex items-center gap-1">
                    <span>Distance:</span>
                    ${distHtml}
                </div>
                <div class="flex items-center gap-1 border-t border-slate-700 mt-0.5 pt-0.5 w-full">
                    <span>Crossed Zones:</span>
                    ${regHtml}
                </div>
            `;

            const effWrapper = effContainer.parentElement;
            if (effWrapper) {
                // CENTER on Mobile
                effWrapper.className = "flex flex-col items-center sm:items-end flex-1";
            }
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
                // Keep your existing classes
                div.className = `match-card absolute inset-0.5 rounded-sm shadow-sm border border-black/10 cursor-move flex flex-col items-center justify-center p-0.5 hover:scale-105 hover:shadow-md hover:z-50 transition-transform ${GROUPS[match.group] || 'bg-gray-500 text-white'}`;
                
                // Desktop Drag Events (Keep these for PC)
                div.draggable = true;
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

                // NEW: Mobile Instant Touch Events
                div.addEventListener('touchstart', (e) => this.handleTouchStart(e, match, div), { passive: false });

                // Helper for team names (from your original code)
                const getTeamDisplay = (name) => {
                    if (name.includes('/')) {
                        return { html: name.replace(/\//g, '/<wbr>'), css: "font-bold text-[6px] sm:text-[9.5px] leading-[7px] sm:leading-[10px] text-center w-full break-words whitespace-normal" };
                    }
                    return { html: name, css: "font-bold text-[9px] sm:text-xs leading-tight text-center w-full truncate" };
                };
                const t1 = getTeamDisplay(match.t1);
                const t2 = getTeamDisplay(match.t2);

                div.innerHTML = `
                    <div class="text-[6px] sm:text-[8px] font-bold opacity-80 uppercase leading-none mb-0.5">Grp ${match.group}</div>
                    <div class="${t1.css}">${t1.html}</div>
                    <div class="text-[6px] sm:text-[8px] opacity-60 leading-none">vs</div>
                    <div class="${t2.css}">${t2.html}</div>
                `;

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

    async downloadAll() {
        const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent) || window.innerWidth < 640;

        if (isMobile) {
            // MOBILE: Download ONLY the currently active schedule with the CORRECT filename
            // This replaces the previous logic to fix the "Unknown.csv" issue.
            
            let filename = 'fifa_schedule.csv';
            if (this.currentMode === 'official') filename = 'official_schedule.csv';
            else if (this.currentMode === 'optimal') filename = 'mip_schedule.csv';
            else if (this.currentMode === 'custom') filename = 'your_schedule.csv';

            // 1. Get content from the CURRENT displayed schedule
            const csvContent = this.getCSVString(this.scheduleData);
            
            // 2. Create Blob
            const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
            
            // 3. Trigger Download 
            // We use triggerFileDownload() because it creates an <a> tag with the 'download' attribute.
            // This guarantees the browser receives the correct filename.
            this.triggerFileDownload(blob, filename);

        } else {
            // DESKTOP: Download individual files (Sequence) - No changes here
            this.exportToCSV(this.officialData, 'official_schedule.csv');
            setTimeout(() => this.exportToCSV(this.optimalData, 'mip_schedule.csv'), 300);
            
            if (this.customData) {
                setTimeout(() => this.exportToCSV(this.customData, 'your_schedule.csv'), 600);
            }
        }
    }

    // Helper: Generates the CSV string content
    getCSVString(data) {
        const header = ['City', ...DATES].join(',');
        
        const rows = Object.keys(CITIES).map(cityKey => {
            const row = [cityKey];
            DATES.forEach(date => {
                const match = data.find(m => m.city === cityKey && m.date === date);
                if (match) {
                    const idStr = match.id.replace('m', '');
                    row.push(`"m${idStr} (${match.group}): ${match.t1} vs ${match.t2}"`);
                } else {
                    row.push('');
                }
            });
            return row.join(',');
        });

        return [header, ...rows].join('\n');
    }

    // Helper: Handles the actual file download logic
    triggerFileDownload(blob, filename) {
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = filename;
        
        // iOS Safari Requirement: Open in new tab to force download prompt
        if (/iPhone|iPad|iPod/i.test(navigator.userAgent)) {
            link.target = '_blank';
        }

        link.style.display = 'none';
        document.body.appendChild(link);
        link.click();
        
        document.body.removeChild(link);
        setTimeout(() => URL.revokeObjectURL(url), 100);
    }

    // Legacy support for Desktop sequence
    exportToCSV(data, filename) {
        const csvContent = this.getCSVString(data);
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        this.triggerFileDownload(blob, filename);
    }

    handleTouchStart(e, match, originalEl) {
        // 1. Prevent default to stop scrolling/native behavior
        if (e.cancelable) e.preventDefault();

        this.draggedMatch = match;
        const touch = e.touches[0];

        // 2. Create a "Ghost" element to follow the finger
        this.ghostEl = originalEl.cloneNode(true);
        this.ghostEl.style.position = 'fixed';
        this.ghostEl.style.zIndex = '9999';
        this.ghostEl.style.width = `${originalEl.offsetWidth}px`;
        this.ghostEl.style.height = `${originalEl.offsetHeight}px`;
        this.ghostEl.style.opacity = '0.9';
        this.ghostEl.style.pointerEvents = 'none'; // Critical: allows elementFromPoint to see the drop zone underneath
        this.ghostEl.classList.add('shadow-2xl');
        
        // Initial positioning
        this.updateGhostPosition(touch);
        document.body.appendChild(this.ghostEl);

        // 3. Highlight the original card to show it's being moved
        originalEl.classList.add('opacity-50');
        this.activeDragEl = originalEl;

        // 4. Bind global move/end listeners (using arrow functions to keep 'this' context)
        this._touchMoveHandler = (ev) => this.handleTouchMove(ev);
        this._touchEndHandler = (ev) => this.handleTouchEnd(ev);

        document.addEventListener('touchmove', this._touchMoveHandler, { passive: false });
        document.addEventListener('touchend', this._touchEndHandler, { passive: false });
    }

    handleTouchMove(e) {
        if (e.cancelable) e.preventDefault(); // Stop scrolling while dragging
        const touch = e.touches[0];
        this.updateGhostPosition(touch);

        // Optional: Highlight drop zone under finger
        const target = document.elementFromPoint(touch.clientX, touch.clientY);
        const zone = target ? target.closest('.drop-zone') : null;
        
        // Clear previous highlights
        document.querySelectorAll('.drop-zone.drag-over').forEach(el => el.classList.remove('drag-over'));
        if (zone) zone.classList.add('drag-over');
    }

    handleTouchEnd(e) {
        // Clean up listeners
        document.removeEventListener('touchmove', this._touchMoveHandler);
        document.removeEventListener('touchend', this._touchEndHandler);

        // Remove Ghost
        if (this.ghostEl) {
            this.ghostEl.remove();
            this.ghostEl = null;
        }

        // Restore original element style
        if (this.activeDragEl) {
            this.activeDragEl.classList.remove('opacity-50');
            this.activeDragEl = null;
        }

        // Find drop target
        const touch = e.changedTouches[0];
        const target = document.elementFromPoint(touch.clientX, touch.clientY);
        const zone = target ? target.closest('.drop-zone') : null;

        // Clear highlight
        document.querySelectorAll('.drop-zone.drag-over').forEach(el => el.classList.remove('drag-over'));

        if (zone) {
            // Manually trigger the drop logic
            this.processCustomDrop(zone);
        }
    }

    updateGhostPosition(touch) {
        if (this.ghostEl) {
            // Center the ghost on the finger
            this.ghostEl.style.left = `${touch.clientX - (this.ghostEl.offsetWidth / 2)}px`;
            this.ghostEl.style.top = `${touch.clientY - (this.ghostEl.offsetHeight / 2)}px`;
        }
    }

    // A helper to reuse logic between Desktop Drop and Mobile Drop
    processCustomDrop(zone) {
        const newCity = zone.dataset.city;
        const newDate = zone.dataset.date;
        
        // Reuse your existing logic, but adapted since we don't have a DragEvent
        if (!this.draggedMatch) return;

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
}