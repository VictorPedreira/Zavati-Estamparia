const SHIRT_MODELS = [
    {
        id: 'basica',
        nome: 'Camiseta Básica',

        imagens: {
            front: '../assets/images/camiseta-frente.webp',
            back: '../assets/images/camiseta-tras.webp'
        }
    },

    {
        id: 'oversized',
        nome: 'Camiseta Oversized',

        imagens: {
            front: '../assets/images/oversized-frente.webp',
            back: '../assets/images/oversized-tras.webp'
        }
    },

    {
        id: 'polo',
        nome: 'Camisa Polo',

        imagens: {
            front: '../assets/images/polo-frente.webp',
            back: '../assets/images/polo-tras.webp'
        }
    },

    {
        id: 'moletom-capuz',
        nome: 'Moletom com capuz',

        imagens: {
            front: '../assets/images/moletom-capuz.webp',
            back: '../assets/images/moletom-capuz-tras.webp'
        }
    },

    {
        id: 'moletom-sem-capuz',
        nome: 'Moletom sem capuz',

        imagens: {
            front: '../assets/images/moletom-frente.webp',
            back: '../assets/images/moletom-tras.webp'
        }
    }
];

/*
 * Preenche o seletor com apenas os modelos,
 * sem criar opções separadas para frente e costas.
 */
function initializeShirtModels() {
    const shirtModelSelect =
        document.getElementById('shirtModel');

    if (!shirtModelSelect) {
        console.error(
            'Elemento #shirtModel não encontrado!'
        );

        return;
    }

    shirtModelSelect.innerHTML = '';

    SHIRT_MODELS.forEach(model => {
        const option =
            document.createElement('option');

        option.value = model.id;
        option.textContent = model.nome;

        shirtModelSelect.appendChild(option);
    });
}

/*
 * Encontra o modelo pelo ID.
 */
function getShirtModel(modelId) {
    return (
        SHIRT_MODELS.find(
            model => model.id === modelId
        ) || SHIRT_MODELS[0]
    );
}

/*
 * Retorna a imagem da frente ou das costas.
 */
function getShirtImage(
    modelId,
    view = 'front'
) {
    const model = getShirtModel(modelId);

    return (
        model.imagens[view] ||
        model.imagens.front
    );
}

/*
 * Retorna somente o nome do produto.
 */
function getShirtName(modelId) {
    return getShirtModel(modelId).nome;
}

function getAllShirtModels() {
    return SHIRT_MODELS;
}

console.log(
    `${SHIRT_MODELS.length} modelos carregados!`
);