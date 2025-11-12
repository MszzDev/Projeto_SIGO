// js/gerente/unidades.js
document.addEventListener('DOMContentLoaded', () => {

    const container = document.getElementById('unidades-container');
    if (!container) return;

    const allUsers = JSON.parse(localStorage.getItem('sigo_colaboradores')) || [];
    const allUnidades = JSON.parse(localStorage.getItem('sigo_unidades')) || [];

    allUnidades.sort((a, b) => a.nome.localeCompare(b.nome));

    let htmlFinal = '';

    if (allUnidades.length === 0) {
        htmlFinal = `<p class="no-users-message" style="width: 100%;">Nenhuma unidade encontrada. Comece clicando em "Adicionar Unidade".</p>`;
        container.innerHTML = htmlFinal;
        return;
    }

    allUnidades.forEach(unitData => {
        const unitName = unitData.nome;
        // Conta supervisores e colaboradores da forma antiga (pelo cadastro do colaborador)
        const supervisores = allUsers.filter(u => u.unidade === unitName && u.cargo === 'Supervisor').length;
        const colaboradores = allUsers.filter(u => u.unidade === unitName && u.cargo === 'Colaborador').length;

        // --- LÓGICA ATUALIZADA ---
        let localizacao = 'Não informado';
        
        // Define a localização
        if (unitData.cidade && unitData.uf) {
            localizacao = `${unitData.cidade} - ${unitData.uf}`;
        } else if (unitData.bairro) {
            localizacao = unitData.bairro;
        } else if (unitData.cep) {
            localizacao = unitData.cep;
        }

        // Conta o coordenador
        const coordCount = (unitData.coordenadorId && unitData.coordenadorId !== "Nenhum") ? 1 : 0;
        // --- FIM DA LÓGICA ATUALIZADA ---

        // ATUALIZADO: Link agora usa ?id=
        htmlFinal += `
            <a href="unidade-detalhe.html?id=${unitData.id}" class="col-card">
                <div class="unit-card">
                    <h3 class="unit-card-title">${unitName}</h3>
                    <span class="unit-card-code">${localizacao}</span> 
                    
                    <div class="unit-card-staff">
                        <span>${coordCount}</span> Coord. / <span>${supervisores}</span> Sup. / <span>${colaboradores}</span> Colab.
                    </div>
                </div>
            </a>
        `;
    });
    container.innerHTML = htmlFinal;
});