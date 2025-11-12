// js/common/populate-units.js
document.addEventListener('DOMContentLoaded', () => {
    const selectUnidade = document.getElementById('unidade');
    if (!selectUnidade) return; // Se não houver dropdown de unidade, não faz nada

    // 1. Pega unidades da lista 'sigo_unidades' (lista mestre oficial)
    const unidadesSalvas = JSON.parse(localStorage.getItem('sigo_unidades')) || [];
    
    // 2. Ordena alfabeticamente
    unidadesSalvas.sort((a, b) => a.nome.localeCompare(b.nome));

    // 3. Guarda a opção "N/A" ou a opção "Selecione..."
    let optionsHtml = '';
    const defaultOption = selectUnidade.querySelector('option[value="N/A"]') 
                       || selectUnidade.querySelector('option[disabled]');
                       
    if (defaultOption) {
        optionsHtml = defaultOption.outerHTML;
    }

    // 4. Adiciona as unidades
    unidadesSalvas.forEach(unit => {
        optionsHtml += `<option value="${unit.nome}">${unit.nome}</option>`;
    });

    selectUnidade.innerHTML = optionsHtml;
});