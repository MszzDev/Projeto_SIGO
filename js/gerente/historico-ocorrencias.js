// js/gerente/historico-ocorrencias.js
document.addEventListener('DOMContentLoaded', () => {

    const container = document.getElementById('accordion-container');
    if (!container) return;

    // Carrega os dados necessários
    const allUsers = JSON.parse(localStorage.getItem('sigo_colaboradores')) || [];
    const allUnidades = JSON.parse(localStorage.getItem('sigo_unidades')) || [];
    const allOcorrencias = JSON.parse(localStorage.getItem('sigo_ocorrencias')) || [];

    // Agrupa por Coordenador (mesma lógica do historico-prelecoes.js)
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
        const meusRegistros = allOcorrencias.filter(o => minhasUnidadesNomes.includes(o.unidade));
        const abertas = meusRegistros.filter(o => o.status === 'Aberta').length;

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
                            <span class="stat-value" style="color: var(--danger-color);">${abertas}</span>
                            <span class="stat-label">Abertas</span>
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
                // Filtra as ocorrências PELA UNIDADE
                const registros = allOcorrencias.filter(p => p.unidade === unidade.nome);
                
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
                                <thead> <tr> <th>Data</th> <th>Tipo</th> <th>Supervisor</th> <th>Status</th> <th>Descrição</th> </tr> </thead>
                                <tbody>
                    `;
                    registros.forEach(o => {
                        let statusClass = o.status === 'Aberta' ? 'badge-danger' : 'badge-success';
                        
                        htmlFinal += `
                            <tr>
                                <td>${o.data}</td>
                                <td>${o.tipo}</td>
                                <td>${o.supervisor}</td>
                                <td><span class="badge ${statusClass}">${o.status}</span></td>
                                <td title="${o.descricao}">${o.descricao.substring(0, 30)}...</td>
                            </tr>
                        `;
                    });
                    htmlFinal += `</tbody></table></div>`;
                } else {
                    htmlFinal += `<p class="no-data-message" style="margin: 10px 0;">Nenhum registro de ocorrência para esta unidade.</p>`;
                }
                htmlFinal += `</div></details>`;
            });
        } else {
            htmlFinal += `<p class="no-data-message">Este coordenador não possui unidades associadas.</p>`;
        }
        htmlFinal += `</div></details>`;
    });
    
    // Adiciona uma seção para ocorrências "Sem Coordenador"
    const unidadesSemCoordenador = [...new Set(allOcorrencias.map(o => o.unidade))]
                                    .filter(unidade => !allUnidades.find(u => u.nome === unidade));

    if(unidadesSemCoordenador.length > 0) {
         htmlFinal += `
            <details class="coordenador-card" open>
                <summary class="coordenador-summary">
                    <img src="../../img/perf.png" alt="Avatar" class="coordenador-avatar" style="filter: grayscale(100%); opacity: 0.6;">
                    <div>
                        <h3 class="coordenador-nome">Unidades não Atribuídas</h3>
                        <span class="coordenador-info">Ocorrências de unidades sem coordenador.</span>
                    </div>
                    <i class="fas fa-chevron-right leque-icon" style="margin-left: var(--spacing-md);"></i>
                </summary>
                <div class="coordenador-details">
        `;
        unidadesSemCoordenador.forEach(unidade => {
            const registros = allOcorrencias.filter(p => p.unidade === unidade);
             htmlFinal += `
                <details class="unidade-leque" open>
                    <summary class="unidade-summary">
                        <span><i class="fas fa-building"></i> ${unidade}</span>
                        <span>${registros.length} ${registros.length === 1 ? 'Registro' : 'Registros'} <i class="fas fa-chevron-right leque-icon"></i></span>
                    </summary>
                    <div class="unidade-registros">
                        <div class="table-responsive">
                            <table class="table">
                                <thead> <tr> <th>Data</th> <th>Tipo</th> <th>Supervisor</th> <th>Status</th> <th>Descrição</th> </tr> </thead>
                                <tbody>
            `;
            registros.forEach(o => {
                let statusClass = o.status === 'Aberta' ? 'badge-danger' : 'badge-success';
                htmlFinal += `
                    <tr>
                        <td>${o.data}</td>
                        <td>${o.tipo}</td>
                        <td>${o.supervisor}</td>
                        <td><span class="badge ${statusClass}">${o.status}</span></td>
                        <td title="${o.descricao}">${o.descricao.substring(0, 30)}...</td>
                    </tr>
                `;
            });
            htmlFinal += `</tbody></table></div></div></details>`;
        });
        htmlFinal += `</div></details>`;
    }

    container.innerHTML = htmlFinal;
});