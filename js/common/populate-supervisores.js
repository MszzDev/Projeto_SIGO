// js/common/populate-supervisores.js
document.addEventListener('DOMContentLoaded', () => {
    
    // Procura por todos os selects com a classe
    const selectSupervisores = document.querySelectorAll('.supervisor-select');
    if (selectSupervisores.length === 0) return; 

    const users = JSON.parse(localStorage.getItem('sigo_colaboradores')) || [];
    const supervisores = users.filter(u => u.cargo === 'Supervisor');

    // Cria o HTML das opções
    let optionsHtml = '';
    if (supervisores.length > 0) {
        supervisores.forEach(sup => {
            // Adiciona o ID no value e o Nome no texto
            optionsHtml += `<option value="${sup.id}">${sup.nome}</option>`;
        });
    }

    // Itera sobre cada dropdown encontrado (Manhã, Tarde, Noite) e adiciona as opções
    selectSupervisores.forEach(select => {
        const originalOption = select.innerHTML; // Salva o "Nenhum"
        select.innerHTML = originalOption + optionsHtml;
    });
});