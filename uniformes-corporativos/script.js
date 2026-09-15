document.addEventListener("DOMContentLoaded", function () {
    initMobileMenu();
    initScrollReveal();
});

function initScrollReveal() {
    var items = document.querySelectorAll(".reveal");
    if (!items.length) return;

    if (!("IntersectionObserver" in window)) {
        items.forEach(function (el) {
            el.classList.add("is-visible");
        });
        return;
    }

    var observer = new IntersectionObserver(
        function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    entry.target.classList.add("is-visible");
                    observer.unobserve(entry.target);
                }
            });
        },
        { threshold: 0.15, rootMargin: "0px 0px -40px 0px" }
    );

    items.forEach(function (el) {
        observer.observe(el);
    });
}

function initMobileMenu() {
    var menuToggle = document.getElementById("menuToggle");
    var mobileMenu = document.getElementById("mobileMenu");
    var menuClose = document.getElementById("menuClose");
    var mobileLinks = document.querySelectorAll(".mobile-link");

    if (!menuToggle || !mobileMenu) return;

    function setMenuState(isOpen) {
        mobileMenu.classList.toggle("active", isOpen);
        mobileMenu.setAttribute("aria-hidden", String(!isOpen));
        menuToggle.setAttribute("aria-expanded", String(isOpen));
        document.body.style.overflow = isOpen ? "hidden" : "";
    }

    menuToggle.addEventListener("click", function () {
        setMenuState(!mobileMenu.classList.contains("active"));
    });

    if (menuClose) {
        menuClose.addEventListener("click", function () {
            setMenuState(false);
        });
    }

    mobileLinks.forEach(function (link) {
        link.addEventListener("click", function () {
            setMenuState(false);
        });
    });

    document.addEventListener("keydown", function (event) {
        if (event.key === "Escape") setMenuState(false);
    });

    window.addEventListener("resize", function () {
        if (window.innerWidth > 768) setMenuState(false);
    });
}

(function () {
    var form = document.getElementById("corporateQuoteForm");
    if (!form) return;

    var WHATSAPP_NUMBER = "551145518884";
    var EMAIL_TO = "zavatiestamparia@gmail.com";
    var startTracked = false;

    function track(name, params) {
        if (typeof window.zavatiTrack === "function") {
            window.zavatiTrack(name, params);
        }
    }

    form.addEventListener(
        "focusin",
        function () {
            if (startTracked) return;
            startTracked = true;
            track("start_quote", { page: "uniformes-corporativos" });
        },
        { once: true }
    );

    function fieldValue(name) {
        var field = form.elements[name];
        return field && field.value ? field.value.trim() : "";
    }

    function buildMessage() {
        var lines = [
            "Olá Zavati! Gostaria de solicitar uma cotação corporativa.",
            "",
            "Empresa: " + (fieldValue("empresa") || "-"),
            "Contato: " + (fieldValue("contato") || "-"),
            "E-mail: " + (fieldValue("email") || "-"),
            "Telefone/WhatsApp: " + (fieldValue("telefone") || "-"),
            "Cidade: " + (fieldValue("cidade") || "-"),
        ];

        if (fieldValue("cnpj")) lines.push("CNPJ: " + fieldValue("cnpj"));

        lines.push("Quantidade estimada: " + (fieldValue("quantidade") || "-"));
        lines.push("Tipo de peça: " + (fieldValue("peca") || "-"));

        if (fieldValue("personalizacao")) lines.push("Personalização: " + fieldValue("personalizacao"));

        lines.push("Data necessária: " + (fieldValue("data") || "-"));
        lines.push("Compra recorrente: " + (fieldValue("recorrencia") || "-"));

        if (fieldValue("colaboradores")) lines.push("Nº de colaboradores/unidades: " + fieldValue("colaboradores"));
        if (fieldValue("observacoes")) lines.push("Observações: " + fieldValue("observacoes"));

        return lines.join("\n");
    }

    function quantityBand(raw) {
        var match = raw.match(/\d+/);
        if (!match) return "não informado";
        var n = parseInt(match[0], 10);
        if (n < 10) return "abaixo de 10";
        if (n < 50) return "10-49";
        if (n < 200) return "50-199";
        return "200+";
    }

    form.addEventListener("submit", function (event) {
        event.preventDefault();

        if (!form.reportValidity()) return;

        var submitter = event.submitter;
        var channel = submitter ? submitter.getAttribute("data-quote-channel") : "whatsapp";
        var message = buildMessage();

        track("submit_quote", {
            city: fieldValue("cidade"),
            quantity_band: quantityBand(fieldValue("quantidade")),
            recurring: fieldValue("recorrencia"),
            channel: channel,
        });

        if (channel === "email") {
            var subject = encodeURIComponent("Cotação corporativa - " + (fieldValue("empresa") || "Zavati"));
            var body = encodeURIComponent(message);
            window.location.href = "mailto:" + EMAIL_TO + "?subject=" + subject + "&body=" + body;
        } else {
            track("click_whatsapp_b2b", { page: "uniformes-corporativos" });
            var url = "https://wa.me/" + WHATSAPP_NUMBER + "?text=" + encodeURIComponent(message);
            window.open(url, "_blank", "noopener,noreferrer");
        }
    });
})();
