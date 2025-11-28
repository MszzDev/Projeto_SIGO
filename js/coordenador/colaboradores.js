// js/coordenador/colaboradores.js
document.addEventListener('DOMContentLoaded', () => {

    const container = document.getElementById('colaboradores-unidades-container');
    if (!container) return;

    // 1. Identificar o Coordenador logado
    const userLogado = JSON.parse(sessionStorage.getItem('sigo_user_logado'));
    
    // Se não for um coordenador, ou se o script de injeção não tiver sido rodado
    if (!userLogado || userLogado.cargo !== 'Coordenador') {
        container.innerHTML = '<p class="text-muted">Acesso negado ou usuário não é um Coordenador.</p>';
        return;
    }
    
    // 2. Carregar todos os dados
    const allColaboradores = JSON.parse(localStorage.getItem('sigo_colaboradores')) || [];
    const allUnidades = JSON.parse(localStorage.getItem('sigo_unidades')) || [];

    // 3. Filtrar Unidades gerenciadas por este Coordenador
    // (Usa '==' para comparar ID que pode ser string ou número)
    const unidadesDoCoordenador = allUnidades.filter(u => u.coordenadorId == userLogado.id);

    let htmlFinal = `<h2 class="user-list-title">Colaboradores por Unidade (${userLogado.nome})</h2>`;
    
    if (unidadesDoCoordenador.length === 0) {
        htmlFinal += `<p class="text-muted">Nenhuma unidade associada à sua coordenação.</p>`;
        container.innerHTML = htmlFinal;
        return;
    }

    // 4. Agrupar colaboradores por Unidade
    unidadesDoCoordenador.forEach(unidade => {
        const staffDaUnidade = allColaboradores.filter(c => c.unidade === unidade.nome);
        
        // 5. Separar Supervisores e Colaboradores
        const supervisores = staffDaUnidade.filter(c => c.cargo === 'Supervisor');
        const colaboradores = staffDaUnidade.filter(c => c.cargo === 'Colaborador');
        
        // --- Renderiza a seção da Unidade ---
        htmlFinal += `
            <div class="user-list-section">
                <h3 class="unit-section-header">
                    <i class="fas fa-building fa-fw"></i> ${unidade.nome} (${staffDaUnidade.length} Pessoas)
                </h3>
        `;
        
        // --- Renderiza a Tabela de Supervisores ---
        htmlFinal += renderizarTabela(supervisores, "Supervisores", "Supervisor");

        // --- Renderiza a Tabela de Colaboradores ---
        htmlFinal += renderizarTabela(colaboradores, "Colaboradores", "Colaborador");
        
        htmlFinal += `</div>`; // Fecha .user-list-section
    });

    container.innerHTML = htmlFinal;

    // --- Função Auxiliar para criar a tabela ---
    function renderizarTabela(lista, titulo, cargo) {
        if (lista.length === 0) {
            return `<p class="text-muted" style="margin-left: 20px;">Nenhum ${cargo.toLowerCase()} nesta unidade.</p>`;
        }
        
        const badgeClass = cargo === 'Supervisor' ? 'badge-supervisor' : 'badge-colaborador';
        
        let tabelaHtml = `
            <div class="card" style="margin-bottom: 20px;">
                <div class="card-body">
                    <h4 class="mb-3">${titulo} (${lista.length})</h4>
                    <div class="table-responsive">
                        <table class="table table-hover">
                            <thead>
                                <tr>
                                    <th>Nome</th>
                                    <th>Cargo</th>
                                    <th>ID</th>
                                    <th>Turno</th>
                                    <th>Ações</th>
                                </tr>
                            </thead>
                            <tbody>
        `;

        lista.forEach(user => {
            const avatar = user.nome ? user.nome.substring(0, 2).toUpperCase() : '??';
            tabelaHtml += `
                <tr>
                    <td>
                        <img src="https://via.placeholder.com/32/1a3a52/ffffff?text=${avatar}" alt="Avatar" class="user-avatar" style="border-radius: 50%; width: 32px; height: 32px; margin-right: 10px;">
                        ${user.nome || 'N/A'}
                    </td>
                    <td><span class="badge ${badgeClass}">${user.cargo}</span></td>
                    <td>${user.id_usuario || 'N/A'}</td>
                    <td>${user.periodo || 'N/A'}</td>
                    <td>
                        <a href="../common/perfil-colaborador.html?id=${user.id}" class="btn btn-sm btn-outline-primary" title="Ver Perfil">
                            <i class="fas fa-eye"></i>
                        </a>
                    </td>
                </tr>
            `;
        });

        tabelaHtml += `
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        `;
        return tabelaHtml;
    }
});