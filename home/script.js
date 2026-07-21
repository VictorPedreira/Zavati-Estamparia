/**
 * HOME PAGE - SCRIPT
 * 
 * Funcionalidades:
 * - Carrossel de imagens
 * - Menu mobile
 */

// ===== VARIÁVEIS GLOBAIS =====
let currentSlide = 0;
const slides = document.querySelectorAll('.carousel-slide');
const totalSlides = slides.length;
let autoPlayInterval;

// ===== INICIALIZAÇÃO =====
document.addEventListener('DOMContentLoaded', function() {
    initCarousel();
    initMobileMenu();
});

// ===== CARROSSEL =====
function initCarousel() {
    // Botões de navegação
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    
    if (prevBtn) prevBtn.addEventListener('click', prevSlide);
    if (nextBtn) nextBtn.addEventListener('click', nextSlide);
    
    // Indicadores
    const indicators = document.querySelectorAll('.indicator');
    indicators.forEach((indicator, index) => {
        indicator.addEventListener('click', () => goToSlide(index));
    });
    
    // Auto-play
    startAutoPlay();
    
    // Pausar ao passar o mouse
    const carousel = document.querySelector('.carousel');
    if (carousel) {
        carousel.addEventListener('mouseenter', stopAutoPlay);
        carousel.addEventListener('mouseleave', startAutoPlay);
    }
}

function showSlide(index) {
    // Garantir que o índice está dentro do intervalo
    if (index >= totalSlides) {
        currentSlide = 0;
    } else if (index < 0) {
        currentSlide = totalSlides - 1;
    } else {
        currentSlide = index;
    }
    
    // Ocultar todos os slides
    slides.forEach(slide => {
        slide.classList.remove('active');
    });
    
    // Mostrar slide atual
    if (slides[currentSlide]) {
        slides[currentSlide].classList.add('active');
    }
    
    // Atualizar indicadores
    updateIndicators();
    
    // Atualizar contador
    updateCounter();
}

function nextSlide() {
    showSlide(currentSlide + 1);
}

function prevSlide() {
    showSlide(currentSlide - 1);
}

function goToSlide(index) {
    showSlide(index);
}

function updateIndicators() {
    const indicators = document.querySelectorAll('.indicator');
    indicators.forEach((indicator, index) => {
        if (index === currentSlide) {
            indicator.classList.add('active');
        } else {
            indicator.classList.remove('active');
        }
    });
}

function updateCounter() {
    const currentSlideSpan = document.getElementById('currentSlide');
    const totalSlidesSpan = document.getElementById('totalSlides');
    
    if (currentSlideSpan) currentSlideSpan.textContent = currentSlide + 1;
    if (totalSlidesSpan) totalSlidesSpan.textContent = totalSlides;
}

function startAutoPlay() {
    // Auto-play a cada 5 segundos
    autoPlayInterval = setInterval(() => {
        nextSlide();
    }, 5000);
}

function stopAutoPlay() {
    clearInterval(autoPlayInterval);
}

// ===== MENU MOBILE =====
function initMobileMenu() {
    const menuToggle = document.getElementById('menuToggle');
    const mobileMenu = document.getElementById('mobileMenu');
    const menuCloseBtn = document.getElementById('menuClose');
    const mobileLinks = document.querySelectorAll('.mobile-link');

    if (!mobileMenu) return;

    // Função auxiliar para fechar o menu, destravar a tela e resetar o botão
    function closeDrawer() {
        mobileMenu.classList.remove('active');
        mobileMenu.classList.remove('open');
        
        // Destrava a rolagem da página
        document.body.style.overflow = '';
        
        // Reseta a animação do botão hambúrguer
        if (menuToggle) {
            const spans = menuToggle.querySelectorAll('span');
            if (spans.length >= 3) {
                spans[0].style.transform = 'none';
                spans[1].style.opacity = '1';
                spans[2].style.transform = 'none';
            }
        }
    }

    // 1. Abrir/Fechar pelo botão Hambúrguer
    if (menuToggle) {
        menuToggle.addEventListener('click', function() {
            // Alterna o estado do menu
            const isActive = mobileMenu.classList.toggle('active');
            mobileMenu.classList.toggle('open', isActive);
            
            // Trava a rolagem da página se estiver aberto, destrava se fechar
            document.body.style.overflow = isActive ? 'hidden' : '';
            
            // Anima as 3 barras do botão hambúrguer
            const spans = menuToggle.querySelectorAll('span');
            if (spans.length >= 3) {
                if (isActive) {
                    spans[0].style.transform = 'rotate(45deg) translate(10px, 10px)';
                    spans[1].style.opacity = '0';
                    spans[2].style.transform = 'rotate(-45deg) translate(7px, -7px)';
                } else {
                    spans[0].style.transform = 'none';
                    spans[1].style.opacity = '1';
                    spans[2].style.transform = 'none';
                }
            }
        });
    }

    // 2. Fechar ao clicar no botão 'X' dentro da gaveta
    if (menuCloseBtn) {
        menuCloseBtn.addEventListener('click', function() {
            closeDrawer();
        });
    }

    // 3. Fechar a gaveta automaticamente ao clicar em qualquer link
    mobileLinks.forEach(link => {
        link.addEventListener('click', function() {
            closeDrawer();
        });
    });
}

// ===== EVENT LISTENERS ADICIONAIS =====

// Detectar mudanças de tamanho da janela
window.addEventListener('resize', function() {
    // Fechar menu mobile em telas grandes
    if (window.innerWidth > 768) {
        const mobileMenu = document.getElementById('mobileMenu');
        if (mobileMenu) {
            mobileMenu.classList.remove('active');
        }
    }
});

console.log('Home Page - Carregada com sucesso!');
