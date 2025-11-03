// js/common/accessibility.js
document.addEventListener('DOMContentLoaded', () => {
    
    // Encontra os elementos principais do widget
    const footer = document.querySelector('.sidebar-footer');
    const toggleBtn = document.getElementById('acc-toggle-button');
    const menu = footer ? footer.querySelector('.accessibility-menu') : null;

    // Se os elementos não existirem na página, não faz nada
    if (!footer || !toggleBtn || !menu) {
        return; 
    }

    // 1. Abrir/Fechar o menu ao clicar no botão "ACESSIBILIDADE"
    toggleBtn.addEventListener('click', (e) => {
        // Impede que o clique no botão feche o menu imediatamente
        e.stopPropagation(); 
        // Adiciona ou remove a classe 'active' do rodapé
        footer.classList.toggle('active');
    });

    // 2. Fechar o menu se o usuário clicar em qualquer lugar FORA dele
    document.addEventListener('click', (e) => {
        // Verifica se o clique NÃO foi no menu E NÃO foi no botão de toggle
        if (!menu.contains(e.target) && !toggleBtn.contains(e.target) && footer.classList.contains('active')) {
            footer.classList.remove('active');
        }
    });

    // 3. (Opcional) Fechar o menu se o usuário clicar em uma das opções (A+, A-, etc.)
    const optionButtons = document.querySelectorAll('.acc-option-btn');
    optionButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            // (Aqui você adicionaria a lógica real, ex: aumentarFonte())
            console.log('Opção clicada:', btn.title);
            
            // Fecha o menu após a seleção
            footer.classList.remove('active');
        });
    });
});