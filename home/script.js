/**
 * HOME PAGE
 * Carrossel, menu mobile e pequenos ajustes dinâmicos.
 */

document.addEventListener('DOMContentLoaded', () => {
    initCarousel();
    initMobileMenu();
    updateFooterYear();
});

function initCarousel() {
    const carousel = document.querySelector('.carousel');
    const slides = Array.from(document.querySelectorAll('.carousel-slide'));
    const indicators = Array.from(document.querySelectorAll('.indicator'));
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');

    if (!carousel || slides.length === 0) return;

    let currentSlide = 0;
    let autoplayId = null;

    const showSlide = (index) => {
        currentSlide = (index + slides.length) % slides.length;

        slides.forEach((slide, slideIndex) => {
            const isActive = slideIndex === currentSlide;
            slide.classList.toggle('active', isActive);
            slide.setAttribute('aria-hidden', String(!isActive));
        });

        indicators.forEach((indicator, indicatorIndex) => {
            const isActive = indicatorIndex === currentSlide;
            indicator.classList.toggle('active', isActive);
            indicator.setAttribute('aria-current', isActive ? 'true' : 'false');
        });
    };

    const stopAutoplay = () => {
        if (autoplayId !== null) {
            window.clearInterval(autoplayId);
            autoplayId = null;
        }
    };

    const startAutoplay = () => {
        stopAutoplay();
        autoplayId = window.setInterval(() => showSlide(currentSlide + 1), 5000);
    };

    const restartAutoplay = () => {
        showSlide(currentSlide);
        startAutoplay();
    };

    prevBtn?.addEventListener('click', () => {
        showSlide(currentSlide - 1);
        startAutoplay();
    });

    nextBtn?.addEventListener('click', () => {
        showSlide(currentSlide + 1);
        startAutoplay();
    });

    indicators.forEach((indicator, index) => {
        indicator.addEventListener('click', () => {
            showSlide(index);
            startAutoplay();
        });
    });

    carousel.addEventListener('mouseenter', stopAutoplay);
    carousel.addEventListener('mouseleave', startAutoplay);
    carousel.addEventListener('focusin', stopAutoplay);
    carousel.addEventListener('focusout', restartAutoplay);

    document.addEventListener('visibilitychange', () => {
        document.hidden ? stopAutoplay() : startAutoplay();
    });

    showSlide(0);
    startAutoplay();
}

function initMobileMenu() {
    const menuToggle = document.getElementById('menuToggle');
    const mobileMenu = document.getElementById('mobileMenu');
    const menuClose = document.getElementById('menuClose');
    const mobileLinks = document.querySelectorAll('.mobile-link');

    if (!menuToggle || !mobileMenu) return;

    const setMenuState = (isOpen) => {
        mobileMenu.classList.toggle('active', isOpen);
        mobileMenu.classList.toggle('open', isOpen);
        mobileMenu.setAttribute('aria-hidden', String(!isOpen));
        mobileMenu.toggleAttribute('inert', !isOpen);
        menuToggle.setAttribute('aria-expanded', String(isOpen));
        document.body.style.overflow = isOpen ? 'hidden' : '';
    };

    menuToggle.addEventListener('click', () => {
        const willOpen = !mobileMenu.classList.contains('active');
        setMenuState(willOpen);
    });

    menuClose?.addEventListener('click', () => setMenuState(false));
    mobileLinks.forEach((link) => link.addEventListener('click', () => setMenuState(false)));

    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape') setMenuState(false);
    });

    window.addEventListener('resize', () => {
        if (window.innerWidth > 768) setMenuState(false);
    });
}

function updateFooterYear() {
    const year = document.getElementById('currentYear');
    if (year) year.textContent = String(new Date().getFullYear());
}