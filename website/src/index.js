import { SchedulerApp } from './classes/scheduler.js';

document.addEventListener('DOMContentLoaded', () => {
    // --- Initialize Mobile Drag & Drop Polyfill ---
    if (window.MobileDragDrop) {
        MobileDragDrop.polyfill({
            // Override drag image positioning to work with scrolling
            dragImageTranslateOverride: MobileDragDrop.scrollBehaviourDragImageTranslateOverride,
            // Lower the hold delay to 300ms (default is 500ms) for snappier feel
            holdToDrag: 300 
        });
        
        // Prevent default touch actions that might interfere with dragging
        // This is a standard fix for the polyfill on iOS
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