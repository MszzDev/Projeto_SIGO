// js/common/populate-coordenadores.js
document.addEventListener('DOMContentLoaded', () => {
    // ATUALIZADO: Procura por todos os selects com a classe
    const selectCoordenadores = document.querySelectorAll('.coordenador-select');
    if (selectCoordenadores.length === 0) return; // Se não houver dropdown, não faz nada

    const users = JSON.parse(localStorage.getItem('sigo_colaboradores')) || [];
    const coordenadores = users.filter(u => u.cargo === 'Coordenador');

    // Cria o HTML das opções
    let optionsHtml = '';
    if (coordenadores.length > 0) {
        coordenadores.forEach(cood => {
            // Adiciona o ID no value e o Nome no texto
            optionsHtml += `<option value="${cood.id}">${cood.nome}</option>`;
        });
    }

    // ATUALIZADO: Itera sobre cada dropdown encontrado e adiciona as opções
    selectCoordenadores.forEach(select => {
        const originalOption = select.innerHTML; // Salva o "Nenhum" ou "Selecione..."
        select.innerHTML = originalOption + optionsHtml;
    });
});