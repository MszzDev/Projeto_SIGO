// js/common/notificacoes.js
document.addEventListener('DOMContentLoaded', () => {

    // 1. Encontrar o ponto de injeção no header
    const userProfileContainer = document.querySelector('.main-header .user-profile');
    if (!userProfileContainer) return; // Não é uma página com header (ex: login)

    // 2. Pegar o usuário logado
    const userLogado = JSON.parse(sessionStorage.getItem('sigo_user_logado'));
    // Se não houver usuário logado ou não for Coordenador, não faz nada
    if (!userLogado || userLogado.cargo !== 'Coordenador') {
        return;
    }

    // 3. Injetar o HTML do Sino
    userProfileContainer.insertAdjacentHTML('afterbegin', `
        <div class="notification-bell">
            <button class="btn-bell" id="notification-bell-btn" title="Notificações">
                <i class="fas fa-bell"></i>
            </button>
            <span class="notification-badge" id="notification-badge">0</span>
            <div class="notification-dropdown" id="notification-dropdown">
                <div class="notification-dropdown-header">
                    Notificações
                </div>
                <div class="notification-dropdown-body" id="notification-dropdown-body">
                    <p class="notification-empty-state">Nenhuma notificação nova.</p>
                </div>
            </div>
        </div>
    `);

    // 4. Referenciar os novos elementos
    const bellBtn = document.getElementById('notification-bell-btn');
    const badge = document.getElementById('notification-badge');
    const dropdown = document.getElementById('notification-dropdown');
    const dropdownBody = document.getElementById('notification-dropdown-body');

    // 5. Carregar e Processar Notificações
    let minhasNotificacoes = [];
    
    function carregarNotificacoes() {
        const allNotificacoes = JSON.parse(localStorage.getItem('sigo_notificacoes')) || [];
        
        // Filtra apenas as NÃO LIDAS e PARA ESTE COORDENADOR
        minhasNotificacoes = allNotificacoes.filter(n => 
            n.coordenadorId == userLogado.id && n.lida === false
        );

        // Atualiza o contador (badge)
        if (minhasNotificacoes.length > 0) {
            badge.textContent = minhasNotificacoes.length > 9 ? '9+' : minhasNotificacoes.length;
            badge.classList.add('active');
        } else {
            badge.textContent = '0';
            badge.classList.remove('active');
        }

        // Preenche o dropdown
        preencherDropdown();
    }

    // 6. Preencher o Dropdown
    function preencherDropdown() {
        dropdownBody.innerHTML = ''; // Limpa
        
        if (minhasNotificacoes.length === 0) {
            dropdownBody.innerHTML = '<p class="notification-empty-state">Nenhuma notificação nova.</p>';
            return;
        }

        minhasNotificacoes.forEach(n => {
            let iconClass = n.tipo === 'solicitacao' ? 'solicitacao' : 'ocorrencia';
            let icon = n.tipo === 'solicitacao' ? 'fa-clipboard-list' : 'fa-exclamation-triangle';
            
            // Cria o link
            const itemLink = document.createElement('a');
            itemLink.href = n.link;
            itemLink.className = 'notification-item';
            itemLink.dataset.notifId = n.id; // Guarda o ID no item
            
            itemLink.innerHTML = `
                <div class="notification-item-icon ${iconClass}">
                    <i class="fas ${icon}"></i>
                </div>
                <span class="notification-item-text">${n.texto}</span>
            `;
            
            // Adiciona evento de clique para marcar como lida
            itemLink.addEventListener('click', (e) => {
                // Não impede o redirecionamento (e.preventDefault()),
                // apenas marca como lida antes de ir.
                marcarComoLida(n.id);
            });

            dropdownBody.appendChild(itemLink);
        });
    }

    // 7. Marcar como Lida
    function marcarComoLida(notificacaoId) {
        const allNotificacoes = JSON.parse(localStorage.getItem('sigo_notificacoes')) || [];
        const index = allNotificacoes.findIndex(n => n.id === notificacaoId);
        
        if (index > -1) {
            allNotificacoes[index].lida = true;
            localStorage.setItem('sigo_notificacoes', JSON.stringify(allNotificacoes));
        }
    }

    // 8. Event Listener para Abrir/Fechar Dropdown
    bellBtn.addEventListener('click', (e) => {
        e.stopPropagation(); // Impede que o clique feche o menu (ver listener do 'document')
        dropdown.classList.toggle('open');
    });

    // 9. Event Listener para Fechar ao Clicar Fora
    document.addEventListener('click', (e) => {
        if (dropdown.classList.contains('open') && !bellBtn.contains(e.target)) {
            dropdown.classList.remove('open');
        }
    });

    // --- Iniciar ---
    carregarNotificacoes();
});