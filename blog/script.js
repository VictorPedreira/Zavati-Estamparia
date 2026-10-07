document.addEventListener('DOMContentLoaded', () => {
    const filterButtons =
        document.querySelectorAll(
            '.blog-filter'
        );

    const articleCards =
        document.querySelectorAll(
            '.blog-card'
        );

    const emptyMessage =
        document.getElementById(
            'blogEmptyMessage'
        );

    filterButtons.forEach(button => {
        button.addEventListener(
            'click',
            () => {
                const selectedCategory =
                    button.dataset.filter;

                filterButtons.forEach(
                    currentButton => {
                        const isSelected =
                            currentButton === button;

                        currentButton.classList.toggle(
                            'active',
                            isSelected
                        );

                        currentButton.setAttribute(
                            'aria-pressed',
                            String(isSelected)
                        );
                    }
                );

                let visibleArticles = 0;

                articleCards.forEach(card => {
                    const articleCategory =
                        card.dataset.category;

                    const shouldShow =
                        selectedCategory ===
                        'todos' ||
                        articleCategory ===
                        selectedCategory;

                    card.hidden = !shouldShow;

                    if (shouldShow) {
                        visibleArticles += 1;
                    }
                });

                if (emptyMessage) {
                    emptyMessage.hidden =
                        visibleArticles !== 0;
                }
            }
        );
    });

    /*
     * Carrossel dos artigos em destaque.
     */
    const carousel =
        document.getElementById(
            'featuredCarousel'
        );

    if (carousel) {
        const track =
            carousel.querySelector(
                '.blog-carousel-track'
            );

        const slides =
            carousel.querySelectorAll(
                '.blog-carousel-slide'
            );

        const prevButton =
            carousel.querySelector(
                '.blog-carousel-prev'
            );

        const nextButton =
            carousel.querySelector(
                '.blog-carousel-next'
            );

        const dotsContainer =
            carousel.querySelector(
                '.blog-carousel-dots'
            );

        let currentSlide = 0;

        const dots = Array.from(
            slides,
            (slide, index) => {
                const dot =
                    document.createElement(
                        'button'
                    );

                dot.type = 'button';
                dot.className =
                    'blog-carousel-dot';

                dot.setAttribute(
                    'aria-label',
                    `Ver artigo ${index + 1} de ${slides.length}`
                );

                dot.addEventListener(
                    'click',
                    () => goToSlide(index)
                );

                dotsContainer.appendChild(dot);

                return dot;
            }
        );

        function goToSlide(index) {
            currentSlide =
                (index + slides.length) %
                slides.length;

            track.style.transform =
                `translateX(-${currentSlide * 100}%)`;

            slides.forEach((slide, slideIndex) => {
                const isActive =
                    slideIndex === currentSlide;

                slide.inert = !isActive;

                slide.setAttribute(
                    'aria-hidden',
                    String(!isActive)
                );
            });

            dots.forEach((dot, dotIndex) => {
                dot.setAttribute(
                    'aria-current',
                    String(dotIndex === currentSlide)
                );
            });
        }

        prevButton?.addEventListener(
            'click',
            () => goToSlide(currentSlide - 1)
        );

        nextButton?.addEventListener(
            'click',
            () => goToSlide(currentSlide + 1)
        );

        carousel.addEventListener(
            'keydown',
            event => {
                if (event.key === 'ArrowLeft') {
                    goToSlide(currentSlide - 1);
                }

                if (event.key === 'ArrowRight') {
                    goToSlide(currentSlide + 1);
                }
            }
        );

        // Deslizar com o dedo no celular
        let touchStartX = null;

        carousel.addEventListener(
            'touchstart',
            event => {
                touchStartX =
                    event.touches[0].clientX;
            },
            { passive: true }
        );

        carousel.addEventListener(
            'touchend',
            event => {
                if (touchStartX === null) {
                    return;
                }

                const distance =
                    event.changedTouches[0].clientX -
                    touchStartX;

                touchStartX = null;

                if (Math.abs(distance) > 50) {
                    goToSlide(
                        distance < 0
                            ? currentSlide + 1
                            : currentSlide - 1
                    );
                }
            }
        );

        goToSlide(0);
    }

    /*
     * Newsletter demonstrativa.
     * Esta parte ainda não envia o e-mail
     * para um servidor.
     */
    const newsletterForm =
        document.getElementById(
            'blogNewsletterForm'
        );

    const newsletterSuccess =
        document.getElementById(
            'blogNewsletterSuccess'
        );

    newsletterForm?.addEventListener(
        'submit',
        event => {
            event.preventDefault();

            newsletterForm.hidden = true;

            if (newsletterSuccess) {
                newsletterSuccess.hidden = false;
            }
        }
    );
});