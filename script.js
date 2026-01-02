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

    // Helper to set height
    const setAccordionHeight = (item, isExpanded) => {
        const header = item.querySelector('.accordion-header');
        // Initial set/recalc
        if (isExpanded) {
            item.style.height = item.scrollHeight + 'px';
        } else {
            item.style.height = header.offsetHeight + 'px';
        }
    };

    // Initialize all items
    const accordionItems = document.querySelectorAll('.accordion-item');
    accordionItems.forEach(item => {
        const header = item.querySelector('.accordion-header');
        const isExpanded = header.getAttribute('aria-expanded') === 'true';
        setAccordionHeight(item, isExpanded);
    });

    // Toggle logic (Clicking anywhere on item toggles it)
    accordionItems.forEach(item => {
        item.addEventListener('click', (e) => {
            const header = item.querySelector('.accordion-header');
            const isExpanded = header.getAttribute('aria-expanded') === 'true';

            // Toggle state
            header.setAttribute('aria-expanded', !isExpanded);

            // Animate height
            setAccordionHeight(item, !isExpanded);
        });
    });

    // Resize handler to update heights
    let resizeTimer;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
            document.querySelectorAll('.accordion-item').forEach(item => {
                const header = item.querySelector('.accordion-header');
                const isExpanded = header.getAttribute('aria-expanded') === 'true';

                // Temporarily unlock height to get real scrollHeight if needed, 
                // but usually scrollHeight works if content didn't change.
                // Resetting to auto briefly might be safer if content flow changed.
                item.style.height = 'auto';
                const newHeight = isExpanded ? item.scrollHeight : header.offsetHeight;
                item.style.height = newHeight + 'px';
            });
        }, 100);
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

    /* =========================================
       File Size Validation (Max 20MB)
       ========================================= */
    const fileInput = document.getElementById('file');
    if (fileInput) {
        fileInput.addEventListener('change', function () {
            const file = this.files[0];
            const maxSize = 20 * 1024 * 1024; // 20MB
            if (file && file.size > maxSize) {
                alert('ファイルサイズが20MBを超えています。圧縮するか、分割して送信してください。');
                this.value = ''; // Clear input
            }
        });
    }

}); // End DOMContentLoaded
