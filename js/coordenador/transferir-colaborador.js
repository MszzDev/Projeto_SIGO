// js/coordenador/transferir-colaborador.js
document.addEventListener('DOMContentLoaded', () => {

    const selectColaborador = document.getElementById('select-colaborador');
    const displayUnidadeAtual = document.getElementById('unidade-atual'); // MUDADO de input para display
    const selectNovaUnidade = document.getElementById('select-nova-unidade');
    const form = document.getElementById('transfer-form');

    // Lista de todas as unidades
    const todasUnidades = [
        "Jardim Ângela", "Capão Redondo", "Santo Amaro", "São Luis", 
        "Jardim Nakamura", "Morumbi", "Interlagos"
    ];

    // Pega todos os colaboradores do localStorage
    const listaColaboradores = JSON.parse(localStorage.getItem('sigo_colaboradores')) || [];

    // --- 1. Preenche o select de Colaboradores (MELHORADO) ---
    function carregarColaboradores() {
        selectColaborador.innerHTML = '<option value="" disabled selected>Selecione um colaborador...</option>';
        if (listaColaboradores.length === 0) {
            selectColaborador.innerHTML = '<option value="" disabled>Nenhum colaborador cadastrado</option>';
            return;
        }
        
        listaColaboradores.forEach(colab => {
            // Salva o ID e a unidade atual no próprio <option>
            // ATUALIZADO: Mostra o nome E a unidade atual no dropdown
            selectColaborador.innerHTML += 
                `<option value="${colab.id}" data-unidade-atual="${colab.unidade}">
                    ${colab.nome} (${colab.unidade})
                </option>`;
        });
    }

    // --- 2. Atualiza os campos quando um colaborador é selecionado ---
    selectColaborador.addEventListener('change', () => {
        const selectedOption = selectColaborador.options[selectColaborador.selectedIndex];
        const unidadeAtual = selectedOption.dataset.unidadeAtual;

        if (unidadeAtual) {
            // ATUALIZADO: Preenche a DIV
            displayUnidadeAtual.innerHTML = `<span style="font-weight: 500;">${unidadeAtual}</span>`;
            
            // Preenche o select de destino, escondendo a unidade atual
            selectNovaUnidade.innerHTML = '<option value="" disabled selected>Selecione a nova unidade...</option>';
            todasUnidades.forEach(unidade => {
                if (unidade !== unidadeAtual) { // Não deixa transferir para a mesma unidade
                    selectNovaUnidade.innerHTML += `<option value="${unidade}">${unidade}</option>`;
                }
            });
            selectNovaUnidade.disabled = false;
        } else {
            // ATUALIZADO: Limpa a DIV
            displayUnidadeAtual.innerHTML = '<span class="text-muted">Selecione um colaborador</span>';
            selectNovaUnidade.innerHTML = '<option value="" disabled selected>Aguardando colaborador...</option>';
            selectNovaUnidade.disabled = true;
        }
    });

    // --- 3. Processa o envio do formulário ---
    form.addEventListener('submit', (e) => {
        e.preventDefault();

        const colabId = Number(selectColaborador.value);
        const novaUnidade = selectNovaUnidade.value;

        if (!colabId || !novaUnidade) {
            alert("Por favor, selecione o colaborador e a nova unidade.");
            return;
        }

        // Encontra o colaborador na lista
        const colabIndex = listaColaboradores.findIndex(c => c.id === colabId);

        if (colabIndex === -1) {
            alert("Erro: Colaborador não encontrado.");
            return;
        }
        
        const nomeColaborador = listaColaboradores[colabIndex].nome;

        // Atualiza a unidade do colaborador
        listaColaboradores[colabIndex].unidade = novaUnidade;

        // Salva a lista inteira de volta no localStorage
        localStorage.setItem('sigo_colaboradores', JSON.stringify(listaColaboradores));

        // Sucesso
        alert(`O colaborador "${nomeColaborador}" foi transferido para a unidade "${novaUnidade}"!`);

        // Redireciona para a página de colaboradores (a transição suave vai pegar)
        window.location.href = 'colaboradores.html';
    });

    // --- Inicialização ---
    carregarColaboradores();
});