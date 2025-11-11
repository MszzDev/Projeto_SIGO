// js/common/populate-coordenadores.js
document.addEventListener('DOMContentLoaded', () => {
    const selectCoordenador = document.getElementById('coordenadorId');
    if (!selectCoordenador) return; // Se não houver dropdown, não faz nada

    const users = JSON.parse(localStorage.getItem('sigo_colaboradores')) || [];
    const coordenadores = users.filter(u => u.cargo === 'Coordenador');

    // Guarda as opções originais (ex: "Selecione..." e "Nenhum")
    const originalOptions = Array.from(selectCoordenador.options);

    // Limpa o select, mas mantém as opções originais
    selectCoordenador.innerHTML = originalOptions.map(op => op.outerHTML).join('');

    if (coordenadores.length === 0) {
        selectCoordenador.options[1].disabled = true; // Desativa "Nenhum" se houver
    } else {
        selectCoordenador.options[1].disabled = false; // Ativa "Nenhum"
        coordenadores.forEach(cood => {
            // Adiciona o ID no value e o Nome no texto
            const option = new Option(cood.nome, cood.id); 
            selectCoordenador.add(option);
        });
    }
});