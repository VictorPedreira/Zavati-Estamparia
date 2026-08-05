const SHIRT_MODELS = [
    {
        id: 'basica',
        nome: 'Camiseta Básica',

        imagens: {
            front: '../assets/images/camiseta-frente.png',
            back: '../assets/images/camiseta-tras.png'
        }
    },

    {
        id: 'oversized',
        nome: 'Camiseta Oversized',

        imagens: {
            front: '../assets/images/oversized-frente.png',
            back: '../assets/images/oversized-tras.png'
        }
    },

    {
        id: 'polo',
        nome: 'Camisa Polo',

        imagens: {
            front: '../assets/images/polo-frente.png',
            back: '../assets/images/polo-tras.png'
        }
    },

    {
        id: 'moletom-capuz',
        nome: 'Moletom com capuz',

        imagens: {
            front: '../assets/images/moletom-capuz.png',
            back: '../assets/images/moletom-capuz-tras.png'
        }
    },

    {
        id: 'moletom-sem-capuz',
        nome: 'Moletom sem capuz',

        imagens: {
            front: '../assets/images/moletom-frente.png',
            back: '../assets/images/moletom-tras.png'
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