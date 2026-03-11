import { CITIES, DATES, GROUPS, REGIONS } from '../data/data.js';
import { Calculator } from './calculator.js';
import { Validator } from './validator.js';


export class UIManager {
    constructor(app) {
        this.app = app;
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
                
                div.className = `match-card absolute inset-0.5 rounded shadow-sm cursor-move flex overflow-hidden hover:scale-110 hover:shadow-lg hover:z-50 transition-all duration-200 ${borderClass}`;
                
                // Attach events using dragDrop manager
                div.draggable = true;
                div.addEventListener('dragstart', (e) => this.app.dragDrop.handleDragStart(e, match, div));
                div.addEventListener('dragend', () => this.app.dragDrop.handleDragEnd(div));
                div.addEventListener('touchstart', (e) => this.app.dragDrop.handleTouchStart(e, match, div), { passive: false });

                const getTeamDisplay = (name) => {
                    const containerClasses = "w-7 h-5 sm:w-10 sm:h-6 flex items-center justify-center overflow-hidden rounded-[3px] border border-black/15 shadow-sm bg-slate-100 mx-auto";
                    
                    if (name.includes('/')) {
                        const flagsHtml = name.split('/').map(n => {
                            const src = this.app.flagSrcs[n.trim()];
                            if (src) return `<img src="${src}" class="w-full h-full object-cover" alt="${n.trim()}">`;
                            return `<div class="w-full h-full flex items-center justify-center bg-slate-200"><span class="text-[6px] font-bold text-slate-800">${n.trim().substring(0,2)}</span></div>`;
                        }).join('');
                        return `<div class="${containerClasses} grid grid-cols-2 grid-rows-2 gap-[1px]">${flagsHtml}</div>`;
                    }
                    
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
                    </div>
                `;

                cell.appendChild(div);
            }
        });
    }


    renderViolationsPanel(violations) {
        let panel = document.getElementById('violations-panel');
        if (!panel) {
            panel = document.createElement('div');
            panel.id = 'violations-panel';
            panel.className = 'hidden fixed bottom-4 right-4 left-4 sm:left-auto sm:w-80 md:w-[400px] bg-white border border-red-200 rounded-lg shadow-2xl z-[100] flex flex-col overflow-hidden transition-opacity duration-200';
            document.body.appendChild(panel);
        }

        if (violations.length === 0) {
            panel.classList.add('hidden');
            return;
        }

        panel.classList.remove('hidden');
        
        const listHtml = violations.map((v) => `
            <li class="cursor-pointer hover:bg-red-50 p-3 border-b border-red-100 last:border-0 text-xs text-red-800 transition-colors flex items-start gap-2.5"
                onclick="window.app.highlightMatches(${JSON.stringify(v.ids).replace(/"/g, '&quot;')})">
                <svg class="w-4 h-4 text-red-500 mt-0.5 shrink-0" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
                <span class="leading-relaxed">${v.msg}</span>
            </li>
        `).join('');

        panel.innerHTML = `
            <div class="bg-red-500 p-2 sm:p-3 flex justify-between items-center shadow-sm z-10">
                <h4 class="text-white font-bold text-xs sm:text-sm flex items-center gap-2 m-0">
                    <svg class="w-4 h-4 sm:w-5 sm:h-5" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>
                    Conflicts Detected (${violations.length})
                </h4>
            </div>
            <div class="bg-red-50 py-1.5 px-3 text-[10px] text-red-600 font-semibold uppercase tracking-wider border-b border-red-100 z-10">
                Click an item to highlight matches
            </div>
            <ul class="overflow-y-auto max-h-[25vh] sm:max-h-64 bg-white m-0 p-0 relative">
                ${listHtml}
            </ul>
        `;
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