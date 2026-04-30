/* ================================================================
   CODENEXA — SITE INTERACTIONS
   ================================================================ */

(function () {
    'use strict';

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // ----------------------------------------------------------------
    // 1. NAVBAR: sticky blur on scroll + mobile menu toggle
    // ----------------------------------------------------------------
    const navbar = document.getElementById('navbar');
    const navToggle = document.getElementById('navToggle');
    const navMenu = document.getElementById('navMenu');

    // Add blur/shrink to navbar when user scrolls
    function handleScroll() {
        if (window.scrollY > 40) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    }

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // run once on load

    // Mobile menu toggle
    if (navToggle && navMenu) {
        navToggle.addEventListener('click', () => {
            const isOpen = navMenu.classList.toggle('open');
            navToggle.classList.toggle('active', isOpen);
            navToggle.setAttribute('aria-expanded', String(isOpen));
        });

        // Close menu on link click (mobile)
        navMenu.querySelectorAll('a').forEach((link) => {
            link.addEventListener('click', () => {
                navMenu.classList.remove('open');
                navToggle.classList.remove('active');
                navToggle.setAttribute('aria-expanded', 'false');
            });
        });
    }


    // ----------------------------------------------------------------
    // 2. PRICING TABS: switch between Web / Social / Brand
    // ----------------------------------------------------------------
    const tabs = document.querySelectorAll('.tab');
    const panels = document.querySelectorAll('.tab-panel');

    tabs.forEach((tab) => {
        tab.addEventListener('click', () => {
            const target = tab.dataset.tab;

            // Deactivate all
            tabs.forEach((t) => {
                t.classList.remove('is-active');
                t.setAttribute('aria-selected', 'false');
            });
            panels.forEach((p) => p.classList.remove('is-active'));

            // Activate selected
            tab.classList.add('is-active');
            tab.setAttribute('aria-selected', 'true');

            const panel = document.querySelector(`[data-panel="${target}"]`);
            if (panel) {
                panel.classList.add('is-active');

                // Re-trigger reveal animation on cards in the newly visible panel
                panel.querySelectorAll('.reveal').forEach((el) => {
                    el.classList.remove('in');
                    window.setTimeout(() => el.classList.add('in'), 20);
                });
            }
        });
    });


    // ----------------------------------------------------------------
    // 3. SCROLL REVEAL: fade-up elements as they enter viewport
    // ----------------------------------------------------------------
    const revealEls = document.querySelectorAll('.reveal');

    if (prefersReducedMotion) {
        revealEls.forEach((el) => el.classList.add('in'));
    } else if ('IntersectionObserver' in window) {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('in');
                        observer.unobserve(entry.target);
                    }
                });
            },
            { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
        );

        revealEls.forEach((el) => observer.observe(el));
    } else {
        // Fallback: show all immediately
        revealEls.forEach((el) => el.classList.add('in'));
    }


    // ----------------------------------------------------------------
    // 4. SMOOTH ANCHOR SCROLL (polished offset)
    // ----------------------------------------------------------------
    document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
        anchor.addEventListener('click', (e) => {
            const href = anchor.getAttribute('href');
            if (href === '#' || href.length < 2) return;

            const target = document.querySelector(href);
            if (target) {
                e.preventDefault();
                const top = target.getBoundingClientRect().top + window.scrollY - 72;
                window.scrollTo({ top, behavior: prefersReducedMotion ? 'auto' : 'smooth' });
            }
        });
    });


    // ----------------------------------------------------------------
    // 5. SUBTLE PARALLAX ON HERO VISUAL (desktop only)
    // ----------------------------------------------------------------
    const heroVisual = document.querySelector('.hero-visual');

    if (heroVisual && window.matchMedia('(min-width: 1024px)').matches && !prefersReducedMotion) {
        let rafId = null;
        let pointerX = 0;
        let pointerY = 0;

        document.addEventListener('mousemove', (e) => {
            pointerX = e.clientX;
            pointerY = e.clientY;

            if (rafId !== null) return;

            rafId = window.requestAnimationFrame(() => {
                const x = (pointerX / window.innerWidth - 0.5) * 10;
                const y = (pointerY / window.innerHeight - 0.5) * 10;
                heroVisual.style.transform = `translate(${x}px, ${y}px)`;
                rafId = null;
            });
        }, { passive: true });
    }

})();
