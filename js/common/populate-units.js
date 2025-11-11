// js/common/populate-units.js
document.addEventListener('DOMContentLoaded', () => {
    const selectUnidade = document.getElementById('unidade');
    if (!selectUnidade) return; // Se não houver dropdown de unidade, não faz nada

    // 1. Pega unidades da lista 'sigo_unidades' (lista mestre oficial)
    const unidadesSalvas = JSON.parse(localStorage.getItem('sigo_unidades')) || [];
    const nomesUnidadesMestre = unidadesSalvas.map(u => u.nome);

    // 2. Pega unidades da lista 'sigo_colaboradores' (para garantir que antigas apareçam)
    const users = JSON.parse(localStorage.getItem('sigo_colaboradores')) || [];
    const nomesUnidadesStaff = users.map(u => u.unidade).filter(u => u && u !== 'N/A');

    // 3. Junta tudo, remove duplicadas e ordena
    const allUnitNames = [...new Set([...nomesUnidadesMestre, ...nomesUnidadesStaff])];
    allUnitNames.sort(); // Ordena alfabeticamente

    // 4. Guarda a opção "N/A"
    let optionsHtml = '<option value="N/A">N/A (Ex: Coordenador)</option>';
    
    // Verifica se o select tem uma opção "disabled" (Ex: "Selecione...")
    const disabledOption = selectUnidade.querySelector('option[disabled]');
    if (disabledOption) {
        optionsHtml = disabledOption.outerHTML + optionsHtml; // Mantém ela no topo
    }

    // 5. Adiciona as unidades
    allUnitNames.forEach(unitName => {
        optionsHtml += `<option value="${unitName}">${unitName}</option>`;
    });

    selectUnidade.innerHTML = optionsHtml;
});