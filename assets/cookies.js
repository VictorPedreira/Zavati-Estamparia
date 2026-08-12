document.addEventListener('DOMContentLoaded', () => {
    const CONSENT_KEY =
        'zavati_cookie_consent_v1';

    const banner =
        document.getElementById('cookieBanner');

    const modal =
        document.getElementById('cookieModal');

    const analyticsOption =
        document.getElementById('analyticsCookies');

    const openButtons = [
        document.getElementById(
            'openCookiePolicy'
        ),

        document.getElementById(
            'openCookiePolicyFromBanner'
        )
    ].filter(Boolean);

    const closeButton =
        document.getElementById(
            'closeCookiePolicy'
        );

    const acceptButton =
        document.getElementById(
            'acceptCookies'
        );

    const rejectButton =
        document.getElementById(
            'rejectCookies'
        );

    const rejectModalButton =
        document.getElementById(
            'rejectCookiesFromModal'
        );

    const saveButton =
        document.getElementById(
            'saveCookiePreferences'
        );

    if (!banner || !modal) {
        return;
    }

    function getConsent() {
        try {
            const saved =
                localStorage.getItem(
                    CONSENT_KEY
                );

            return saved
                ? JSON.parse(saved)
                : null;
        } catch (error) {
            return null;
        }
    }

    function applyConsent(consent) {
        /*
         * Quando o Google Analytics for
         * adicionado, ele deverá ser iniciado
         * aqui somente quando:
         *
         * consent.analytics === true
         */

        if (consent.analytics) {
            document.documentElement
                .dataset.analyticsConsent =
                'granted';
        } else {
            document.documentElement
                .dataset.analyticsConsent =
                'denied';
        }
    }

    function saveConsent(analytics) {
        const consent = {
            necessary: true,
            analytics: analytics,
            updatedAt:
                new Date().toISOString()
        };

        try {
            localStorage.setItem(
                CONSENT_KEY,
                JSON.stringify(consent)
            );
        } catch (error) {
            console.warn(
                'Não foi possível salvar as preferências.',
                error
            );
        }

        applyConsent(consent);

        banner.hidden = true;

        if (modal.open) {
            modal.close();
        }
    }

    function openPolicy() {
        const consent = getConsent();

        analyticsOption.checked =
            Boolean(consent?.analytics);

        modal.showModal();
    }

    openButtons.forEach(button => {
        button.addEventListener(
            'click',
            openPolicy
        );
    });

    closeButton?.addEventListener(
        'click',
        () => modal.close()
    );

    acceptButton?.addEventListener(
        'click',
        () => saveConsent(true)
    );

    rejectButton?.addEventListener(
        'click',
        () => saveConsent(false)
    );

    rejectModalButton?.addEventListener(
        'click',
        () => {
            analyticsOption.checked = false;
            saveConsent(false);
        }
    );

    saveButton?.addEventListener(
        'click',
        () => {
            saveConsent(
                analyticsOption.checked
            );
        }
    );

    modal.addEventListener(
        'click',
        event => {
            if (event.target === modal) {
                modal.close();
            }
        }
    );

    const savedConsent = getConsent();

    if (savedConsent) {
        applyConsent(savedConsent);
        banner.hidden = true;
    } else {
        banner.hidden = false;
    }
});