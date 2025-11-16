// js/common/responsive-sidebar.js
document.addEventListener('DOMContentLoaded', () => {

    const toggleBtn = document.getElementById('sidebar-toggle-btn');
    const sidebar = document.querySelector('.sidebar');
    
    if (!toggleBtn || !sidebar) {
        // Não executa se os elementos não existirem (ex: tela de login)
        return; 
    }

    // 1. Cria o backdrop (fundo escuro) dinamicamente
    const backdrop = document.createElement('div');
    backdrop.className = 'sidebar-backdrop';
    document.body.appendChild(backdrop);

    // 2. Função para fechar a sidebar
    const closeSidebar = () => {
        sidebar.classList.remove('active');
        backdrop.classList.remove('active');
    };

    // 3. Função para abrir a sidebar
    const openSidebar = () => {
        sidebar.classList.add('active');
        backdrop.classList.add('active');
    };

    // 4. Evento no botão hambúrguer
    toggleBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        if (sidebar.classList.contains('active')) {
            closeSidebar();
        } else {
            openSidebar();
        }
    });

    // 5. Evento no backdrop para fechar ao clicar fora
    backdrop.addEventListener('click', () => {
        closeSidebar();
    });

    // 6. [BÔNUS] Fecha a sidebar ao clicar em um link de navegação
    sidebar.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            // Adiciona um pequeno delay para o usuário ver o clique
            setTimeout(closeSidebar, 200); 
        });
    });
});