/* Progressive enhancement: without JavaScript the first slide and direct
   screenshot links remain available. No timers or animated transitions. */
(() => {
    const carousel = document.querySelector('[data-carousel]');
    if (!carousel) return;

    const slides = Array.from(carousel.querySelectorAll('.carousel-slide'));
    const controls = carousel.querySelector('.carousel-controls');
    const position = carousel.querySelector('.carousel-position');
    const pagination = carousel.querySelector('.carousel-pagination');
    const indicators = Array.from(pagination.querySelectorAll('[data-slide]'));
    const captionTitle = carousel.querySelector('[data-caption-title]');
    const captionText = carousel.querySelector('[data-caption-text]');
    let current = 0;

    function show(index) {
        current = (index + slides.length) % slides.length;
        slides.forEach((slide, slideIndex) => {
            slide.hidden = slideIndex !== current;
            indicators[slideIndex].setAttribute('aria-pressed', String(slideIndex === current));
        });
        captionTitle.textContent = slides[current].dataset.title;
        captionText.textContent = slides[current].dataset.caption;
        position.textContent = `${current + 1} / ${slides.length} · ${slides[current].dataset.title}`;
    }

    slides.forEach((slide, index) => {
        slide.setAttribute('role', 'group');
        slide.setAttribute('aria-roledescription', 'slide');
        slide.setAttribute('aria-label', `${index + 1} of ${slides.length}`);
    });
    carousel.tabIndex = 0;
    carousel.querySelector('.carousel-help').id = 'carousel-help';
    carousel.setAttribute('aria-describedby', 'carousel-help');
    controls.hidden = false;
    pagination.hidden = false;
    carousel.querySelector('.carousel-help').hidden = false;
    controls.querySelector('[data-previous]').addEventListener('click', () => show(current - 1));
    controls.querySelector('[data-next]').addEventListener('click', () => show(current + 1));
    indicators.forEach((indicator) => {
        indicator.addEventListener('click', () => show(Number(indicator.dataset.slide)));
    });

    // Scope shortcuts to this region so page scrolling and other controls keep
    // their normal keyboard behavior. Native buttons also support Enter/Space.
    carousel.addEventListener('keydown', (event) => {
        if (event.altKey || event.ctrlKey || event.metaKey || event.shiftKey) return;
        const destinations = {
            ArrowLeft: current - 1,
            ArrowRight: current + 1,
            Home: 0,
            End: slides.length - 1,
        };
        if (!(event.key in destinations)) return;
        event.preventDefault();
        show(destinations[event.key]);
    });
})();
