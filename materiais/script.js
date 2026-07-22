document.addEventListener('DOMContentLoaded', () => {
    initMobileMenu();
    initLucideIcons();
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

    if (!menuToggle || !mobileMenu) return;

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