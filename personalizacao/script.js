/**
 * PERSONALIZAÇÃO PAGE - SCRIPT COM CANVAS + RÉGUA EM CM
 */

// ===== CONFIGURAÇÃO DE ESCALA =====
const SCALE_CM_TO_PX = 20; 
const SHIRT_WIDTH_CM = 54; 
const SHIRT_HEIGHT_CM = 71; 

const SHIRT_WIDTH_PX = SHIRT_WIDTH_CM * SCALE_CM_TO_PX; 
const SHIRT_HEIGHT_PX = SHIRT_HEIGHT_CM * SCALE_CM_TO_PX; 

const DISPLAY_SCALE = 0.50; 

// ===== INICIALIZAÇÃO =====
document.addEventListener('DOMContentLoaded', function() {
    initMobileMenu();
    initPersonalization();
});

// ===== MENU MOBILE =====
function initMobileMenu() {
    const menuToggle = document.getElementById('menuToggle');
    const mobileMenu = document.getElementById('mobileMenu');
    
    if (menuToggle) {
        menuToggle.addEventListener('click', function() {
            mobileMenu.classList.toggle('active');
            const spans = menuToggle.querySelectorAll('span');
            if (mobileMenu.classList.contains('active')) {
                spans[0].style.transform = 'rotate(45deg) translate(10px, 10px)';
                spans[1].style.opacity = '0';
                spans[2].style.transform = 'rotate(-45deg) translate(7px, -7px)';
            } else {
                spans[0].style.transform = 'none';
                spans[1].style.opacity = '1';
                spans[2].style.transform = 'none';
            }
        });
    }
}

// ===== PERSONALIZAÇÃO =====
function initPersonalization() {
    const SHIRT_COLORS = [
        { id: 'preto', nome: 'Preto', cor: '#111111' },
        { id: 'branco', nome: 'Branco', cor: '#ffffff' },
        { id: 'vermelho', nome: 'Vermelho', cor: '#FF0000' },
        { id: 'azul', nome: 'Azul', cor: '#0000FF' },
        { id: 'verde', nome: 'Verde', cor: '#00AA00' },
        { id: 'amarelo', nome: 'Amarelo', cor: '#FFFF00' },
        { id: 'laranja', nome: 'Laranja', cor: '#FF6600' },
        { id: 'roxo', nome: 'Roxo', cor: '#AA00AA' }
    ];
    
    const shirtModel = document.getElementById('shirtModel');
    const shirtImage = document.getElementById('shirtImage');
    const logoUpload = document.getElementById('logoUpload');
    const previewLogo = document.getElementById('previewLogo');
    const logoSize = document.getElementById('logoSize');
    const sizeValue = document.getElementById('sizeValue');
    const positionBtns = document.querySelectorAll('.position-btn');
    const resetBtn = document.getElementById('resetBtn');
    
    const modelInfo = document.getElementById('modelInfo');
    const colorInfo = document.getElementById('colorInfo');
    const logoInfo = document.getElementById('logoInfo');
    const shirtContainer = document.querySelector('.shirt-preview-container');
    
    let currentColor = SHIRT_COLORS[0].cor;
    let currentModel = null;
    let logoPosition = 'center';
    let isDragging = false;
    let offsetX = 0;
    let offsetY = 0;
    let currentLogoSizeCm = 2; 
    let userHasMovedLogo = false; // NOVA VARIÁVEL: Detecta se o usuário arrastou a logo

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    
    function createRulers() {
        const oldRulers = document.querySelectorAll('.ruler');
        oldRulers.forEach(ruler => ruler.remove());
        
        const horizontalRuler = document.createElement('div');
        horizontalRuler.className = 'ruler horizontal-ruler';
        horizontalRuler.style.cssText = 'position:absolute; top:-40px; left:0; width:100%; height:40px; display:flex; align-items:flex-end; border-bottom:2px solid #333; background-color:#f5f5f5; z-index:10;';
        
        const verticalRuler = document.createElement('div');
        verticalRuler.className = 'ruler vertical-ruler';
        verticalRuler.style.cssText = 'position:absolute; left:-50px; top:0; width:50px; height:100%; display:flex; flex-direction:column-reverse; align-items:flex-end; border-right:2px solid #333; background-color:#f5f5f5; z-index:10;';
        
        const visualScale = SCALE_CM_TO_PX * DISPLAY_SCALE;
        const cmWidth = Math.floor(shirtContainer.offsetWidth / visualScale);
        
        for (let i = 0; i <= cmWidth; i++) {
            const pos = i * visualScale;
            const tick = document.createElement('div');
            tick.style.cssText = `position:absolute; left:${pos}px; width:1px; height:${i % 5 === 0 ? '20px' : '10px'}; background-color:#333; bottom:0;`;
            if (i % 5 === 0) {
                const label = document.createElement('span');
                label.textContent = i;
                label.style.cssText = `position:absolute; left:${pos - 8}px; top:0; font-size:10px; font-weight:bold;`;
                horizontalRuler.appendChild(label);
            }
            horizontalRuler.appendChild(tick);
        }
        
        const cmHeight = Math.floor(shirtContainer.offsetHeight / visualScale);
        for (let i = 0; i <= cmHeight; i++) {
            const pos = i * visualScale;
            const tick = document.createElement('div');
            tick.style.cssText = `position:absolute; top:${pos}px; height:1px; width:${i % 5 === 0 ? '20px' : '10px'}; background-color:#333; right:0;`;
            if (i % 5 === 0) {
                const label = document.createElement('span');
                label.textContent = i;
                label.style.cssText = `position:absolute; top:${pos - 8}px; right:5px; font-size:10px; font-weight:bold;`;
                verticalRuler.appendChild(label);
            }
            verticalRuler.appendChild(tick);
        }
        shirtContainer.appendChild(horizontalRuler);
        shirtContainer.appendChild(verticalRuler);
    }
    
    initializeShirtModels();
    
    if (SHIRT_MODELS.length > 0) {
        currentModel = SHIRT_MODELS[0].id;
        modelInfo.textContent = SHIRT_MODELS[0].nome;
        loadAndColorizeImage(SHIRT_MODELS[0].imagem, currentColor);
    }
    
    shirtModel.addEventListener('change', function() {
        currentModel = this.value;
        modelInfo.textContent = getShirtName(currentModel);
        loadAndColorizeImage(getShirtImage(currentModel), currentColor);
    });

    const colorGrid = document.querySelector('.color-grid');
    if (colorGrid) {
        colorGrid.innerHTML = '';
        SHIRT_COLORS.forEach((color, index) => {
            const colorDiv = document.createElement('div');
            colorDiv.className = 'color-option' + (index === 0 ? ' active' : '');
            colorDiv.style.backgroundColor = color.cor;
            colorDiv.addEventListener('click', function() {
                document.querySelectorAll('.color-option').forEach(opt => opt.classList.remove('active'));
                this.classList.add('active');
                currentColor = color.cor;
                colorInfo.textContent = color.nome;
                loadAndColorizeImage(getShirtImage(currentModel), currentColor);
            });
            colorGrid.appendChild(colorDiv);
        });
    }
    
    function loadAndColorizeImage(imagePath, targetColor) {
        const img = new Image();
        img.crossOrigin = 'anonymous';
        img.onload = function() {
            const aspect = img.width / img.height;
            const finalWidth = SHIRT_WIDTH_PX * DISPLAY_SCALE;
            const finalHeight = finalWidth / aspect;

            canvas.width = finalWidth;
            canvas.height = finalHeight;
            
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
            
            const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
            const data = imageData.data;
            const rgb = hexToRgb(targetColor);
            
            for (let i = 0; i < data.length; i += 4) {
                const luminance = (data[i] * 0.299 + data[i+1] * 0.587 + data[i+2] * 0.114) / 255;
                if (data[i+3] > 128) {
                    const brightness = (rgb.r < 50) ? 0.85 : 0.7;
                    data[i] = Math.round(rgb.r * luminance * brightness);
                    data[i+1] = Math.round(rgb.g * luminance * brightness);
                    data[i+2] = Math.round(rgb.b * luminance * brightness);
                }
            }
            
            ctx.putImageData(imageData, 0, 0);
            shirtImage.src = canvas.toDataURL();
            shirtImage.style.width = finalWidth + "px";
            shirtImage.style.height = finalHeight + "px";
            
            setTimeout(() => {
                createRulers();
                // SÓ ATUALIZA A POSIÇÃO SE O USUÁRIO NÃO TIVER MOVIDO MANUALMENTE
                if (!userHasMovedLogo) {
                    updateLogoPosition();
                }
            }, 100);
        };
        img.src = imagePath;
    }
    
    function hexToRgb(hex) {
        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ? { r: parseInt(result[1], 16), g: parseInt(result[2], 16), b: parseInt(result[3], 16) } : { r: 0, g: 0, b: 0 };
    }
    
    logoSize.addEventListener('input', function() {
        currentLogoSizeCm = parseFloat(this.value);
        const sizePx = currentLogoSizeCm * SCALE_CM_TO_PX * DISPLAY_SCALE;
        sizeValue.textContent = currentLogoSizeCm.toFixed(1) + ' cm';
        
        if (previewLogo.style.display !== 'none') {
            previewLogo.style.width = sizePx + 'px';
            previewLogo.style.height = 'auto';
            // SÓ ATUALIZA A POSIÇÃO SE O USUÁRIO NÃO TIVER MOVIDO MANUALMENTE
            if (!userHasMovedLogo) {
                updateLogoPosition();
            }
        }
    });
    
    positionBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            userHasMovedLogo = false; // Resetamos para usar os botões fixos
            positionBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            logoPosition = this.getAttribute('data-position');
            updateLogoPosition();
        });
    });
    
    function updateLogoPosition() {
        if (previewLogo.style.display === 'none') return;
        const container = shirtContainer;
        const logoWidth = previewLogo.offsetWidth;
        const logoHeight = previewLogo.offsetHeight;
        let x, y;
        
        switch(logoPosition) {
            case 'top-left': x = container.offsetWidth * 0.3; y = container.offsetHeight * 0.25; break;
            case 'center': x = (container.offsetWidth - logoWidth) / 2; y = (container.offsetHeight - logoHeight) / 2; break;
            case 'bottom-right': x = container.offsetWidth - logoWidth - 40; y = container.offsetHeight - logoHeight - 40; break;
            default: x = (container.offsetWidth - logoWidth) / 2; y = (container.offsetHeight - logoHeight) / 2;
        }
        previewLogo.style.left = x + 'px';
        previewLogo.style.top = y + 'px';
        previewLogo.style.zIndex = "100";
    }
    
    logoUpload.addEventListener('change', function(e) {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(event) {
                userHasMovedLogo = false; // Nova logo começa na posição padrão
                previewLogo.src = event.target.result;
                previewLogo.style.display = 'block';
                logoInfo.textContent = file.name;
                const sizePx = currentLogoSizeCm * SCALE_CM_TO_PX * DISPLAY_SCALE;
                previewLogo.style.width = sizePx + 'px';
                updateLogoPosition();
                makeLogoDraggable();
            };
            reader.readAsDataURL(file);
        }
    });
    
    function makeLogoDraggable() {
        previewLogo.onmousedown = function(e) {
            isDragging = true;
            userHasMovedLogo = true; // MARCA QUE O USUÁRIO MOVEU A LOGO
            offsetX = e.clientX - previewLogo.getBoundingClientRect().left;
            offsetY = e.clientY - previewLogo.getBoundingClientRect().top;
            
            // Remove active dos botões de posição fixa quando começa a arrastar
            positionBtns.forEach(b => b.classList.remove('active'));
        };

        document.onmousemove = function(e) {
            if (!isDragging) return;
            const containerRect = shirtContainer.getBoundingClientRect();
            let x = e.clientX - containerRect.left - offsetX;
            let y = e.clientY - containerRect.top - offsetY;
            previewLogo.style.left = x + 'px';
            previewLogo.style.top = y + 'px';
        };
        document.onmouseup = () => isDragging = false;
    }
    
    resetBtn.addEventListener('click', () => location.reload());
}