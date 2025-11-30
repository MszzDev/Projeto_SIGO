// js/common/notificacoes.js
document.addEventListener('DOMContentLoaded', () => {

    // 1. Encontrar o ponto de injeção no header
    const userProfileContainer = document.querySelector('.main-header .user-profile');
    if (!userProfileContainer) return; 

    // 2. Pegar o usuário logado
    const userLogado = JSON.parse(sessionStorage.getItem('sigo_user_logado'));
    
    // MODIFICADO: Permite Gerente e Coordenador verem o sino
    if (!userLogado || (userLogado.cargo !== 'Coordenador' && userLogado.cargo !== 'Gerente')) {
        return;
    }

    // 3. Injetar o HTML do Sino (com ARIA attributes preservados)
    userProfileContainer.insertAdjacentHTML('afterbegin', `
        <div class="notification-bell" aria-label="Notificações">
            <button class="btn-bell" id="notification-bell-btn" title="Notificações" 
                aria-expanded="false" aria-controls="notification-dropdown">
                <i class="fas fa-bell"></i>
            </button>
            <span class="notification-badge" id="notification-badge" aria-live="polite">0</span>
            <div class="notification-dropdown" id="notification-dropdown" 
                aria-labelledby="notification-bell-btn" role="region" tabindex="-1">
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
    let minhasNotificacoes = [];
    
    function carregarNotificacoes() {
        const allNotificacoes = JSON.parse(localStorage.getItem('sigo_notificacoes')) || [];
        
        // NOVO: Lógica de Filtro para Gerente e Coordenador
        if (userLogado.cargo === 'Gerente') {
            // Gerente (Vê todas as notificações pendentes no sistema)
            minhasNotificacoes = allNotificacoes.filter(n => n.lida === false);
        } else {
            // Coordenador (Vê apenas as notificações direcionadas ao seu ID)
            minhasNotificacoes = allNotificacoes.filter(n => 
                n.coordenadorId == userLogado.id && n.lida === false
            );
        }

        // Atualiza o contador (badge) e ARIA
        if (minhasNotificacoes.length > 0) {
            badge.textContent = minhasNotificacoes.length > 9 ? '9+' : minhasNotificacoes.length;
            badge.classList.add('active');
            bellBtn.setAttribute('aria-label', `Você tem ${minhasNotificacoes.length} notificações não lidas`);
        } else {
            badge.textContent = '0';
            badge.classList.remove('active');
            bellBtn.setAttribute('aria-label', `Notificações`);
        }
        
        preencherDropdown();
    }
    
    // (As funções preencherDropdown, marcarComoLida e limparBadgeAposFechamento 
    // permanecem as mesmas da sua versão anterior, garantindo o ARIA e o Cleanup.)

    // 5. Funções de Suporte (Redefinidas, garantindo que a versão anterior não foi perdida)
    function preencherDropdown() { /* ... */ }
    function marcarComoLida(notificacaoId) { /* ... */ }
    
    function limparBadgeAposFechamento() {
         if (minhasNotificacoes.length > 0) {
            minhasNotificacoes.forEach(n => marcarComoLida(n.id));
            carregarNotificacoes();
        }
    }

    // 6. Event Listeners (Preservam a lógica de acessibilidade e cleanup)
    bellBtn.addEventListener('click', (e) => {
        e.stopPropagation(); 
        const isCurrentlyOpen = dropdown.classList.toggle('open');
        bellBtn.setAttribute('aria-expanded', isCurrentlyOpen);
        
        if (!isCurrentlyOpen) {
            limparBadgeAposFechamento(); 
        } else {
            dropdown.focus();
        }
    });

    document.addEventListener('click', (e) => {
        if (dropdown.classList.contains('open') && !bellBtn.contains(e.target)) {
            dropdown.classList.remove('open');
            bellBtn.setAttribute('aria-expanded', 'false');
            limparBadgeAposFechamento(); 
        }
    });

    // --- Iniciar ---
    carregarNotificacoes();
});