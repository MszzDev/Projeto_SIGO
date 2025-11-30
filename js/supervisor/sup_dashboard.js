// js/supervisor/sup_dashboard.js
document.addEventListener('DOMContentLoaded', () => {

    // 1. Pega o Supervisor logado
    const userLogado = JSON.parse(sessionStorage.getItem('sigo_user_logado'));
    
    // Elementos de Notificação
    const notificationSection = document.getElementById('notification-section');
    const notificationListBody = document.getElementById('notification-list-body');
    const notificationBadgeMobile = document.getElementById('notification-badge-mobile');

    if (!userLogado || userLogado.cargo !== 'Supervisor') {
        const greetingEl = document.querySelector('.greeting');
        if (greetingEl) greetingEl.textContent = 'Erro de Login';
        return;
    }

    // 2. Preenche o Cabeçalho
    const supervisorLogadoNome = userLogado.nome; 
    const greetingEl = document.querySelector('.greeting');
    const unitNameEl = document.querySelector('.unit-name');
    if (greetingEl) greetingEl.textContent = `Olá, ${userLogado.nome.split(' ')[0]}`;
    if (unitNameEl) unitNameEl.textContent = `Unidade ${userLogado.unidade} - Supervisor`;

    // 3. Atualiza as Estatísticas (MANTIDO O ZERO)
    const countEl = document.querySelector('.header-card-stats .count');
    if (countEl) countEl.textContent = '0';
    
    // 4. Preenche a Data
    const infoDateEl = document.getElementById('info-date-js');
    if (infoDateEl) {
        const data = new Date();
        infoDateEl.textContent = data.toLocaleDateString('pt-BR', {
            month: 'long',
            year: 'numeric'
        }).replace(data.toLocaleDateString('pt-BR', { month: 'long' }), m => m.charAt(0).toUpperCase() + m.slice(1));
    }
    
    // --- NOVO: Carregar e Renderizar Notificações ---
    function carregarNotificacoesSupervisor() {
        const allNotificacoes = JSON.parse(localStorage.getItem('sigo_notificacoes')) || [];
        
        // Filtra APENAS notificações direcionadas a este Supervisor e não lidas
        const minhasNotificacoesNaoLidas = allNotificacoes.filter(n => 
            n.supervisorNome === supervisorLogadoNome && n.lida === false
        );

        if (minhasNotificacoesNaoLidas.length === 0) {
            if(notificationSection) notificationSection.style.display = 'none';
            return;
        }

        // Mostra a seção
        if(notificationSection) notificationSection.style.display = 'block';
        if(notificationBadgeMobile) notificationBadgeMobile.textContent = minhasNotificacoesNaoLidas.length;
        if(notificationListBody) notificationListBody.innerHTML = '';
        

        minhasNotificacoesNaoLidas.forEach(n => {
            // Define o ícone com base no status de aprovação
            const icon = n.tipo.startsWith('solicitacao') ? 'fas fa-clipboard-list' : 'fas fa-exclamation-triangle';
            let iconColor = 'var(--primary-blue)';
            if (n.texto.includes('Aprovado')) iconColor = 'var(--success-color)';
            else if (n.texto.includes('Recusado')) iconColor = 'var(--danger-color)';
            
            const itemLink = document.createElement('a');
            itemLink.href = n.link;
            itemLink.className = 'notification-item';
            itemLink.dataset.notifId = n.id;
            
            itemLink.innerHTML = `
                <i class="${icon} notification-icon" style="color: ${iconColor};"></i>
                <span class="notification-text">${n.texto}</span>
            `;
            
            itemLink.addEventListener('click', () => {
                // Marca como lida e redireciona (a função marcarComoLida irá recarregar a lista)
                marcarComoLida(n.id);
            });

            if(notificationListBody) notificationListBody.appendChild(itemLink);
        });
    }
    
    // Função para marcar como lida (necessário para persistência)
    function marcarComoLida(notificacaoId) {
        const allNotificacoes = JSON.parse(localStorage.getItem('sigo_notificacoes')) || [];
        const index = allNotificacoes.findIndex(n => n.id == notificacaoId); // Usa == para garantir

        if (index > -1) {
            allNotificacoes[index].lida = true;
            localStorage.setItem('sigo_notificacoes', JSON.stringify(allNotificacoes));
            // Recarrega o dashboard para atualizar a lista imediatamente
            carregarNotificacoesSupervisor();
        }
    }

    // --- EXECUÇÃO ---
    carregarNotificacoesSupervisor(); 
});