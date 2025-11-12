// js/gerente/historico-solicitacoes.js
document.addEventListener('DOMContentLoaded', () => {

    const container = document.getElementById('accordion-container');
    if (!container) return;

    const allUsers = JSON.parse(localStorage.getItem('sigo_colaboradores')) || [];
    const allUnidades = JSON.parse(localStorage.getItem('sigo_unidades')) || [];
    const allSolicitacoes = JSON.parse(localStorage.getItem('sigo_solicitacoes')) || [];

    const coordenadores = allUsers.filter(u => u.cargo === 'Coordenador');
    if (coordenadores.length === 0) {
        container.innerHTML = `<p class="no-data-message">Nenhum coordenador cadastrado no sistema.</p>`;
        return;
    }

    let htmlFinal = '';

    coordenadores.forEach(cood => {
        // --- PADRONIZAÇÃO DA FOTO ---
        const avatarSrc = cood.foto_url
            ? cood.foto_url
            : '../../img/perf.png';
        
        const minhasUnidades = allUnidades.filter(u => u.coordenadorId == cood.id);
        const minhasUnidadesNomes = minhasUnidades.map(u => u.nome);
        
        // Calcula estatísticas
        const meusRegistros = allSolicitacoes.filter(s => minhasUnidadesNomes.includes(s.unidade));
        const pendentes = meusRegistros.filter(s => s.status === 'Pendente').length;

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
                            <span class="stat-value" style="color: var(--warning-color);">${pendentes}</span>
                            <span class="stat-label">Pendentes</span>
                        </div>
                        <div class="stat-item">
                            <span class="stat-value">${meusRegistros.length}</span>
                            <span class="stat-label">Total</span>
                        </div>
                    </div>
                    <i class="fas fa-chevron-right leque-icon" style="margin-left: var(--spacing-md);"></i>
                </summary>
                <div class="coordenador-details">
        `;

        if (minhasUnidades.length > 0) {
            minhasUnidades.forEach(unidade => {
                const registros = allSolicitacoes.filter(s => s.unidade === unidade.nome);
                htmlFinal += `
                    <details class="unidade-leque">
                        <summary class="unidade-summary">
                            <span><i class="fas fa-building"></i> ${unidade.nome}</span>
                            <span>${registros.length} ${registros.length === 1 ? 'Registro' : 'Registros'} <i class="fas fa-chevron-right leque-icon"></i></span>
                        </summary>
                        <div class="unidade-registros">
                `;
                if (registros.length > 0) {
                    htmlFinal += `
                        <div class="table-responsive">
                            <table class="table">
                                <thead> <tr> <th>Solicitante</th> <th>Data</th> <th>Período</th> <th>Status</th> </tr> </thead>
                                <tbody>
                    `;
                    registros.forEach(s => {
                        let statusClass = s.status === 'Aprovado' ? 'badge-success' : (s.status === 'Recusado' ? 'badge-danger' : 'badge-warning');
                        htmlFinal += `
                            <tr>
                                <td>${s.solicitante}</td>
                                <td>${s.data}</td>
                                <td>${s.periodo}</td>
                                <td><span class="badge ${statusClass}">${s.status}</span></td>
                            </tr>
                        `;
                    });
                    htmlFinal += `</tbody></table></div>`;
                } else {
                    htmlFinal += `<p class="no-data-message" style="margin: 10px 0;">Nenhum registro de solicitação para esta unidade.</p>`;
                }
                htmlFinal += `</div></details>`;
            });
        } else {
            htmlFinal += `<p class="no-data-message">Este coordenador não possui unidades associadas.</p>`;
        }
        htmlFinal += `</div></details>`;
    });
    container.innerHTML = htmlFinal;
});