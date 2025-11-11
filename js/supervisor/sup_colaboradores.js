// js/supervisor/sup_colaboradores.js
document.addEventListener('DOMContentLoaded', () => {

    // 1. Pega o Supervisor logado
    const userLogado = JSON.parse(sessionStorage.getItem('sigo_user_logado'));
    
    const listContainer = document.querySelector('.collaborator-list');
    const searchInput = document.querySelector('.search-input');
    const pageSubtitle = document.querySelector('.page-subtitle');

    if (!userLogado || userLogado.cargo !== 'Supervisor') {
        if (listContainer) listContainer.innerHTML = '<p style="padding: 20px; text-align: center; color: var(--text-muted);">Erro: Não foi possível identificar o supervisor.</p>';
        return;
    }
    
    const MINHA_UNIDADE = userLogado.unidade;
    if (pageSubtitle) {
        pageSubtitle.textContent = `Funcionários da Unidade ${MINHA_UNIDADE}`;
    }

    // 2. Carrega todos os colaboradores do sistema
    const allColaboradores = JSON.parse(localStorage.getItem('sigo_colaboradores')) || [];

    // 3. Filtra apenas os que são da MINHA UNIDADE e são "Colaborador"
    const meusColaboradores = allColaboradores.filter(c => 
        c.unidade === MINHA_UNIDADE && c.cargo === 'Colaborador'
    );

    // 4. Função para renderizar a lista
    function renderList(lista) {
        if (!listContainer) return;
        listContainer.innerHTML = ''; // Limpa a lista

        if (lista.length === 0) {
            listContainer.innerHTML = '<p style="padding: 20px; text-align: center; color: var(--text-muted);">Nenhum colaborador encontrado para esta unidade.</p>';
            return;
        }

        lista.forEach(colab => {
            let statusBadge = '<span class="badge badge-success">Ativo</span>'; // (Simulação de status)

            // Link corrigido para a página de perfil comum
            listContainer.innerHTML += `
                <a href="../common/perfil-colaborador.html?id=${colab.id}" class="collaborator-item">
                    <span class="collaborator-name">${colab.nome}</span>
                    <div class="collaborator-status">
                        ${statusBadge}
                        <i class="fas fa-eye view-profile-icon"></i>
                    </div>
                </a>
            `;
        });
    }

    // 5. Event Listener da Busca
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            const searchTerm = e.target.value.toLowerCase();
            const filtrados = meusColaboradores.filter(c => 
                c.nome.toLowerCase().includes(searchTerm)
            );
            renderList(filtrados);
        });
    }

    // 6. Renderização Inicial
    renderList(meusColaboradores);
});