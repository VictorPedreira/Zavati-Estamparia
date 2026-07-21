/**
 * PROFISSIONAIS PAGE - SCRIPT
 * 
 * Funcionalidades:
 * - Menu mobile
 */

// ===== INICIALIZAÇÃO =====
document.addEventListener('DOMContentLoaded', function() {
    initMobileMenu();
});

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

console.log('Profissionais Page - Carregada com sucesso!');
