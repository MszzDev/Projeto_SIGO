// js/coordenador/dashboard.js

document.addEventListener('DOMContentLoaded', function() {
    
    // --- LÓGICA DE LOGOUT ---
    const logoutButton = document.getElementById('logout-button');
    
    if (logoutButton) {
        logoutButton.addEventListener('click', function() {
            // Adicionar lógica de limpeza se necessário (ex: remover token de sessão)
            console.log('Logout realizado.');
            
            // Limpa o status da unidade do supervisor ao fazer logout
            // (Se o coordenador também for de uma unidade, ajuste isso)
            // localStorage.removeItem('sigo_status_unidade_JardimAngela'); // Opcional

            // Redireciona para a tela de login
            window.location.href = '../../login.html';
        });
    }

    // --- LÓGICA DE STATUS DA UNIDADE (SIMULAÇÃO) ---
    function carregarStatusUnidades() {
        // Tenta ler o status 'Ativa' da unidade Jardim Ângela (salvo pelo Supervisor)
        const statusJardimAngela = localStorage.getItem('sigo_status_unidade_JardimAngela');
        
        // Encontra o elemento (span) na tabela
        const badgeElement = document.getElementById('status-unidade-JardimAngela');
        
        if (badgeElement && statusJardimAngela === 'Ativa') {
            // Se estiver 'Ativa', atualiza o badge para verde
            badgeElement.textContent = 'Ativa';
            badgeElement.classList.remove('badge-secondary', 'badge-danger', 'badge-warning'); // Remove classes de inativo
            badgeElement.classList.add('badge-success'); // Adiciona classe de ativo
        } else if (badgeElement) {
            // Se não estiver 'Ativa' (ou não existir no localStorage), fica Inativa
            badgeElement.textContent = 'Inativa';
            badgeElement.classList.remove('badge-success');
            badgeElement.classList.add('badge-secondary'); // Classe para 'Inativa' (cinza)
        }
        
        // (Você pode adicionar mais verificações para outras unidades aqui)
    }

    // Carrega o status ao abrir a página
    carregarStatusUnidades();
});