// js/gerente/unidades.js
document.addEventListener('DOMContentLoaded', () => {

    const container = document.getElementById('unidades-container');
    if (!container) return;

    const allUsers = JSON.parse(localStorage.getItem('sigo_colaboradores')) || [];
    const allUnidades = JSON.parse(localStorage.getItem('sigo_unidades')) || [];
    const registeredUnidades = allUnidades.map(u => u.nome);
    const staffUnidades = allUsers.map(u => u.unidade).filter(u => u && u !== 'N/A');
    const allUnitNames = [...new Set([...registeredUnidades, ...staffUnidades])];
    allUnitNames.sort();

    let htmlFinal = '';

    if (allUnitNames.length === 0) {
        htmlFinal = `<p class="no-users-message" style="width: 100%;">Nenhuma unidade encontrada. Comece clicando em "Adicionar Unidade".</p>`;
        container.innerHTML = htmlFinal;
        return;
    }

    allUnitNames.forEach(unitName => {
        const unitData = allUnidades.find(u => u.nome === unitName);
        const supervisores = allUsers.filter(u => u.unidade === unitName && u.cargo === 'Supervisor').length;
        const colaboradores = allUsers.filter(u => u.unidade === unitName && u.cargo === 'Colaborador').length;

        // *** CORREÇÃO DO LINK ***
        // Aponta para 'unidade-detalhe.html' dentro da pasta 'gerente/'
        htmlFinal += `
            <a href="unidade-detalhe.html?unidade=${encodeURIComponent(unitName)}" class="col-card">
                <div class="unit-card">
                    <h3 class="unit-card-title">${unitName}</h3>
                    <span class="unit-card-code">#${unitData?.codigo || 'N/A'}</span>
                    
                    <div class="unit-card-staff">
                        <span>${supervisores}</span> Sup. / <span>${colaboradores}</span> Colab.
                    </div>
                </div>
            </a>
        `;
    });
    container.innerHTML = htmlFinal;
});