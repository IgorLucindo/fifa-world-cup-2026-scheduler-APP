import { SchedulerApp } from './classes/scheduler.js';


document.addEventListener('DOMContentLoaded', () => {
    // Initialize App
    const app = new SchedulerApp();
    
    // Make app available globally for debugging (optional)
    window.app = app;

    // Attach Event Listeners to Buttons
    const btnOfficial = document.getElementById('btn-official');
    const btnOptimal = document.getElementById('btn-optimal');

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
});