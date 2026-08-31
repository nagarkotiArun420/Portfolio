/**
 * Simple Personal Portfolio - Vanilla JavaScript
 * John Smith — Senior Real Estate Consultant
 * Performance & Smoothness Optimized
 */

document.addEventListener('DOMContentLoaded', () => {
    // Cache DOM Elements for O(1) Access
    const mobileToggle = document.getElementById('mobileToggle');
    const navMenu = document.getElementById('navMenu');
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('section[id]');
    const revealElements = document.querySelectorAll('.reveal');

    // Map section IDs to their corresponding navigation link elements
    const navLinkMap = new Map();
    navLinks.forEach(link => {
        const href = link.getAttribute('href');
        if (href && href.startsWith('#')) {
            navLinkMap.set(href.substring(1), link);
        }
    });

    // --- Mobile Menu Toggle ---
    if (mobileToggle && navMenu) {
        mobileToggle.addEventListener('click', () => {
            const isOpen = navMenu.classList.contains('active');
            if (isOpen) {
                closeMobileMenu();
            } else {
                openMobileMenu();
            }
        });

        // Close mobile menu when clicking any navigation link
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                closeMobileMenu();
            });
        });

        // Auto-close menu on desktop resize
        window.addEventListener('resize', () => {
            if (window.innerWidth > 768 && navMenu.classList.contains('active')) {
                closeMobileMenu();
            }
        }, { passive: true });
    }

    function openMobileMenu() {
        navMenu.classList.add('active');
        mobileToggle.classList.add('active');
        mobileToggle.setAttribute('aria-expanded', 'true');
    }

    function closeMobileMenu() {
        navMenu.classList.remove('active');
        mobileToggle.classList.remove('active');
        mobileToggle.setAttribute('aria-expanded', 'false');
    }

    // --- Active Link Highlight via IntersectionObserver ---
    if ('IntersectionObserver' in window && sections.length > 0) {
        let activeSectionId = null;

        const navObserverOptions = {
            root: null,
            rootMargin: '-30% 0px -50% 0px',
            threshold: 0
        };

        const navObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const id = entry.target.getAttribute('id');
                    if (id && id !== activeSectionId) {
                        activeSectionId = id;
                        navLinks.forEach(link => link.classList.remove('active'));
                        const currentLink = navLinkMap.get(id);
                        if (currentLink) {
                            currentLink.classList.add('active');
                        }
                    }
                }
            });
        }, navObserverOptions);

        sections.forEach(section => navObserver.observe(section));
    }

    // --- Smooth Scroll Reveal via IntersectionObserver ---
    if ('IntersectionObserver' in window && revealElements.length > 0) {
        const revealObserverOptions = {
            root: null,
            rootMargin: '0px 0px -40px 0px',
            threshold: 0.1
        };

        const revealObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const target = entry.target;
                    target.classList.add('revealed');
                    
                    // Cleanup will-change after transition completes to optimize GPU memory
                    target.addEventListener('transitionend', function removeWillChange() {
                        target.style.willChange = 'auto';
                        target.removeEventListener('transitionend', removeWillChange);
                    }, { once: true });

                    observer.unobserve(target);
                }
            });
        }, revealObserverOptions);

        revealElements.forEach(el => revealObserver.observe(el));
    } else {
        // Fallback for browsers without IntersectionObserver support
        revealElements.forEach(el => el.classList.add('revealed'));
    }
});
