document.addEventListener('DOMContentLoaded', () => {
    const mobileToggle = document.getElementById('mobileToggle');
    const navMenu = document.getElementById('navMenu');
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('section[id]');
    const revealElements = document.querySelectorAll('.reveal');

    // Map section IDs to navigation links
    const navLinkMap = new Map();
    navLinks.forEach(link => {
        const href = link.getAttribute('href');
        if (href && href.startsWith('#')) {
            navLinkMap.set(href.substring(1), link);
        }
    });

    // Mobile menu toggle
    if (mobileToggle && navMenu) {
        mobileToggle.addEventListener('click', () => {
            const isOpen = navMenu.classList.contains('active');
            if (isOpen) {
                closeMobileMenu();
            } else {
                openMobileMenu();
            }
        });

        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                closeMobileMenu();
            });
        });

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

    // Highlight active link on scroll
    if ('IntersectionObserver' in window && sections.length > 0) {
        let activeSectionId = null;

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
        }, {
            rootMargin: '-30% 0px -50% 0px',
            threshold: 0
        });

        sections.forEach(section => navObserver.observe(section));
    }

    // Scroll reveal animation
    if ('IntersectionObserver' in window && revealElements.length > 0) {
        const revealObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const target = entry.target;
                    target.classList.add('revealed');

                    target.addEventListener('transitionend', function removeWillChange() {
                        target.style.willChange = 'auto';
                        target.removeEventListener('transitionend', removeWillChange);
                    }, { once: true });

                    observer.unobserve(target);
                }
            });
        }, {
            rootMargin: '0px 0px -40px 0px',
            threshold: 0.1
        });

        revealElements.forEach(el => revealObserver.observe(el));
    } else {
        revealElements.forEach(el => el.classList.add('revealed'));
    }
});
