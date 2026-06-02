export class MatchHoverTimer {
    constructor(onComplete) {
        this.duration = 0.7; // seconds
        this.onComplete = onComplete;
        this.timeout = null;
        this.timerEl = null;
        this.completed = false;
    }

    attachToCard(matchEl, match) {
        if (!matchEl) return;
        this.timerEl = matchEl.querySelector('.match-timer');
        if (!this.timerEl) return;

        // Always snap to 0 first so a partially-filled or fully-filled bar
        // never carries over from a previous hover or spotlight close.
        this.timerEl.classList.remove('hidden');
        this.timerEl.style.transition = 'none';
        this.timerEl.style.height = '0%';
        void this.timerEl.getBoundingClientRect(); // force reflow

        this.timerEl.style.transition = `height ${this.duration}s linear, opacity 0.1s ease`;
        this.timerEl.style.height = '100%';

        this.timeout = setTimeout(() => {
            this.completed = true;
            this.onComplete(match, matchEl);
            if (this.timerEl) this.timerEl.classList.add('hidden');
        }, this.duration * 1000);
    }

    reset() {
        clearTimeout(this.timeout);
        if (this.timerEl) {
            this.timerEl.style.transition = 'none';
            this.timerEl.style.height = '0%';
        }
        this.completed = false;
        this.timerEl = null;
    }
}
