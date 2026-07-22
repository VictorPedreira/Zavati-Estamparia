document.addEventListener('DOMContentLoaded', () => {
    initLucideIcons();
    initMobileMenu();
    updateFooterYear();
});

function initLucideIcons() {
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }
}

function initMobileMenu() {
    const menuToggle = document.getElementById('menuToggle');
    const mobileMenu = document.getElementById('mobileMenu');
    const menuClose = document.getElementById('menuClose');
    const mobileLinks = document.querySelectorAll('.mobile-link');

    if (!menuToggle || !mobileMenu) {
        return;
    }

    function setMenuState(isOpen) {
        mobileMenu.classList.toggle('active', isOpen);
        mobileMenu.classList.toggle('open', isOpen);

        mobileMenu.setAttribute(
            'aria-hidden',
            String(!isOpen)
        );

        menuToggle.setAttribute(
            'aria-expanded',
            String(isOpen)
        );

        document.body.style.overflow = isOpen
            ? 'hidden'
            : '';

        const bars = menuToggle.querySelectorAll('span');

        if (bars.length >= 3) {
            bars[0].style.transform = isOpen
                ? 'rotate(45deg) translate(7px, 7px)'
                : '';

            bars[1].style.opacity = isOpen
                ? '0'
                : '1';

            bars[2].style.transform = isOpen
                ? 'rotate(-45deg) translate(7px, -7px)'
                : '';
        }
    }

    menuToggle.addEventListener('click', () => {
        const isOpen =
            mobileMenu.classList.contains('active');

        setMenuState(!isOpen);
    });

    if (menuClose) {
        menuClose.addEventListener('click', () => {
            setMenuState(false);
        });
    }

    mobileLinks.forEach((link) => {
        link.addEventListener('click', () => {
            setMenuState(false);
        });
    });

    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape') {
            setMenuState(false);
        }
    });

    window.addEventListener('resize', () => {
        if (window.innerWidth > 768) {
            setMenuState(false);
        }
    });
}

function updateFooterYear() {
    const yearElement =
        document.getElementById('currentYear');

    if (yearElement) {
        yearElement.textContent =
            String(new Date().getFullYear());
    }
}