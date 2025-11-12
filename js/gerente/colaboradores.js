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

        // Leque aninhado para UNIDADES
        htmlFinal += `
            <details class="sub-leque">
                <summary class="sub-leque-summary">
                    <span><i class="fas fa-building fa-fw"></i> Ver Unidades (${minhasUnidades.length})</span>
                    <i class="fas fa-chevron-right leque-icon"></i>
                </summary>
                <div class="sub-leque-content">
        `;
        if (minhasUnidades.length > 0) {
            htmlFinal += '<ul class="unidade-lista">';
            minhasUnidades.forEach(unit => {
                htmlFinal += `<li><i class="fas fa-dot-circle fa-xs"></i> <strong>${unit.nome}</strong> (Cód: ${unit.codigo})</li>`;
            });
            htmlFinal += '</ul>';
        } else {
            htmlFinal += '<p class="no-data-message" style="padding: 10px 0;">Nenhuma unidade atribuída a este coordenador.</p>';
        }
        htmlFinal += `</div></details>`;

        // Leque aninhado para EQUIPE
        htmlFinal += `
            <details class="sub-leque">
                <summary class="sub-leque-summary">
                    <span><i class="fas fa-user-group fa-fw"></i> Ver Equipe (${minhaEquipe.length})</span>
                    <i class="fas fa-chevron-right leque-icon"></i>
                </summary>
                <div class="sub-leque-content">
        `;
        if (minhaEquipe.length > 0) {
            htmlFinal += `
                <div class="table-responsive">
                    <table class="table">
                        <thead> <tr> <th>Nome</th> <th>Cargo</th> <th>Unidade</th> <th>Turno</th> </tr> </thead>
                        <tbody>
            `;
            minhaEquipe.forEach(user => {
                // --- PADRONIZAÇÃO DA FOTO (Equipe) ---
                const avatarSrcEquipe = user.foto_url 
                    ? user.foto_url 
                    : '../../img/perf.png'; // Fallback para perf.png
                
                const badgeClass = user.cargo === 'Supervisor' ? 'badge-supervisor' : 'badge-colaborador';
                htmlFinal += `
                    <tr>
                        <td>
                            <img src="${avatarSrcEquipe}" alt="Avatar" class="user-avatar">
                            <span>${user.nome}</span>
                        </td>
                        <td><span class="badge ${badgeClass}">${user.cargo}</span></td>
                        <td>${user.unidade}</td>
                        <td>${user.periodo}</td>
                    </tr>
                `;
            });
            htmlFinal += `</tbody></table></div>`;
        } else {
            htmlFinal += '<p class="no-data-message" style="padding: 10px 0;">Nenhum supervisor ou colaborador encontrado.</p>';
        }
        htmlFinal += `</div></details>`;
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
            if (confirm(`Tem certeza que deseja remover o coordenador "${name}"? Esta ação não pode ser desfeita.`)) {
                const listaAtual = JSON.parse(localStorage.getItem('sigo_colaboradores')) || [];
                const novaLista = listaAtual.filter(user => user.id !== id);
                localStorage.setItem('sigo_colaboradores', JSON.stringify(novaLista));
                window.location.reload();
            }
        });
    });
    
    // Impede que clicar nos botões de editar abra/feche o leque
    container.querySelectorAll('.btn-edit').forEach(button => {
        button.addEventListener('click', (e) => {
            e.stopPropagation();
        });
    });
});