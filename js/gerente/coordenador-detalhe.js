// js/gerente/coordenador-detalhe.js
document.addEventListener('DOMContentLoaded', () => {

    // 1. Pegar ID do Coordenador da URL
    const params = new URLSearchParams(window.location.search);
    const coordenadorId = Number(params.get('id'));

    const container = document.getElementById('unidades-do-coordenador-container');
    const nomeEl = document.getElementById('coordenador-nome');
    const subtituloEl = document.getElementById('coordenador-subtitulo');

    if (!coordenadorId || !container || !nomeEl) {
        if (nomeEl) nomeEl.textContent = "Erro";
        if (subtituloEl) subtituloEl.textContent = "ID do Coordenador não encontrado na URL.";
        return;
    }

    // 2. Carregar todos os dados
    const allUsers = JSON.parse(localStorage.getItem('sigo_colaboradores')) || [];
    const allUnidades = JSON.parse(localStorage.getItem('sigo_unidades')) || [];

    // 3. Encontrar o Coordenador
    const coordenador = allUsers.find(u => u.id === coordenadorId);
    if (!coordenador) {
        nomeEl.textContent = "Erro";
        subtituloEl.textContent = `Coordenador com ID ${coordenadorId} não encontrado.`;
        return;
    }

    // 4. Preencher o cabeçalho
    nomeEl.textContent = coordenador.nome;
    subtituloEl.textContent = `Unidades e equipe gerenciadas por ${coordenador.nome.split(' ')[0]}.`;

    // 5. Encontrar as Unidades deste Coordenador
    // (Usa '==' para comparar ID salvo como string ou número)
    const minhasUnidades = allUnidades.filter(u => u.coordenadorId == coordenadorId);

    if (minhasUnidades.length === 0) {
        container.innerHTML = `<p class="no-users-message">Este coordenador não está associado a nenhuma unidade.</p>`;
        return;
    }

    // 6. Para cada Unidade, encontrar a equipe
    let htmlFinal = '';
    minhasUnidades.forEach(unidade => {
        // Encontra Supervisores e Colaboradores desta unidade
        const equipe = allUsers.filter(u => 
            u.unidade === unidade.nome && (u.cargo === 'Supervisor' || u.cargo === 'Colaborador')
        );

        htmlFinal += `
            <div class="unit-group">
                <h4 class="unit-group-header">
                    <i class="fas fa-building"></i>
                    ${unidade.nome} (Equipe: ${equipe.length})
                </h4>
        `;

        if (equipe.length === 0) {
            htmlFinal += `<p class="no-users-message" style="margin-top: -10px;">Nenhum supervisor ou colaborador nesta unidade.</p>`;
        } else {
            htmlFinal += `
                <div class="card">
                    <div class="card-body">
                        <div class="table-responsive">
                            <table class="table table-hover">
                                <thead>
                                    <tr>
                                        <th>Nome</th>
                                        <th>Cargo</th>
                                        <th>Turno</th>
                                        <th>ID</th>
                                        <th>Ações</th>
                                    </tr>
                                </thead>
                                <tbody>
            `;
            equipe.forEach(user => {
                const avatar = user.nome ? user.nome.substring(0, 2).toUpperCase() : '??';
                const badgeClass = user.cargo === 'Supervisor' ? 'badge-supervisor' : 'badge-colaborador';
                htmlFinal += `
                    <tr>
                        <td>
                            <img src="https://via.placeholder.com/32/1a3a52/ffffff?text=${avatar}" alt="Avatar" class="user-avatar">
                            <span>${user.nome}<small class="d-block text-muted">${user.email || ''}</small></span>
                        </td>
                        <td><span class="badge ${badgeClass}">${user.cargo}</span></td>
                        <td>${user.periodo || 'N/A'}</td>
                        <td>${user.id_usuario || 'N/A'}</td>
                        <td>
                            <a href="editar-usuario.html?id=${user.id}" class="btn btn-sm btn-outline-primary" title="Editar">
                                <i class="fas fa-pencil-alt"></i>
                            </a>
                        </td>
                    </tr>
                `;
            });
            htmlFinal += `</tbody></table></div></div></div>`;
        }
        htmlFinal += `</div>`; // Fecha .unit-group
    });

    container.innerHTML = htmlFinal;
});