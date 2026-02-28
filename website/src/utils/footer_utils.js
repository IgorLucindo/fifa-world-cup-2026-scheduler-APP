export function toggleMobileInfo() {
    const footerSlider = document.getElementById('mobile-footer-slider');
    const overlay = document.getElementById('mobile-overlay');
    const chevronContainer = document.getElementById('chevron-container');

    if (!footerSlider || !overlay || window.innerWidth >= 640) return;
    
    const isShowing = !footerSlider.classList.contains('translate-y-[calc(100%-3.5rem)]');
    
    if (isShowing) {
        // SLIDE DOWN (Collapse)
        footerSlider.classList.add('translate-y-[calc(100%-3.5rem)]');
        footerSlider.classList.remove('translate-y-0');
        
        // POINT UP: Remove rotation from the container
        if (chevronContainer) {
            chevronContainer.classList.remove('rotate-180');
        }
        
        overlay.classList.add('opacity-0');
        setTimeout(() => overlay.classList.add('hidden'), 300);
        document.body.style.overflow = ''; 
    } else {
        // SLIDE UP (Expand)
        overlay.classList.remove('hidden');
        document.body.style.overflow = 'hidden'; 
        
        requestAnimationFrame(() => {
            overlay.classList.remove('opacity-0');
            footerSlider.classList.remove('translate-y-[calc(100%-3.5rem)]');
            footerSlider.classList.add('translate-y-0');
            
            // POINT DOWN: Add rotation to the container
            if (chevronContainer) {
                chevronContainer.classList.add('rotate-180');
            }
        });
    }
}