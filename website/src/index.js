import { SchedulerApp } from './classes/scheduler.js';

document.addEventListener('DOMContentLoaded', () => {
    // --- Initialize Mobile Drag & Drop Polyfill ---
    if (window.MobileDragDrop) {
        MobileDragDrop.polyfill({
            dragImageTranslateOverride: MobileDragDrop.scrollBehaviourDragImageTranslateOverride,
            holdToDrag: 200, 
            dragImageCenterOnTouch: true,
            forceApply: true // NEW: Forces polyfill to work in DevTools/Hybrid devices
        });
        
        // Keep this listener to prevent default scrolling behavior during drags
        window.addEventListener('touchmove', function() {}, { passive: false });
    }

    // Initialize App
    const app = new SchedulerApp();
    window.app = app;

    // Attach Event Listeners to Buttons
    const btnOfficial = document.getElementById('btn-official');
    const btnOptimal = document.getElementById('btn-optimal');
    const btnCustom = document.getElementById('btn-custom'); 
    const btnUnit = document.getElementById('btn-unit');

    if (btnOfficial) {
        btnOfficial.addEventListener('click', () => {
            app.setMode('official');
        });
    }

    if (btnOptimal) {
        btnOptimal.addEventListener('click', () => {
            app.setMode('optimal');
        });
    }

    if (btnCustom) {
        btnCustom.addEventListener('click', () => {
            app.setMode('custom');
        });
    }

    if (btnUnit) {
        btnUnit.addEventListener('click', () => {
            app.toggleUnit();
        });
    }
});