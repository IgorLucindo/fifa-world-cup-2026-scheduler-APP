import { SchedulerApp } from './classes/scheduler.js';

document.addEventListener('DOMContentLoaded', () => {
    // --- Initialize Mobile Drag & Drop Polyfill ---
    if (window.MobileDragDrop) {
        MobileDragDrop.polyfill({
            dragImageTranslateOverride: MobileDragDrop.scrollBehaviourDragImageTranslateOverride,
            holdToDrag: 50, // Short delay for snappiness
            dragImageCenterOnTouch: false, // FIX: Offset image so finger doesn't block drop zone
            forceApply: true 
        });
        
        // Prevent default scrolling interference
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