// js/gerente/colaboradores.js
document.addEventListener('DOMContentLoaded', () => {

    const container = document.getElementById('accordion-container');
    if (!container) return;

    const allUsers = JSON.parse(localStorage.getItem('sigo_colaboradores')) || [];
    const allUnidades = JSON.parse(localStorage.getItem('sigo_unidades')) || [];
    const coordenadores = allUsers.filter(c => c.cargo === 'Coordenador');

    if (coordenadores.length === 0) {
        container.innerHTML = `<p class="no-data-message">Nenhum coordenador cadastrado. Clique em "Adicionar Usuário" para começar.</p>`;
        return;
    }

    let htmlFinal = '';

    coordenadores.forEach(cood => {
        // --- PADRONIZAÇÃO DA FOTO (Coordenador) ---
        const avatarSrc = cood.foto_url 
            ? cood.foto_url 
            : '../../img/perf.png'; // Fallback para perf.png

        const minhasUnidades = allUnidades.filter(u => u.coordenadorId == cood.id);
        const minhasUnidadesNomes = minhasUnidades.map(u => u.nome);
        
        const minhaEquipe = allUsers.filter(u => 
            minhasUnidadesNomes.includes(u.unidade) && (u.cargo === 'Supervisor' || u.cargo === 'Colaborador')
        );

        // Agrupa a equipe por Unidade para a próxima iteração
        const equipePorUnidade = minhasUnidades.map(unit => {
            return {
                ...unit,
                equipe: minhaEquipe.filter(c => c.unidade === unit.nome)
            };
        }).filter(unit => unit.equipe.length > 0); // Mostra só unidades com equipe

        htmlFinal += `
            <details class="coordenador-card">
                <summary class="coordenador-summary">
                    <img src="${avatarSrc}" alt="Avatar" class="coordenador-avatar">
                    <div>
                        <h3 class="coordenador-nome">${cood.nome}</h3>
                        <span class="coordenador-info">${cood.email || 'Sem email'}</span>
                    </div>

                    <div class="coordenador-stats">
                        <div class="stat-item">
                            <span class="stat-value">${minhasUnidades.length}</span>
                            <span class="stat-label">Unidades</span>
                        </div>
                        <div class="stat-item">
                            <span class="stat-value">${minhaEquipe.length}</span>
                            <span class="stat-label">Equipe</span>
                        </div>
                    </div>
                    <div class="coordenador-actions">
                        <a href="editar-usuario.html?id=${cood.id}" class="btn btn-sm btn-outline-primary btn-edit" title="Editar Usuário">
                            <i class="fas fa-pencil-alt"></i>
                        </a>
                        <button class="btn btn-sm btn-danger btn-remove" title="Remover" data-id="${cood.id}" data-name="${cood.nome}">
                            <i class="fas fa-trash-alt"></i>
                        </button>
                    </div>
                </summary>
                <div class="coordenador-details">
        `;

        // Leque aninhado para UNIDADES (Agora com o formato visual solicitado)
        if (equipePorUnidade.length > 0) {
            equipePorUnidade.forEach(unit => {
                const supervisores = unit.equipe.filter(u => u.cargo === 'Supervisor');
                const colaboradores = unit.equipe.filter(u => u.cargo === 'Colaborador');

                htmlFinal += `
                    <details class="unidade-leque">
                        <summary class="unidade-summary">
                            <span><i class="fas fa-building"></i> ${unit.nome}</span>
                            <span>${supervisores.length} Supervisores | ${colaboradores.length} Colaboradores <i class="fas fa-chevron-right leque-icon"></i></span>
                        </summary>
                        <div class="unidade-registros">
                        <div class="table-responsive">
                            <table class="table">
                                <thead> <tr> <th>Nome</th> <th>Cargo</th> <th>Turno</th> <th>Ações</th> </tr> </thead>
                                <tbody>
                `;
                // Junta Supervisores e Colaboradores para a tabela
                [...supervisores, ...colaboradores].forEach(user => {
                    const avatarSrcEquipe = user.foto_url ? user.foto_url : '../../img/perf.png';
                    const badgeClass = user.cargo === 'Supervisor' ? 'badge-supervisor' : 'badge-colaborador';
                    
                    htmlFinal += `
                        <tr>
                            <td>
                                <img src="${avatarSrcEquipe}" alt="Avatar" class="user-avatar">
                                <span>${user.nome}<small class="d-block text-muted">${user.email || ''}</small></span>
                            </td>
                            <td><span class="badge ${badgeClass}">${user.cargo}</span></td>
                            <td>${user.periodo || 'N/A'}</td>
                            <td>
                                <a href="editar-usuario.html?id=${user.id}" class="btn btn-sm btn-outline-primary" title="Editar">
                                    <i class="fas fa-pencil-alt"></i>
                                </a>
                                <a href="../common/perfil-colaborador.html?id=${user.id}" class="btn btn-sm btn-outline-secondary" title="Ver Perfil">
                                    <i class="fas fa-eye"></i>
                                </a>
                            </td>
                        </tr>
                    `;
                });
                htmlFinal += `</tbody></table></div></div></details>`;
            });
        } else {
            htmlFinal += '<p class="no-data-message" style="padding: 10px 0;">Nenhuma unidade com equipe atribuída a este coordenador.</p>';
        }
        
        htmlFinal += `</div></details>`;
    });

    container.innerHTML = htmlFinal;

    // Adiciona lógica de exclusão
    container.querySelectorAll('.btn-remove').forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault(); 
            e.stopPropagation();
            const id = Number(e.currentTarget.dataset.id);
            const name = e.currentTarget.dataset.name;
            
            // Substitui confirm() por globalConfirm()
            window.globalConfirm(`Tem certeza que deseja remover o coordenador **${name}**? Esta ação não pode ser desfeita.`, (result) => {
                if (result) {
                    const listaAtual = JSON.parse(localStorage.getItem('sigo_colaboradores')) || [];
                    const novaLista = listaAtual.filter(user => user.id !== id);
                    localStorage.setItem('sigo_colaboradores', JSON.stringify(novaLista));
                    window.location.reload();
                }
            }, 'Remover', 'Cancelar', 'Excluir Coordenador');
        });
    });
    
    // Impede que clicar nos botões de editar abra/feche o leque
    container.querySelectorAll('.btn-edit').forEach(button => {
        button.addEventListener('click', (e) => {
            e.stopPropagation();
        });
    });
});