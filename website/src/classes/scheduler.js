import { FLAG_CODES, FLAG_CUSTOM_SRCS } from '../data/data.js';
import { Calculator } from './calculator.js';
import { DataHandler } from './dataHandler.js';
import { UIManager } from './UIManager.js';
import { DragDropManager } from './dragDropManager.js';


export class SchedulerApp {
    constructor() {
        this.flagSrcs = this.generateFlagSources(FLAG_CODES, FLAG_CUSTOM_SRCS);
        this.currentMode = 'optimal';
        this.currentUnit = this.getPreferredUnit();

        this.officialData = [];
        this.optimalData = [];
        this.scheduleData = [];
        this.customData = null;
        this.baselineDist = 0;
        this.baselineRegions = 0;

        // Instantiate Sub-Controllers
        this.ui = new UIManager(this);
        this.dragDrop = new DragDropManager(this);

        this.init();
    }


    generateFlagSources(codes, customSrcs) {
        const compiledSrcs = {};
        for (const [team, code] of Object.entries(codes)) {
            compiledSrcs[team] = `https://flagcdn.com/${code}.svg`;
        }
        for (const [team, src] of Object.entries(customSrcs)) {
            compiledSrcs[team] = src;
        }
        return compiledSrcs;
    }


    getPreferredUnit() {
        const lang = navigator.language || 'en-US';
        if (lang.startsWith('en-US') || lang.startsWith('en-GB')) {
            return 'mi';
        }
        return 'km';
    }


    async init() {
        this.ui.renderGridStructure();
        this.ui.renderLegend();
        
        const distEl = document.getElementById('total-dist');
        if (distEl) distEl.innerText = 'Loading...';

        try {
            const [official, optimal] = await Promise.all([
                DataHandler.loadSchedule(`./dataset/${encodeURIComponent('official_schedule.csv')}`),
                DataHandler.loadSchedule(`./dataset/${encodeURIComponent('mip_schedule.csv')}`)
            ]);

            this.officialData = official;
            this.optimalData = optimal;

            // Baseline: Use Optimal (MIP)
            this.baselineDist = Calculator.calculateTotalDistance(this.optimalData);
            this.baselineRegions = Calculator.calculateRegionCrossings(this.optimalData);

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


    setMode(mode) {
        this.currentMode = mode;
        if (mode === 'official') this.scheduleData = JSON.parse(JSON.stringify(this.officialData));
        if (mode === 'optimal') this.scheduleData = JSON.parse(JSON.stringify(this.optimalData));
        if (mode === 'custom' && this.customData) this.scheduleData = JSON.parse(JSON.stringify(this.customData));
        
        this.ui.updateUI();
    }


    toggleUnit() {
        this.currentUnit = this.currentUnit === 'km' ? 'mi' : 'km';
        this.ui.updateUI();
    }


    // A proxy required for the HTML onclick strings linking to "window.app.highlightMatches"
    highlightMatches(ids) {
        this.ui.highlightMatches(ids);
    }


    async downloadAll() {
        DataHandler.downloadAll(this);
    }
}