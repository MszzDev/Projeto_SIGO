// js/common/logout.js
document.addEventListener('DOMContentLoaded', () => {
    // Encontra o botão de logout em qualquer página (Coordenador ou Gerente)
    const logoutButton = document.getElementById('logout-button');
    
    if (logoutButton) {
        logoutButton.addEventListener('click', (e) => {
            e.preventDefault();
            
            // Pede confirmação
            if (confirm('Tem certeza que deseja sair do sistema?')) {
                
                // Limpa dados de status de sessão (ex: supervisor ativo)
                localStorage.removeItem('sigo_status_unidade_JardimAngela');
                // Adicione outras chaves de 'status' se houver
                
                console.log('Logout realizado.');

                // Adiciona a classe para a animação de saída (do global.css)
                document.body.classList.add('page-fade-out');
                
                // Determina o caminho correto para a tela de login
                let loginPath = 'login.html'; // Padrão
                const currentPath = window.location.pathname;

                if (currentPath.includes('/telas/gerente/') || currentPath.includes('/telas/coordenador/')) {
                    loginPath = '../../login.html'; // Sobe dois níveis
                } else if (currentPath.includes('/telas/')) {
                    loginPath = '../login.html'; // Sobe um nível
                }
                
                // Redireciona para a tela de login após a animação
                setTimeout(() => {
                    window.location.href = loginPath;
                }, 400); // Duração da animação (0.4s)
            }
        });
    }
});