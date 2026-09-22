const SHIRT_WIDTH_CM = 54;

document.addEventListener('DOMContentLoaded', () => {
    initMobileMenu();
    initMobileAccordion();
    initPersonalization();
});

function initMobileMenu() {
    const menuToggle = document.getElementById('menuToggle');
    const mobileMenu = document.getElementById('mobileMenu');
    const menuClose = document.getElementById('menuClose');
    const mobileLinks = document.querySelectorAll('.mobile-link');

    if (!menuToggle || !mobileMenu) return;

    function setMenuState(isOpen) {
        mobileMenu.classList.toggle('active', isOpen);
        mobileMenu.classList.toggle('open', isOpen);
        mobileMenu.setAttribute('aria-hidden', String(!isOpen));
        menuToggle.setAttribute('aria-expanded', String(isOpen));
        document.documentElement.classList.toggle('lock-scroll', isOpen);
        document.body.classList.toggle('lock-scroll', isOpen);
    }

    menuToggle.addEventListener('click', () => {
        setMenuState(!mobileMenu.classList.contains('active'));
    });

    menuClose?.addEventListener('click', () => setMenuState(false));
    mobileLinks.forEach(link => link.addEventListener('click', () => setMenuState(false)));
    document.addEventListener('keydown', event => {
        if (event.key === 'Escape') setMenuState(false);
    });
    window.addEventListener('resize', () => {
        if (window.innerWidth > 768) setMenuState(false);
    });
}

function initMobileAccordion() {
    const steps = Array.from(
        document.querySelectorAll('.control-step')
    );

    if (!steps.length) {
        return;
    }

    function openStep(selectedStep) {
        steps.forEach(step => {
            const isOpen = step === selectedStep;

            const title =
                step.querySelector('.step-title');

            step.classList.toggle(
                'accordion-open',
                isOpen
            );

            if (title) {
                title.setAttribute(
                    'aria-expanded',
                    String(isOpen)
                );
            }
        });
    }

    steps.forEach((step, index) => {
        const title =
            step.querySelector('.step-title');

        if (!title) {
            return;
        }

        title.setAttribute('role', 'button');
        title.setAttribute('tabindex', '0');

        title.setAttribute(
            'aria-expanded',
            String(index === 0)
        );

        step.classList.toggle(
            'accordion-open',
            index === 0
        );

        function toggleStep() {
            /*
             * O menu retrátil funciona somente
             * em telas de até 768px.
             */
            if (window.innerWidth > 768) {
                return;
            }

            const isAlreadyOpen =
                step.classList.contains(
                    'accordion-open'
                );

            if (isAlreadyOpen) {
                step.classList.remove(
                    'accordion-open'
                );

                title.setAttribute(
                    'aria-expanded',
                    'false'
                );
            } else {
                openStep(step);
            }
        }

        title.addEventListener(
            'click',
            toggleStep
        );

        title.addEventListener(
            'keydown',
            event => {
                if (
                    event.key === 'Enter' ||
                    event.key === ' '
                ) {
                    event.preventDefault();
                    toggleStep();
                }
            }
        );
    });
}

function initPersonalization() {
    const COLORS = [
        { nome: 'Preto', cor: '#222121' },
        { nome: 'Branco', cor: '#ffffff' },
        { nome: 'Azul-marinho', cor: '#111c3c' },
        { nome: 'Cinza', cor: '#9d9ea0' },
        { nome: 'Chumbo', cor: '#4b5563' },
        { nome: 'Marrom', cor: '#7c4a2d' },
        { nome: 'Vinho', cor: '#4d0b1f' },
        { nome: 'Rosa', cor: '#6b0a3b' },
        { nome: 'Amarelo', cor: '#facc15' },
        { nome: 'Roxo', cor: '#350785' },
        { nome: 'Verde-Lima', cor: '#5b910c' },
        { nome: 'Bege', cor: '#e8dac4' },
        { nome: 'Vermelho', cor: '#5c030c' },
        { nome: 'Ciano', cor: '#0d9fb9' },
        { nome: 'Laranja', cor: '#b9820d' },
        { nome: 'Verde', cor: '#087c69' }
    ];

    const shirtModel = document.getElementById('shirtModel');
    const shirtImage = document.getElementById('shirtImage');
    const colorGrid = document.querySelector('.color-grid');
    const logoUpload = document.getElementById('logoUpload');
    const logoDropzone = document.getElementById('logoDropzone');
    const previewLogo = document.getElementById('previewLogo');
    const previewArea = document.querySelector('.shirt-preview');
    const logoSize = document.getElementById('logoSize');
    const sizeValue = document.getElementById('sizeValue');
    const summarySize = document.getElementById('summarySize');
    const decreaseSize = document.getElementById('decreaseSize');
    const increaseSize = document.getElementById('increaseSize');
    const positionButtons = document.querySelectorAll('.position-btn');
    const viewButtons = document.querySelectorAll('.view-btn');
    const resetButton = document.getElementById('resetBtn');
    const modelInfo = document.getElementById('modelInfo');
    const colorInfo = document.getElementById('colorInfo');
    const colorSample = document.getElementById('colorSample');
    const logoInfo = document.getElementById('logoInfo');
    const quoteButton = document.getElementById('quoteBtn');

    if (!shirtModel || !shirtImage || typeof SHIRT_MODELS === 'undefined') return;

    let currentModel = SHIRT_MODELS[0].id;
    let currentView = 'front';
    let currentColor = COLORS[0];
    let currentLogoSizeCm = 20;
    let currentPosition = 'center';
    let logoWasDragged = false;
    let activePointerId = null;
    let dragOffsetX = 0;
    let dragOffsetY = 0;

    /*
    * Frente e costas guardam a própria arte, tamanho e posição.
    * Ao trocar de lado, o estado atual é salvo aqui e o do
    * lado de destino é restaurado (ou limpo, se estiver vazio).
    */
    let viewState = { front: null, back: null };

    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d', { willReadFrequently: true });

    initializeShirtModels();
    shirtModel.value = currentModel;
    buildColorOptions();
    updateSize(false);
    updateViewButtons();
    renderShirt();

    shirtModel.addEventListener('change', async () => {
        captureCurrentViewState();

        currentModel = shirtModel.value;

        /*
        * Sempre começa pela frente ao escolher
        * outro produto.
        */
        currentView = 'front';

        modelInfo.textContent =
            getShirtName(currentModel);

        updateViewButtons();

        /*
        * Primeiro renderiza a camiseta do novo lado, depois
        * restaura a arte — nessa ordem, a posição da arte é
        * calculada em cima do tamanho certo da camiseta.
        */
        await renderShirtAsync();
        await restoreViewState(currentView);
    });

    viewButtons.forEach(button => {
        button.addEventListener('click', async () => {
            const nextView = button.dataset.view;
            if (nextView === currentView) return;

            captureCurrentViewState();
            currentView = nextView;
            updateViewButtons();

            await renderShirtAsync();
            await restoreViewState(currentView);
        });
    });

    logoSize.addEventListener('input', () => updateSize(true));
    decreaseSize.addEventListener('click', () => changeSize(-0.5));
    increaseSize.addEventListener('click', () => changeSize(0.5));

    positionButtons.forEach(button => {
        button.addEventListener('click', () => {
            positionButtons.forEach(item => item.classList.remove('active'));
            button.classList.add('active');
            currentPosition = button.dataset.position;
            logoWasDragged = false;
            updateLogoPosition();
        });
    });

    logoUpload.addEventListener('change', event => {
        const file = event.target.files?.[0];
        if (file) loadLogo(file);
    });

    ['dragenter', 'dragover'].forEach(eventName => {
        logoDropzone.addEventListener(eventName, event => {
            event.preventDefault();
            logoDropzone.classList.add('dragging');
        });
    });

    ['dragleave', 'drop'].forEach(eventName => {
        logoDropzone.addEventListener(eventName, event => {
            event.preventDefault();
            logoDropzone.classList.remove('dragging');
        });
    });

    logoDropzone.addEventListener('drop', event => {
        const file = event.dataTransfer?.files?.[0];
        if (file) loadLogo(file);
    });

    previewLogo.addEventListener(
        'pointerdown',
        startDraggingLogo
    );

    document.addEventListener(
        'pointermove',
        dragLogo
    );

    document.addEventListener(
        'pointerup',
        stopDraggingLogo
    );

    document.addEventListener(
        'pointercancel',
        stopDraggingLogo
    );

    document.addEventListener(
        'touchmove',
        event => {
            if (activePointerId !== null) {
                event.preventDefault();
            }
        },
        { passive: false }
    );

    resetButton.addEventListener('click', () => {
        currentModel = SHIRT_MODELS[0].id;
        currentView = 'front';
        currentColor = COLORS[0];
        viewState = { front: null, back: null };
        currentLogoSizeCm = 20;
        currentPosition = 'center';
        logoWasDragged = false;
        shirtModel.value = currentModel;
        logoUpload.value = '';
        previewLogo.src = '';
        previewLogo.hidden = true;
        logoInfo.textContent = 'Nenhuma arte enviada';
        positionButtons.forEach(button => {
            button.classList.toggle('active', button.dataset.position === 'center');
        });
        buildColorOptions();
        updateSize(false);
        updateViewButtons();
        renderShirt();
    });

    window.addEventListener('resize', () => {
        applyLogoSize();

        if (!logoWasDragged) {
            updateLogoPosition();
        }
    });

    function buildColorOptions() {
        colorGrid.innerHTML = '';

        COLORS.forEach(color => {
            const button = document.createElement('button');
            button.type = 'button';
            button.className = 'color-option';
            button.classList.toggle('active', color.nome === currentColor.nome);
            button.style.backgroundColor = color.cor;
            button.title = color.nome;
            button.setAttribute('aria-label', color.nome);
            button.setAttribute('aria-pressed', String(color.nome === currentColor.nome));

            button.addEventListener('click', () => {
                currentColor = color;
                colorInfo.textContent = color.nome;
                colorSample.style.backgroundColor = color.cor;
                colorGrid.querySelectorAll('.color-option').forEach(option => {
                    const active = option === button;
                    option.classList.toggle('active', active);
                    option.setAttribute('aria-pressed', String(active));
                });
                renderShirt();
            });

            colorGrid.appendChild(button);
        });

        colorInfo.textContent = currentColor.nome;
        colorSample.style.backgroundColor = currentColor.cor;
    }

function renderShirt(onReady) {
    const modelScales = {
        'moletom-capuz': {
            front: 1.35,
            back: 1
        },

        'moletom-sem-capuz': {
            front: 1.20,
            back: 1.10
        },

        'polo': {
            front: 0.90,
            back: 0.90
        }
    };

    const modelScale =
        modelScales[currentModel]?.[currentView] ?? 1;

    shirtImage.style.setProperty(
        '--model-scale',
        modelScale
    );

    const source = new Image();

    source.onload = () => {
        canvas.width = source.naturalWidth;
        canvas.height = source.naturalHeight;

        context.clearRect(
            0,
            0,
            canvas.width,
            canvas.height
        );

        context.drawImage(
            source,
            0,
            0
        );

        if (
            currentColor.cor.toLowerCase() !== '#ffffff'
        ) {
            const imageData =
                context.getImageData(
                    0,
                    0,
                    canvas.width,
                    canvas.height
                );

            const pixels = imageData.data;
            const rgb = hexToRgb(currentColor.cor);

            for (
                let index = 0;
                index < pixels.length;
                index += 4
            ) {
                if (pixels[index + 3] < 20) {
                    continue;
                }

                const luminance =
                    (
                        pixels[index] * 0.299 +
                        pixels[index + 1] * 0.587 +
                        pixels[index + 2] * 0.114
                    ) / 255;

                const light =
                    0.36 + luminance * 0.78;

                pixels[index] =
                    Math.min(255, rgb.r * light);

                pixels[index + 1] =
                    Math.min(255, rgb.g * light);

                pixels[index + 2] =
                    Math.min(255, rgb.b * light);
            }

            context.putImageData(
                imageData,
                0,
                0
            );
        }

        shirtImage.onload = () => {
            requestAnimationFrame(() => {
                applyLogoSize();

                if (!logoWasDragged) {
                    updateLogoPosition();
                }

                if (typeof onReady === 'function') onReady();
            });
        };

        shirtImage.src =
            canvas.toDataURL('image/webp');

        modelInfo.textContent =
            getShirtName(currentModel);
    };

    source.onerror = () => {
        shirtImage.alt =
            'Não foi possível carregar a imagem deste modelo';
    };

    source.src = getShirtImage(
        currentModel,
        currentView
    );
}

    function loadLogo(file) {
        if (!file.type.startsWith('image/')) {
            alert('Escolha um arquivo de imagem válido.');
            return;
        }

        if (file.size > 5 * 1024 * 1024) {
            alert('A imagem deve ter no máximo 5 MB.');
            return;
        }

        const reader = new FileReader();
        reader.onload = event => {
            previewLogo.onload = () => {
                previewLogo.hidden = false;
                logoWasDragged = false;
                applyLogoSize();
                updateLogoPosition();
            };
            previewLogo.src = event.target.result;
            logoInfo.textContent = file.name;
        };
        reader.readAsDataURL(file);
    }

    function changeSize(amount) {
        const nextValue = Math.min(
            Number(logoSize.max),
            Math.max(Number(logoSize.min), Number(logoSize.value) + amount)
        );
        logoSize.value = String(nextValue);
        updateSize(true);
    }

    function updateSize(reposition) {
        currentLogoSizeCm = Number(logoSize.value);
        const formatted = formatCm(currentLogoSizeCm);
        sizeValue.textContent = formatted;
        summarySize.textContent = formatted;
        applyLogoSize();
        if (reposition && !logoWasDragged) updateLogoPosition();
    }

    function applyLogoSize() {
        if (
            previewLogo.hidden ||
            !shirtImage.clientWidth
        ) {
            return;
        }

        const visibleShirtWidth =
            shirtImage.clientWidth * 0.75;

        const pixelsPerCm =
            visibleShirtWidth / SHIRT_WIDTH_CM;

        previewLogo.style.width =
            `${currentLogoSizeCm * pixelsPerCm}px`;

        previewLogo.style.height = 'auto';
    }

    function updateLogoPosition() {
        if (
            previewLogo.hidden ||
            !previewLogo.offsetWidth
        ) {
            return;
        }

        const areaRect =
            previewArea.getBoundingClientRect();

        const shirtRect =
            shirtImage.getBoundingClientRect();

        const logoWidth =
            previewLogo.offsetWidth;

        const logoHeight =
            previewLogo.offsetHeight;

        const visibleShirtWidth =
            shirtRect.width * 0.75;

        const visibleShirtLeft =
            shirtRect.left -
            areaRect.left +
            (shirtRect.width - visibleShirtWidth) / 2;

        const shirtTop =
            shirtRect.top - areaRect.top;

        const positions = {
            left:
                visibleShirtLeft +
                visibleShirtWidth * 0.12,

            center:
                visibleShirtLeft +
                (visibleShirtWidth - logoWidth) / 2,

            right:
                visibleShirtLeft +
                visibleShirtWidth * 0.88 -
                logoWidth
        };

        previewLogo.style.left =
            `${positions[currentPosition]}px`;

        previewLogo.style.top =
            `${shirtTop + shirtRect.height * 0.31 - logoHeight / 2}px`;
    }

    function startDraggingLogo(event) {
        if (previewLogo.hidden) {
            return;
        }

        event.preventDefault();

        activePointerId = event.pointerId;

        const logoRect =
            previewLogo.getBoundingClientRect();

        dragOffsetX =
            event.clientX - logoRect.left;

        dragOffsetY =
            event.clientY - logoRect.top;

        logoWasDragged = true;

        document.documentElement.classList.add('dragging-art');
        document.body.classList.add('dragging-art');

        positionButtons.forEach(button => {
            button.classList.remove('active');
        });
    }

    function dragLogo(event) {
        if (activePointerId !== event.pointerId) {
            return;
        }

        event.preventDefault();

        const areaRect =
            previewArea.getBoundingClientRect();

        const maxX =
            previewArea.clientWidth -
            previewLogo.offsetWidth;

        const maxY =
            previewArea.clientHeight -
            previewLogo.offsetHeight;

        const x = Math.min(
            maxX,
            Math.max(
                0,
                event.clientX -
                areaRect.left -
                dragOffsetX
            )
        );

        const y = Math.min(
            maxY,
            Math.max(
                0,
                event.clientY -
                areaRect.top -
                dragOffsetY
            )
        );

        previewLogo.style.left = `${x}px`;
        previewLogo.style.top = `${y}px`;
    }

    function stopDraggingLogo(event) {
        if (activePointerId !== event.pointerId) {
            return;
        }

        activePointerId = null;

        document.documentElement.classList.remove('dragging-art');
        document.body.classList.remove('dragging-art');
    }

    function captureCurrentViewState() {
        if (previewLogo.hidden || !previewLogo.src) {
            viewState[currentView] = null;
            return;
        }

        viewState[currentView] = {
            src: previewLogo.src,
            fileName: logoInfo.textContent,
            sizeCm: currentLogoSizeCm,
            position: currentPosition,
            dragged: logoWasDragged,
            leftPx: logoWasDragged ? parseFloat(previewLogo.style.left) : null,
            topPx: logoWasDragged ? parseFloat(previewLogo.style.top) : null
        };
    }

    function restoreViewState(view) {
        return new Promise(resolve => {
            const state = viewState[view];

            if (!state) {
                previewLogo.onload = null;
                previewLogo.src = '';
                previewLogo.hidden = true;
                previewLogo.style.left = '';
                previewLogo.style.top = '';
                logoInfo.textContent = 'Nenhuma arte enviada';

                currentLogoSizeCm = 20;
                currentPosition = 'center';
                logoWasDragged = false;

                logoSize.value = String(currentLogoSizeCm);
                sizeValue.textContent = formatCm(currentLogoSizeCm);
                summarySize.textContent = formatCm(currentLogoSizeCm);

                positionButtons.forEach(button => {
                    button.classList.toggle('active', button.dataset.position === 'center');
                });

                resolve();
                return;
            }

            currentLogoSizeCm = state.sizeCm;
            currentPosition = state.position;
            logoWasDragged = state.dragged;

            logoSize.value = String(currentLogoSizeCm);
            sizeValue.textContent = formatCm(currentLogoSizeCm);
            summarySize.textContent = formatCm(currentLogoSizeCm);

            positionButtons.forEach(button => {
                button.classList.toggle('active', button.dataset.position === currentPosition);
            });

            logoInfo.textContent = state.fileName;

            previewLogo.onload = () => {
                previewLogo.hidden = false;
                applyLogoSize();

                if (logoWasDragged && state.leftPx !== null) {
                    previewLogo.style.left = `${state.leftPx}px`;
                    previewLogo.style.top = `${state.topPx}px`;
                } else {
                    updateLogoPosition();
                }

                resolve();
            };

            previewLogo.src = state.src;
        });
    }

    function renderShirtAsync() {
        return new Promise(resolve => renderShirt(resolve));
    }

    /*
    * Desenha em um canvas separado exatamente o que está
    * na tela agora (camiseta colorida + arte, se houver),
    * usando a posição real dos elementos no DOM.
    */
    function compositeFromDOM() {
        return new Promise((resolve, reject) => {
            const shirtImg = new Image();

            shirtImg.onload = () => {
                const output = document.createElement('canvas');
                output.width = shirtImg.naturalWidth;
                output.height = shirtImg.naturalHeight;

                const outputContext = output.getContext('2d');
                outputContext.drawImage(shirtImg, 0, 0);

                const finish = () => output.toBlob(resolve, 'image/png');

                if (!previewLogo.hidden && previewLogo.src && shirtImage.clientWidth) {
                    const logoImg = new Image();

                    logoImg.onload = () => {
                        const scale = output.width / shirtImage.clientWidth;
                        const shirtRect = shirtImage.getBoundingClientRect();
                        const logoRect = previewLogo.getBoundingClientRect();

                        outputContext.drawImage(
                            logoImg,
                            (logoRect.left - shirtRect.left) * scale,
                            (logoRect.top - shirtRect.top) * scale,
                            logoRect.width * scale,
                            logoRect.height * scale
                        );

                        finish();
                    };

                    logoImg.onerror = finish;
                    logoImg.src = previewLogo.src;
                } else {
                    finish();
                }
            };

            shirtImg.onerror = () => reject(new Error('Não foi possível gerar a imagem da camiseta.'));
            shirtImg.src = shirtImage.src;
        });
    }

    /*
    * Gera a foto de uma das duas visualizações (frente/costas),
    * trocando de aba temporariamente se necessário e voltando
    * para a visualização em que o usuário estava.
    */
    async function captureView(view) {
        const previousView = currentView;
        const needsSwitch = view !== previousView;

        if (needsSwitch) {
            currentView = view;
            updateViewButtons();
            await renderShirtAsync();
            await restoreViewState(currentView);
        }

        const blob = await compositeFromDOM();

        if (needsSwitch) {
            currentView = previousView;
            updateViewButtons();
            await renderShirtAsync();
            await restoreViewState(currentView);
        }

        return blob;
    }

    function buildQuoteMessage() {
        const lines = [
            'Olá Zavati! Gostaria de solicitar um orçamento para personalização de camiseta.',
            '',
            `Modelo: ${getShirtName(currentModel)}`,
            `Cor: ${currentColor.nome}`
        ];

        if (viewState.front) lines.push(`Arte na frente: ${formatCm(viewState.front.sizeCm)}`);
        if (viewState.back) lines.push(`Arte nas costas: ${formatCm(viewState.back.sizeCm)}`);
        if (!viewState.front && !viewState.back) lines.push('Ainda não apliquei uma arte, gostaria de mais informações.');

        lines.push(
            '',
            'Baixei a imagem com a frente e as costas da camiseta personalizada — vou anexar aqui na conversa.'
        );

        return lines.join('\n');
    }

    function downloadBlob(blob, filename) {
        if (!blob) return;

        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        link.remove();

        setTimeout(() => URL.revokeObjectURL(url), 4000);
    }

    function blobToImage(blob) {
        return new Promise((resolve, reject) => {
            const url = URL.createObjectURL(blob);
            const img = new Image();
            img.onload = () => resolve({ img, url });
            img.onerror = reject;
            img.src = url;
        });
    }

    /*
    * Junta a foto da frente e das costas em uma única imagem,
    * lado a lado, com legenda — assim é só um arquivo para
    * baixar e anexar no WhatsApp.
    */
    async function combineFrontAndBack(frontBlob, backBlob) {
        const [front, back] = await Promise.all([
            blobToImage(frontBlob),
            blobToImage(backBlob)
        ]);

        const labelHeight = 56;
        const gap = 32;
        const width = front.img.naturalWidth + back.img.naturalWidth + gap;
        const height = labelHeight + Math.max(front.img.naturalHeight, back.img.naturalHeight);

        const combined = document.createElement('canvas');
        combined.width = width;
        combined.height = height;

        const combinedContext = combined.getContext('2d');
        combinedContext.fillStyle = '#ffffff';
        combinedContext.fillRect(0, 0, width, height);

        combinedContext.fillStyle = '#152033';
        combinedContext.textAlign = 'center';
        combinedContext.font = `bold ${Math.round(labelHeight * 0.5)}px Arial, sans-serif`;

        combinedContext.fillText('Frente', front.img.naturalWidth / 2, labelHeight * 0.68);
        combinedContext.fillText(
            'Costas',
            front.img.naturalWidth + gap + back.img.naturalWidth / 2,
            labelHeight * 0.68
        );

        combinedContext.drawImage(front.img, 0, labelHeight);
        combinedContext.drawImage(back.img, front.img.naturalWidth + gap, labelHeight);

        URL.revokeObjectURL(front.url);
        URL.revokeObjectURL(back.url);

        return new Promise(resolve => combined.toBlob(resolve, 'image/png'));
    }

    if (quoteButton) {
        quoteButton.addEventListener('click', async () => {
            const WHATSAPP_NUMBER = '551145518884';
            const originalLabel = quoteButton.textContent;

            quoteButton.disabled = true;
            quoteButton.textContent = 'Preparando orçamento...';

            try {
                captureCurrentViewState();

                /*
                * Sequencial: captureView troca a visualização no DOM,
                * então rodar em paralelo faria as duas capturas
                * disputarem o mesmo estado.
                */
                const frontBlob = await captureView('front');
                const backBlob = await captureView('back');

                const combinedBlob = await combineFrontAndBack(frontBlob, backBlob);
                downloadBlob(combinedBlob, 'camiseta-personalizada-zavati.png');

                const message = buildQuoteMessage();

                window.open(
                    `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`,
                    '_blank',
                    'noopener,noreferrer'
                );
            } catch (error) {
                console.error(error);
                alert('Não foi possível preparar o orçamento. Tente novamente.');
            } finally {
                quoteButton.disabled = false;
                quoteButton.textContent = originalLabel;
            }
        });
    }

    function updateViewButtons() {
        viewButtons.forEach(button => {
            const active =
                button.dataset.view ===
                currentView;

            button.classList.toggle(
                'active',
                active
            );

            button.setAttribute(
                'aria-pressed',
                String(active)
            );
        });
    }

}


function formatCm(value) {
    return `${Number.isInteger(value) ? value : value.toFixed(1)} cm`;
}

function hexToRgb(hex) {
    const value = hex.replace('#', '');
    return {
        r: parseInt(value.slice(0, 2), 16),
        g: parseInt(value.slice(2, 4), 16),
        b: parseInt(value.slice(4, 6), 16)
    };
}

document.querySelector('#current-year').textContent =
    new Date().getFullYear();