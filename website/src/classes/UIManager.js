import { CITIES, DATES, GROUPS, REGIONS, TEAM_NAMES, MATCH_TIMES_UTC } from '../data/data.js';
import { Calculator } from './calculator.js';
import { Validator } from './validator.js';
import { MatchHoverTimer } from './matchHoverTimer.js';


export class UIManager {
    constructor(app) {
        this.app = app;
        this._hoverTimer = null;
        this._overlay = null;
        this._spotlight = null;
        this._footerEl = null;
        this._spotlightVisible = false;
        this._hoverMouseOver = null;
        this._hoverMouseOut = null;
        this._hoverMouseDown = null;
        this._activeCardEl = null;
        this._violationsPanelExpanded = false;
        this._lastViolations = [];
    }


    updateUI() {
        const btnOfficial = document.getElementById('btn-official');
        const btnOptimal = document.getElementById('btn-optimal');
        const btnCustom = document.getElementById('btn-custom');
        const btnUnit = document.getElementById('btn-unit');

        if (btnUnit) btnUnit.innerText = `UNIT: ${this.app.currentUnit.toUpperCase()}`;

        const inactiveClass = "text-slate-400 hover:text-white bg-transparent shadow-none cursor-pointer";
        const activeOfficial = "bg-slate-600 text-white shadow-sm";
        const activeOptimal = "bg-emerald-600 text-white shadow-sm";
        const activeCustom = "bg-amber-600 text-white shadow-sm";

        if (btnOfficial) btnOfficial.className = `flex-1 px-3 py-1.5 rounded-md text-sm font-medium transition-all whitespace-nowrap ${this.app.currentMode === 'official' ? activeOfficial : inactiveClass}`;
        if (btnOptimal) btnOptimal.className = `flex-1 px-3 py-1.5 rounded-md text-sm font-medium transition-all whitespace-nowrap ${this.app.currentMode === 'optimal' ? activeOptimal : inactiveClass}`;
        
        if (btnCustom) {
            if (this.app.customData) {
                btnCustom.disabled = false;
                btnCustom.className = `flex-1 px-3 py-1.5 rounded-md text-sm font-medium transition-all whitespace-nowrap ${this.app.currentMode === 'custom' ? activeCustom : inactiveClass}`;
            } else {
                btnCustom.disabled = true;
                btnCustom.className = `flex-1 px-3 py-1.5 rounded-md text-sm font-medium transition-all text-slate-600 bg-transparent cursor-not-allowed whitespace-nowrap`;
            }
        }

        // Validate Schedule using Validator class
        const validation = this.app.currentMode === 'custom' ? Validator.validateAllConstraints(this.app.scheduleData, this.app.optimalData) : { violations: [], matchViolations: new Set() };
        const isInvalid = validation.violations.length > 0;

        this.renderGridMatches(validation.matchViolations);
        this.renderViolationsPanel(validation.violations);
        
        const factor = this.app.currentUnit === 'km' ? 1.609344 : 1;
        const currentDistBase = Calculator.calculateTotalDistance(this.app.scheduleData);
        const currentDistDisplay = Math.round(currentDistBase * factor);
        const baselineDistDisplay = Math.round(this.app.baselineDist * factor);
        
        const currentRegions = Calculator.calculateRegionCrossings(this.app.scheduleData);
        const diffRegions = currentRegions - this.app.baselineRegions;
        const diffDist = currentDistDisplay - baselineDistDisplay;

        const distEl = document.getElementById('total-dist');
        const unitEl = document.getElementById('dist-unit');
        const zonesEl = document.getElementById('total-zones');

        if (distEl) {
            let valueRow = distEl.parentElement;
            if (zonesEl) valueRow = valueRow.parentElement;

            if (valueRow) {
                valueRow.className = "flex items-baseline gap-4 flex-nowrap"; 
                const travelWrapper = valueRow.parentElement;
                if (travelWrapper) {
                    travelWrapper.className = "flex flex-col items-center sm:items-end flex-1";
                    const mainStatBox = travelWrapper.parentElement;
                    if (mainStatBox && mainStatBox.classList.contains('items-center')) {
                        mainStatBox.classList.remove('items-center');
                        mainStatBox.classList.add('items-stretch');
                    }
                }

                if (!zonesEl) {
                    valueRow.innerHTML = `
                        <div class="flex items-baseline gap-1">
                            <span id="total-dist" class="text-lg sm:text-2xl font-mono font-bold"></span>
                            <span id="dist-unit" class="text-xs text-slate-400">${this.app.currentUnit}</span>
                        </div>
                        <div class="flex items-center gap-1">
                            <span id="total-zones" class="text-lg sm:text-2xl font-mono font-bold"></span>
                            <span class="text-[8px] text-slate-400 uppercase leading-3">Crossed<br>Zones</span>
                        </div>
                    `;
                }
            }
            
            // Re-fetch after updating DOM structure
            const updatedDistEl = document.getElementById('total-dist');
            const updatedUnitEl = document.getElementById('dist-unit');
            const updatedZonesEl = document.getElementById('total-zones');

            if (updatedDistEl) {
                updatedDistEl.innerText = currentDistDisplay.toLocaleString('en-US');
                updatedDistEl.className = `text-lg sm:text-2xl font-mono font-bold transition-colors ${isInvalid ? 'text-red-400' : 'text-white'}`;
            }
            if (updatedUnitEl) {
                updatedUnitEl.innerText = this.app.currentUnit;
            }
            if (updatedZonesEl) {
                updatedZonesEl.innerText = currentRegions;
                updatedZonesEl.className = `text-lg sm:text-2xl font-mono font-bold transition-colors ${isInvalid ? 'text-red-400' : 'text-white'}`;
            }
        }
        
        const effContainer = document.getElementById('efficiency-container');
        if (effContainer) {
            const getStatHtml = (val, label) => {
                // If invalid, replace the efficiency score with INVALID to keep layout frozen
                if (isInvalid) return `<span class="text-red-400 tracking-wider">-</span>`;
                if (this.app.currentMode === 'optimal') return `<span class="text-slate-400">Baseline</span>`;
                
                const color = val <= 0 ? 'text-green-400' : 'text-red-400';
                const sign = val > 0 ? '+' : '';
                return `<span class="${color}">${sign}${val.toLocaleString('en-US')} ${label}</span>`;
            };

            const distHtml = getStatHtml(diffDist, '');
            const regHtml = getStatHtml(diffRegions, '');

            effContainer.className = "flex flex-col items-start font-mono font-bold text-[10px] sm:text-xs leading-tight w-full";
            effContainer.innerHTML = `
                <div class="flex items-center justify-between gap-2 w-full">
                    <span>Distance:</span>
                    ${distHtml}
                </div>
                <div class="flex items-center justify-between gap-2 border-t border-slate-700 mt-0.5 pt-0.5 w-full">
                    <span>Crossed Zones:</span>
                    ${regHtml}
                </div>
            `;

            const effWrapper = effContainer.parentElement;
            if (effWrapper) {
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
            ? `20px 70px repeat(${DATES.length}, minmax(60px, 1fr))`
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
            zone.addEventListener('drop', (e) => this.app.dragDrop.handleDrop(e));
        });

        this.createMatchHover();
    }


    renderGridMatches(matchViolations = new Set()) {
        document.querySelectorAll('.drop-zone').forEach(zone => zone.innerHTML = '');

        this.app.scheduleData.forEach(match => {
            const cellId = `cell-${match.city.replace(/ /g, '_')}-${match.date}`;
            const cell = document.getElementById(cellId);
            if (cell) {
                const div = document.createElement('div');
                div.id = `match-${match.id}`;
                
                const isViolated = matchViolations.has(match.id);
                const borderClass = isViolated ? 'border-[2px] border-red-500 bg-red-50 match-violation' : 'border border-slate-200 bg-white';
                
                div.className = `match-card absolute inset-0 rounded-[4px] shadow-sm cursor-move flex overflow-hidden transition-all duration-200 ${borderClass}`;
                
                // Attach events using dragDrop manager
                div.draggable = true;
                div.addEventListener('dragstart', (e) => this.app.dragDrop.handleDragStart(e, match, div));
                div.addEventListener('dragend', () => this.app.dragDrop.handleDragEnd(div));
                div.addEventListener('touchstart', (e) => this.app.dragDrop.handleTouchStart(e, match, div), { passive: false });

                const getTeamDisplay = (name) => {
                    const containerClasses = "w-7 h-5 sm:w-10 sm:h-6 flex items-center justify-center overflow-hidden rounded-[3px] border border-black/15 shadow-sm bg-slate-100 mx-auto";
                    
                    const src = this.app.flagSrcs[name.trim()];
                    if (src) {
                        return `<div class="${containerClasses}"><img src="${src}" class="w-full h-full object-cover" alt="${name.trim()}"></div>`;
                    }
                    return `<div class="${containerClasses}"><span class="font-bold text-[10px]">${name}</span></div>`;
                };
                
                const t1Html = getTeamDisplay(match.t1);
                const t2Html = getTeamDisplay(match.t2);

                const groupBgClass = GROUPS[match.group] ? GROUPS[match.group].split(' ')[0] : 'bg-slate-400';
                const badgeHtml = isViolated ? `<div class="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-[16px] h-[16px] flex items-center justify-center text-[10px] font-bold z-10 shadow-sm leading-none">!</div>` : '';

                div.innerHTML = `
                    ${badgeHtml}
                    <div class="w-1.5 sm:w-2 h-full shrink-0 ${groupBgClass}"></div>
                    <div class="flex flex-col items-center justify-center w-full h-full py-0.5 relative ${isViolated ? '' : 'bg-white'}">
                        <div class="flex-1 w-full flex items-center justify-center min-h-0 overflow-hidden">${t1Html}</div>
                        <div class="text-[7px] sm:text-[12px] text-slate-500 my-[1px]">vs</div>
                        <div class="flex-1 w-full flex items-center justify-center min-h-0 overflow-hidden">${t2Html}</div>
                        <div class="match-timer"></div>
                    </div>
                `;

                cell.appendChild(div);
            }
        });
    }


    renderViolationsPanel(violations) {
        this._lastViolations = violations;
        let panel = document.getElementById('violations-panel');
        if (!panel) {
            panel = document.createElement('div');
            panel.id = 'violations-panel';
            panel.className = 'hidden fixed right-4 left-4 sm:left-auto sm:w-80 md:w-[400px] bg-white border border-red-200 rounded-lg shadow-2xl z-[100] flex flex-col overflow-hidden';
            panel.style.bottom = 'calc(env(safe-area-inset-bottom, 0px) + 16px)';
            document.body.appendChild(panel);
        }

        if (violations.length === 0) {
            panel.classList.add('hidden');
            this._violationsPanelExpanded = false;
            return;
        }

        panel.classList.remove('hidden');

        const expanded = this._violationsPanelExpanded;
        const chevronRot = expanded ? 'rotate-180' : 'rotate-0';

        const listHtml = violations.map((v) => `
            <li class="cursor-pointer hover:bg-red-50 p-3 border-b border-red-100 last:border-0 text-xs text-red-800 transition-colors flex items-start gap-2.5"
                onclick="window.app.highlightMatches(${JSON.stringify(v.ids).replace(/"/g, '&quot;')})">
                <svg class="w-4 h-4 text-red-500 mt-0.5 shrink-0" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
                <span class="leading-relaxed">${v.msg}</span>
            </li>
        `).join('');

        panel.innerHTML = `
            <div class="bg-red-500 p-2 sm:p-3 flex justify-between items-center cursor-pointer select-none" onclick="window.app.ui.toggleViolationsPanel()">
                <h4 class="text-white font-bold text-xs sm:text-sm flex items-center gap-2 m-0">
                    <svg class="w-4 h-4 sm:w-5 sm:h-5" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>
                    Conflicts Detected (${violations.length})
                </h4>
                <svg class="w-4 h-4 text-white transition-transform duration-200 ${chevronRot}" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>
            </div>
            ${expanded ? `
            <div class="bg-red-50 py-1.5 px-3 text-[10px] text-red-600 font-semibold uppercase tracking-wider border-b border-red-100">
                Click an item to highlight matches
            </div>
            <ul class="overflow-y-auto max-h-[25vh] sm:max-h-64 bg-white m-0 p-0">
                ${listHtml}
            </ul>` : ''}
        `;
    }


    toggleViolationsPanel() {
        this._violationsPanelExpanded = !this._violationsPanelExpanded;
        this.renderViolationsPanel(this._lastViolations);
    }


    highlightMatches(ids) {
        ids.forEach(id => {
            const el = document.getElementById(`match-${id}`);
            if (el) {
                el.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'center' });
                el.classList.add('shake-invalid', 'z-[60]');
                setTimeout(() => {
                    el.classList.remove('shake-invalid', 'z-[60]');
                }, 1000);
            }
        });
    }


    // ---------------------------------------------------------------
    //  Match Spotlight
    // ---------------------------------------------------------------

    createMatchHover() {
        // Build overlay + card DOM once
        if (!this._overlay) {
            const overlay = document.createElement('div');
            overlay.id = 'match-overlay';
            overlay.className = 'match-overlay';
            overlay.addEventListener('click', () => this.hideMatchSpotlight());
            document.body.appendChild(overlay);
            this._overlay = overlay;

            const spotlight = document.createElement('div');
            spotlight.id = 'match-spotlight';
            spotlight.className = 'match-spotlight';
            document.body.appendChild(spotlight);
            this._spotlight = spotlight;

            document.addEventListener('keydown', (e) => {
                if (e.key === 'Escape') this.hideMatchSpotlight();
            });
        }

        // Create a fresh timer instance
        this._hoverTimer = new MatchHoverTimer((match, el) => this.showMatchSpotlight(match, el));

        const gridBody = document.getElementById('grid-body');
        if (!gridBody) return;

        // Remove stale listeners before attaching new ones
        if (this._hoverMouseOver)  gridBody.removeEventListener('mouseover',  this._hoverMouseOver);
        if (this._hoverMouseOut)   gridBody.removeEventListener('mouseout',   this._hoverMouseOut);
        if (this._hoverMouseDown)  gridBody.removeEventListener('mousedown',  this._hoverMouseDown);

        this._hoverMouseOver = (e) => {
            if (this._spotlightVisible) return;
            const card = e.target.closest('.match-card');
            if (!card) return;
            const matchId = card.id.replace('match-', '');
            const match = this.app.scheduleData.find(m => m.id === matchId);
            if (!match) return;
            this._hoverTimer.attachToCard(card, match);
        };

        this._hoverMouseOut = (e) => {
            if (this._spotlightVisible) return;
            const card = e.target.closest('.match-card');
            if (!card) return;
            this._hoverTimer.reset();
        };

        this._hoverMouseDown = (e) => {
            const card = e.target.closest('.match-card');
            if (!card) return;
            this._hoverTimer.reset();
        };

        gridBody.addEventListener('mouseover',  this._hoverMouseOver);
        gridBody.addEventListener('mouseout',   this._hoverMouseOut);
        gridBody.addEventListener('mousedown',  this._hoverMouseDown);
    }

    showMatchSpotlight(match, cardEl) {
        if (!this._overlay || !this._spotlight) return;

        // --- Group colors ---
        const groupClasses = GROUPS[match.group] || '';
        const hexMatch     = groupClasses.match(/#([0-9a-fA-F]{3,6})/);
        const groupColor   = hexMatch ? `#${hexMatch[1]}` : '#64748b';
        const textColor    = groupClasses.includes('text-white') ? 'white' : 'black';

        // --- Venue & date ---
        const cityData  = CITIES[match.city];
        const venueName = cityData ? cityData.name : match.city.replace(/_/g, ' ');

        const [year, month, day] = match.date.split('-').map(Number);
        const timeStr  = MATCH_TIMES_UTC[match.id] || '19:00';
        const [hh, mm] = timeStr.split(':').map(Number);
        const kickoff  = new Date(Date.UTC(year, month - 1, day, hh, mm));

        const formattedDate = kickoff.toLocaleDateString(navigator.language || 'en-US', {
            weekday: 'long', month: 'long', day: 'numeric', year: 'numeric'
        });
        const formattedTime = kickoff.toLocaleTimeString(navigator.language || 'en-US', {
            hour: '2-digit', minute: '2-digit', timeZoneName: 'short'
        });

        // --- Team names + flags ---
        const getTeamHtml = (code) => {
            const name = TEAM_NAMES[code.trim()] || code.trim();
            const src  = this.app.flagSrcs[code.trim()];
            const flag = src
                ? `<img src="${src}" class="match-spotlight-flag" alt="${name}">`
                : `<div class="match-spotlight-flag-placeholder">${code.trim()}</div>`;
            return { flag, name };
        };
        const t1 = getTeamHtml(match.t1);
        const t2 = getTeamHtml(match.t2);

        this._spotlight.innerHTML = `
            <div class="match-spotlight-inner">
                <div class="match-spotlight-header" style="background:${groupColor}; color:${textColor};">
                    <span class="group-label">GROUP ${match.group}</span>
                    <span class="match-id-label">${match.id.toUpperCase()}</span>
                </div>
                <div class="match-spotlight-body">
                    <div class="match-spotlight-team">
                        ${t1.flag}
                        <span class="match-spotlight-team-name">${t1.name}</span>
                    </div>
                    <div class="match-spotlight-vs">VS</div>
                    <div class="match-spotlight-team">
                        ${t2.flag}
                        <span class="match-spotlight-team-name">${t2.name}</span>
                    </div>
                </div>
                <div class="match-spotlight-divider"></div>
                <div class="match-spotlight-footer">
                    <span class="match-spotlight-venue">${venueName}</span>
                    <span class="match-spotlight-date">${formattedDate}</span>
                    <span class="match-spotlight-date" style="font-size:14px; font-weight:600; color:#475569; margin-top:2px;">${formattedTime}</span>
                </div>
            </div>
        `;
        this._footerEl = this._spotlight.querySelector('.match-spotlight-footer');

        // --- Animate from card position to screen center ---
        const cardRect    = cardEl.getBoundingClientRect();
        const cardCX      = cardRect.left + cardRect.width  / 2;
        const cardCY      = cardRect.top  + cardRect.height / 2;
        const offsetX     = cardCX - window.innerWidth  / 2;
        const offsetY     = cardCY - window.innerHeight / 2;

        // Step 1: place card at match-block origin, invisible, no transition
        this._activeCardEl = cardEl;
        this._spotlight.style.transition  = 'none';
        this._spotlight.style.visibility  = 'visible';
        this._spotlight.style.pointerEvents = 'auto';
        this._spotlight.style.transform   =
            `translate(calc(-50% + ${offsetX}px), calc(-50% + ${offsetY}px)) scale(0.12) rotate(-6deg)`;

        // Step 2: force reflow so the browser registers the start position
        void this._spotlight.getBoundingClientRect();

        // Step 3: spring to center
        this._spotlight.style.transition  = 'transform 0.35s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
        this._spotlight.style.transform   = 'translate(-50%, -50%) scale(1) rotate(0deg)';

        this._spotlightVisible = true;
        this._overlay.classList.add('visible');

        // Step 4: hand off to idle float (card stays centered via translate(-50%,-50%))
        setTimeout(() => {
            if (!this._spotlightVisible) return;
            const rect = this._spotlight.getBoundingClientRect();
            this._spotlight.style.transition = 'none';
            this._spotlight.style.top = rect.top + 'px';
            this._spotlight.style.transform = 'translate(-50%, 0)';
            void this._spotlight.getBoundingClientRect();
            this._spotlight.style.transition = '';
            this._spotlight.classList.add('float-idle');
        }, 400);

        // Step 5: reveal footer — card stays centered because translate(-50%,-50%)
        // adjusts automatically as the element grows
        setTimeout(() => {
            if (!this._spotlightVisible) return;
            if (this._footerEl) this._footerEl.classList.add('revealed');
        }, 500);
    }

    hideMatchSpotlight() {
        if (!this._overlay || !this._spotlight) return;
        this._spotlightVisible = false;
        this._footerEl = null;

        // Freeze at current visual position to avoid a jump when stopping the animation
        const spotRect = this._spotlight.getBoundingClientRect();
        const vpCX = window.innerWidth  / 2;
        const vpCY = window.innerHeight / 2;
        const spotCX = spotRect.left + spotRect.width  / 2;
        const spotCY = spotRect.top  + spotRect.height / 2;

        this._spotlight.classList.remove('float-idle');

        this._spotlight.style.transition = 'none';
        this._spotlight.style.top = '50%';
        this._spotlight.style.transform =
            `translate(calc(-50% + ${spotCX - vpCX}px), calc(-50% + ${spotCY - vpCY}px)) scale(1)`;
        void this._spotlight.getBoundingClientRect();

        // Animate back to the originating card position
        let targetTransform = 'translate(-50%, -50%) scale(0.08) rotate(4deg)';
        if (this._activeCardEl) {
            const cardRect = this._activeCardEl.getBoundingClientRect();
            const cardCX   = cardRect.left + cardRect.width  / 2;
            const cardCY   = cardRect.top  + cardRect.height / 2;
            targetTransform =
                `translate(calc(-50% + ${cardCX - vpCX}px), calc(-50% + ${cardCY - vpCY}px)) scale(0.08) rotate(6deg)`;
        }

        this._spotlight.style.transition = 'transform 0.22s cubic-bezier(0.55, 0.055, 0.675, 0.19)';
        this._spotlight.style.transform  = targetTransform;

        setTimeout(() => {
            this._spotlight.style.visibility    = 'hidden';
            this._spotlight.style.top           = '';
            this._spotlight.style.transition    = '';
            this._spotlight.style.transform     = '';
            this._spotlight.style.pointerEvents = '';
            this._activeCardEl = null;
        }, 220);

        this._overlay.classList.remove('visible');
        if (this._hoverTimer) this._hoverTimer.reset();
    }

    renderLegend() {
        const legendDesktop = document.getElementById('legend');
        const legendMobile = document.getElementById('legend-mobile');
        
        let desktopHtml = '<span class="font-bold text-gray-700 mt-0.5">LEGEND:</span>';
        let mobileHtml = '<span class="font-bold text-gray-700 text-[10px] mr-3 mt-[2px] shrink-0">LEGEND:</span>';
        mobileHtml += '<div class="grid grid-cols-4 gap-x-1 gap-y-1 w-full max-w-[240px]">';

        Object.keys(GROUPS).forEach(g => {
            const colorClass = GROUPS[g].split(' ')[0];
            desktopHtml += `<div class="flex items-center gap-1"><div class="w-3 h-3 rounded-sm ${colorClass}"></div><span>Grp ${g}</span></div>`;
            mobileHtml += `<div class="flex items-center gap-0.5"><div class="w-2 h-2 rounded-[1px] ${colorClass} shrink-0"></div><span class="text-[9px] font-bold text-slate-500 leading-none mt-[1px]">Grp ${g}</span></div>`;
        });
        
        mobileHtml += '</div>';

        if (legendDesktop) legendDesktop.innerHTML = desktopHtml;
        if (legendMobile) legendMobile.innerHTML = mobileHtml;
    }
}