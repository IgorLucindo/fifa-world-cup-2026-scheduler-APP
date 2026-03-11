export class DragDropManager {
    constructor(app) {
        this.app = app;
        this.draggedMatch = null;
        this.ghostEl = null;
        this.activeDragEl = null;
        
        this._touchMoveHandler = (ev) => this.handleTouchMove(ev);
        this._touchEndHandler = (ev) => this.handleTouchEnd(ev);
    }

    
    handleDragStart(e, match, div) {
        this.draggedMatch = match;
        div.classList.add('dragging');
        e.dataTransfer.effectAllowed = "move";
        e.dataTransfer.setData('text/plain', JSON.stringify(match));
    }


    handleDragEnd(div) {
        this.draggedMatch = null;
        div.classList.remove('dragging');
    }


    handleDrop(e) {
        e.preventDefault();
        const zone = e.currentTarget;
        zone.classList.remove('drag-over');

        if (!this.draggedMatch) return;
        this.processCustomDrop(zone);
    }


    handleTouchStart(e, match, originalEl) {
        if (e.cancelable) e.preventDefault();

        this.draggedMatch = match;
        const touch = e.touches[0];

        this.ghostEl = originalEl.cloneNode(true);
        this.ghostEl.style.position = 'fixed';
        this.ghostEl.style.zIndex = '9999';
        this.ghostEl.style.width = `${originalEl.offsetWidth}px`;
        this.ghostEl.style.height = `${originalEl.offsetHeight}px`;
        this.ghostEl.style.opacity = '0.9';
        this.ghostEl.style.pointerEvents = 'none'; 
        this.ghostEl.classList.add('shadow-2xl');
        
        this.updateGhostPosition(touch);
        document.body.appendChild(this.ghostEl);

        originalEl.classList.add('opacity-50');
        this.activeDragEl = originalEl;

        document.addEventListener('touchmove', this._touchMoveHandler, { passive: false });
        document.addEventListener('touchend', this._touchEndHandler, { passive: false });
    }


    handleTouchMove(e) {
        if (e.cancelable) e.preventDefault(); 
        const touch = e.touches[0];
        this.updateGhostPosition(touch);

        const target = document.elementFromPoint(touch.clientX, touch.clientY);
        const zone = target ? target.closest('.drop-zone') : null;
        
        document.querySelectorAll('.drop-zone.drag-over').forEach(el => el.classList.remove('drag-over'));
        if (zone) zone.classList.add('drag-over');
    }


    handleTouchEnd(e) {
        document.removeEventListener('touchmove', this._touchMoveHandler);
        document.removeEventListener('touchend', this._touchEndHandler);

        if (this.ghostEl) {
            this.ghostEl.remove();
            this.ghostEl = null;
        }

        if (this.activeDragEl) {
            this.activeDragEl.classList.remove('opacity-50');
            this.activeDragEl = null;
        }

        const touch = e.changedTouches[0];
        const target = document.elementFromPoint(touch.clientX, touch.clientY);
        const zone = target ? target.closest('.drop-zone') : null;

        document.querySelectorAll('.drop-zone.drag-over').forEach(el => el.classList.remove('drag-over'));

        if (zone) {
            this.processCustomDrop(zone);
        }
    }


    updateGhostPosition(touch) {
        if (this.ghostEl) {
            this.ghostEl.style.left = `${touch.clientX - (this.ghostEl.offsetWidth / 2)}px`;
            this.ghostEl.style.top = `${touch.clientY - (this.ghostEl.offsetHeight / 2)}px`;
        }
    }


    processCustomDrop(zone) {
        const newCity = zone.dataset.city;
        const newDate = zone.dataset.date;
        
        if (!this.draggedMatch) return;

        const tempSchedule = JSON.parse(JSON.stringify(this.app.scheduleData));
        const selfIndex = tempSchedule.findIndex(m => m.id === this.draggedMatch.id);
        const otherMatchIndex = tempSchedule.findIndex(m => m.city === newCity && m.date === newDate && m.id !== this.draggedMatch.id);

        if (selfIndex === -1) return;

        if (otherMatchIndex !== -1) {
            tempSchedule[otherMatchIndex].city = this.draggedMatch.city;
            tempSchedule[otherMatchIndex].date = this.draggedMatch.date;
        }

        tempSchedule[selfIndex].city = newCity;
        tempSchedule[selfIndex].date = newDate;

        this.app.scheduleData = tempSchedule;
        this.app.customData = JSON.parse(JSON.stringify(this.app.scheduleData));
        this.app.currentMode = 'custom';
        this.app.ui.updateUI();
    }
}