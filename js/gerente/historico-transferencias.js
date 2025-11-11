// js/gerente/historico-transferencias.js
document.addEventListener('DOMContentLoaded', () => {

    const container = document.getElementById('transferencias-tbody');
    if (!container) return;

    const allTransferencias = JSON.parse(localStorage.getItem('sigo_transferencias')) || [];

    if (allTransferencias.length === 0) {
        container.innerHTML = `<tr><td colspan="4" class="text-muted text-center p-4">Nenhum registro de transferência encontrado.</td></tr>`;
        return;
    }

    let htmlFinal = '';
    allTransferencias.forEach(log => {
        htmlFinal += `
            <tr>
                <td>${log.colaboradorNome || 'N/A'}</td>
                <td>${log.data}</td>
                <td><span class="badge badge-secondary">${log.unidadeAntiga}</span></td>
                <td><span class="badge badge-success">${log.unidadeNova}</span></td>
            </tr>
        `;
    });

    container.innerHTML = htmlFinal;
});