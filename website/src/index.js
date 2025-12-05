import { SchedulerApp } from './classes/scheduler.js';


document.addEventListener('DOMContentLoaded', () => {
    // Initialize App
    const app = new SchedulerApp();
    window.app = app;

    // Attach Event Listeners to Buttons
    const btnOfficial = document.getElementById('btn-official');
    const btnOptimal = document.getElementById('btn-optimal');
    const btnCustom = document.getElementById('btn-custom'); // Select the custom button
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

    // NEW: Add listener for Custom button
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