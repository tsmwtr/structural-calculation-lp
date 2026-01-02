document.addEventListener('DOMContentLoaded', () => {

    /* =========================================
       Sticky CTA Toggle
       ========================================= */
    const stickyCta = document.getElementById('sticky-cta');
    const contactSection = document.getElementById('contact');

    // Observer logic: Hide sticky when Contact section is visible
    const observerOptions = {
        root: null,
        threshold: 0.1 // 10% visibility trigger
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // If contact is visible, HIDE sticky
                stickyCta.classList.add('is-hidden');
            } else {
                // If contact is NOT visible, check scroll position
                // Only show if we strictly scrolled past header/hero roughly
                if (window.scrollY > 600) {
                    stickyCta.classList.remove('is-hidden');
                } else {
                    stickyCta.classList.add('is-hidden');
                }
            }
        });
    }, observerOptions);

    if (contactSection) {
        observer.observe(contactSection);
    }

    // Scroll listener for initial top visibility logic
    window.addEventListener('scroll', () => {
        if (!contactSection) return;

        const contactRect = contactSection.getBoundingClientRect();
        const contactVisible = (contactRect.top < window.innerHeight && contactRect.bottom >= 0);

        // Use 'is-hidden' class
        if (window.scrollY > 600 && !contactVisible) {
            stickyCta.classList.remove('is-hidden');
        } else {
            stickyCta.classList.add('is-hidden');
        }
    }, { passive: true });

    /* =========================================
       FAQ Accordion
       ========================================= */
    const accordionHeaders = document.querySelectorAll('.accordion-header');

    accordionHeaders.forEach(header => {
        header.addEventListener('click', () => {
            const contentId = header.getAttribute('aria-controls');
            const content = document.getElementById(contentId);
            const isExpanded = header.getAttribute('aria-expanded') === 'true';

            // Toggle accessibility state
            header.setAttribute('aria-expanded', !isExpanded);
            // content.hidden = isExpanded; // Removed for CSS animation

            // Optional: Close others for cleaner UI?
            // keeping multiple open allowed as per standard LP behavior often
        });
    });

    /* =========================================
       Smooth Scroll (Respects Reduced Motion)
       ========================================= */
    const links = document.querySelectorAll('a[href^="#"]');
    const header = document.querySelector('.site-header');

    // Check user preference
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    links.forEach(link => {
        link.addEventListener('click', (e) => {
            const targetId = link.getAttribute('href');
            if (targetId === '#' || !targetId) return;

            const targetElement = document.querySelector(targetId);
            if (!targetElement) return;

            e.preventDefault();

            const headerHeight = header ? header.offsetHeight : 0;
            const elementPosition = targetElement.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - headerHeight - 20;

            if (prefersReducedMotion) {
                window.scrollTo(0, offsetPosition);
            } else {
                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });

    }); // End links.forEach

    /* =========================================
       Scroll Fade Animation
       ========================================= */
    const fadeElements = document.querySelectorAll('.fade-up');
    const fadeObserverOptions = {
        root: null,
        threshold: 0.1, // Trigger when 10% visible
        rootMargin: "0px 0px -50px 0px" // Trigger slightly before full view
    };

    const fadeObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-in-view');
                observer.unobserve(entry.target); // Run once to keep visible
            }
        });
    }, fadeObserverOptions);

    fadeElements.forEach(el => fadeObserver.observe(el));

}); // End DOMContentLoaded
