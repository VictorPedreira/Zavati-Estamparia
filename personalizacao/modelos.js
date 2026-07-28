/**
 * ========== CONFIGURAÇÃO DE MODELOS DE CAMISETAS ==========
 * 
 * COMO USAR:
 * 1. Coloque seus arquivos PNG na pasta: assets/
 * 2. Adicione um novo objeto no array 'SHIRT_MODELS' abaixo
 * 3. Preencha os dados: id, nome, imagem (caminho local)
 * 4. Salve o arquivo
 * 5. O modelo vai aparecer automaticamente no select e funcionar!
 * 
 * EXEMPLO:
 * {
 *     id: 'seu-modelo',
 *     nome: 'Seu Modelo',
 *     imagem: '../assets/sua-camiseta.png'
 * }
 * 
 * ========================================================
 */

const SHIRT_MODELS = [
    {
        id: 'basica',
        nome: 'Camiseta Básica frente',
        imagem: '../assets/images/camiseta-frente.png'
    },
    {
        id: 'premium',
        nome: 'Camiseta Básica trás',
        imagem: '../assets/images/camiseta-tras.png'
    },
    {
        id: 'oversized',
        nome: 'Camiseta Oversized frente',
        imagem: '../assets/images/camiseta-oversized-branca-frente.png'
    },
    {
        id: 'fitted',
        nome: 'Camiseta Oversized trás',
        imagem: '../assets/images/camiseta-oversized-branca-tras.png'
    }
    
    // ========== ADICIONE NOVOS MODELOS AQUI ==========
    // Coloque o PNG na pasta assets/ e adicione aqui:
    /*
    {
        id: 'regata',
        nome: 'Regata',
        imagem: '../assets/camiseta-regata.png'
    },
    {
        id: 'polo',
        nome: 'Polo',
        imagem: '../assets/camiseta-polo.png'
    }
    */
    // ================================================
];

/**
 * Função para inicializar os modelos no HTML
 * Preenche automaticamente o select com os modelos
 */
function initializeShirtModels() {
    const shirtModelSelect = document.getElementById('shirtModel');
    
    if (!shirtModelSelect) {
        console.error('Elemento #shirtModel não encontrado!');
        return;
    }
    
    // Limpar opções antigas
    shirtModelSelect.innerHTML = '';
    
    // Adicionar cada modelo como opção
    SHIRT_MODELS.forEach(model => {
        const option = document.createElement('option');
        option.value = model.id;
        option.textContent = model.nome;
        shirtModelSelect.appendChild(option);
    });
    
    console.log(`✅ ${SHIRT_MODELS.length} modelos carregados com sucesso!`);
}

/**
 * Função para obter a imagem de um modelo pelo ID
 * @param {string} modelId - ID do modelo
 * @returns {string} Caminho da imagem
 */
function getShirtImage(modelId) {
    const model = SHIRT_MODELS.find(m => m.id === modelId);
    return model ? model.imagem : SHIRT_MODELS[0].imagem;
}

/**
 * Função para obter o nome de um modelo pelo ID
 * @param {string} modelId - ID do modelo
 * @returns {string} Nome do modelo
 */
function getShirtName(modelId) {
    const model = SHIRT_MODELS.find(m => m.id === modelId);
    return model ? model.nome : SHIRT_MODELS[0].nome;
}

/**
 * Função para obter todos os modelos
 * @returns {array} Array com todos os modelos
 */
function getAllShirtModels() {
    return SHIRT_MODELS;
}

console.log('modelos.js carregado com sucesso!');
