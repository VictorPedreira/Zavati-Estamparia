/*
 * Instrumentação de qualidade de lead (B2B vs varejo).
 * Empilha eventos em window.dataLayer para consumo futuro por
 * Google Tag Manager / GA4 quando a propriedade for configurada.
 * Sem GTM/GA4 instalado, os eventos ficam apenas no dataLayer (inofensivo).
 */
(function () {
    window.dataLayer = window.dataLayer || [];

    function pushEvent(name, params) {
        window.dataLayer.push(Object.assign({ event: name }, params || {}));
    }

    window.zavatiTrack = pushEvent;

    document.addEventListener("DOMContentLoaded", function () {
        if (document.body.hasAttribute("data-corporate-page")) {
            pushEvent("view_corporate_page", {
                page_location: window.location.href,
            });
        }

        document.querySelectorAll("[data-track]").forEach(function (el) {
            el.addEventListener("click", function () {
                pushEvent(el.getAttribute("data-track"), {
                    page: el.getAttribute("data-track-page") || window.location.pathname,
                    source_medium: document.referrer || "direct",
                });
            });
        });
    });
})();
