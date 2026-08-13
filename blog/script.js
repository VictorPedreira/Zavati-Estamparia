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