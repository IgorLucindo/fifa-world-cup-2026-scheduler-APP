import { SchedulerApp } from './classes/scheduler.js';
import { toggleMobileInfo } from './utils/footer_utils.js';


document.addEventListener('DOMContentLoaded', () => {
    // Initialize App
    const app = new SchedulerApp();
    window.app = app;

    // Attach Event Listeners to Buttons
    const btnUnit = document.getElementById('btn-unit');
    const btnOfficial = document.getElementById('btn-official');
    const btnOptimal = document.getElementById('btn-optimal');
    const btnCustom = document.getElementById('btn-custom'); 
    const btnDownload = document.getElementById('btn-download');
    const footerHeader = document.getElementById('footer-header');
    const overlay = document.getElementById('mobile-overlay');

    btnUnit.addEventListener('click', () => {app.toggleUnit();});
    btnOfficial.addEventListener('click', () => {app.setMode('official');});
    btnOptimal.addEventListener('click', () => {app.setMode('optimal');});
    btnCustom.addEventListener('click', () => {app.setMode('custom');});
    btnDownload.addEventListener('click', () => {app.downloadAll();});
    if (footerHeader) footerHeader.addEventListener('click', toggleMobileInfo);
    if (overlay) overlay.addEventListener('click', toggleMobileInfo);
});