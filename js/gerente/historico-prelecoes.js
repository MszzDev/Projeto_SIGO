// js/gerente/historico-prelecoes.js
document.addEventListener('DOMContentLoaded', () => {

    const container = document.getElementById('accordion-container');
    if (!container) return;

    const allUsers = JSON.parse(localStorage.getItem('sigo_colaboradores')) || [];
    const allUnidades = JSON.parse(localStorage.getItem('sigo_unidades')) || [];
    const allPrelecoes = JSON.parse(localStorage.getItem('sigo_prelecoes')) || [];

    const coordenadores = allUsers.filter(u => u.cargo === 'Coordenador');
    if (coordenadores.length === 0) {
        container.innerHTML = `<p class="no-data-message">Nenhum coordenador cadastrado no sistema.</p>`;
        return;
    }

    let htmlFinal = '';

    coordenadores.forEach(cood => {
        // --- ATUALIZAÇÃO DA FOTO ---
        const iniciais = cood.nome ? cood.nome.substring(0, 2).toUpperCase() : '??';
        const avatarSrc = cood.foto_url
            ? cood.foto_url
            : `https://via.placeholder.com/40/003063/ffffff?text=${iniciais}`;

        const minhasUnidades = allUnidades.filter(u => u.coordenadorId == cood.id);

        htmlFinal += `
            <details class="coordenador-card">
                <summary class="coordenador-summary">
                    <img src="${avatarSrc}" alt="Avatar" class="coordenador-avatar">
                    <div>
                        <h3 class="coordenador-nome">${cood.nome}</h3>
                        <span class="coordenador-info">${cood.email || 'Sem email'}</span>
                    </div>
                    <i class="fas fa-chevron-right leque-icon"></i>
                </summary>
                <div class="coordenador-details">
        `;

        if (minhasUnidades.length > 0) {
            minhasUnidades.forEach(unidade => {
                const registros = allPrelecoes.filter(p => p.unidade === unidade.nome);
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
                                <thead> <tr> <th>Título</th> <th>Responsável</th> <th>Data</th> <th>Turno</th> </tr> </thead>
                                <tbody>
                    `;
                    registros.forEach(p => {
                        htmlFinal += `
                            <tr>
                                <td>${p.titulo}</td>
                                <td>${p.responsavel}</td>
                                <td>${p.data}</td>
                                <td>${p.turno || 'N/A'}</td>
                            </tr>
                        `;
                    });
                    htmlFinal += `</tbody></table></div>`;
                } else {
                    htmlFinal += `<p class="no-data-message" style="margin: 10px 0;">Nenhum registro de preleção para esta unidade.</p>`;
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