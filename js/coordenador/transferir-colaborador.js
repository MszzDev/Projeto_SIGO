// js/coordenador/transferir-colaborador.js
document.addEventListener('DOMContentLoaded', () => {

    const selectColaborador = document.getElementById('select-colaborador');
    const displayUnidadeAtual = document.getElementById('unidade-atual');
    const selectNovaUnidade = document.getElementById('select-nova-unidade');
    const form = document.getElementById('transfer-form');

    // 1. Pega o Coordenador logado
    const userLogado = JSON.parse(sessionStorage.getItem('sigo_user_logado'));

    // 2. Carrega todos os dados
    const allUnidades = JSON.parse(localStorage.getItem('sigo_unidades')) || [];
    const allColaboradores = JSON.parse(localStorage.getItem('sigo_colaboradores')) || [];
    const listaTransferencias = JSON.parse(localStorage.getItem('sigo_transferencias')) || [];

    // 3. Filtra as unidades e colaboradores DESTE coordenador
    const minhasUnidades = (userLogado)
        ? allUnidades.filter(u => u.coordenadorId == userLogado.id)
        : [];
    const minhasUnidadesNomes = minhasUnidades.map(u => u.nome);
    const minhaEquipe = allColaboradores.filter(c => minhasUnidadesNomes.includes(c.unidade));

    // --- 1. Preenche o select de Colaboradores ---
    function carregarColaboradores() {
        selectColaborador.innerHTML = '<option value="" disabled selected>Selecione um colaborador...</option>';
        if (minhaEquipe.length === 0) {
            selectColaborador.innerHTML = '<option value="" disabled>Nenhum colaborador na sua equipe</option>';
            return;
        }
        
        minhaEquipe.forEach(colab => {
            selectColaborador.innerHTML += 
                `<option value="${colab.id}" data-unidade-atual="${colab.unidade}" data-nome="${colab.nome}">
                    ${colab.nome} (${colab.unidade})
                </option>`;
        });
    }

    // --- 2. Preenche o select de Unidades de Destino ---
    function carregarUnidadesDestino(unidadeAtual) {
        selectNovaUnidade.innerHTML = '<option value="" disabled selected>Selecione a nova unidade...</option>';
        
        // Permite transferir para QUALQUER unidade do sistema (não apenas as minhas)
        const todasUnidadesSistema = allUnidades.map(u => u.nome);
        
        todasUnidadesSistema.forEach(unidade => {
            if (unidade !== unidadeAtual) { // Não deixa transferir para a mesma unidade
                selectNovaUnidade.innerHTML += `<option value="${unidade}">${unidade}</option>`;
            }
        });
        selectNovaUnidade.disabled = false;
    }

    // --- 3. Evento de mudança no colaborador ---
    selectColaborador.addEventListener('change', () => {
        const selectedOption = selectColaborador.options[selectColaborador.selectedIndex];
        const unidadeAtual = selectedOption.dataset.unidadeAtual;

        if (unidadeAtual) {
            displayUnidadeAtual.innerHTML = `<span style="font-weight: 500;">${unidadeAtual}</span>`;
            carregarUnidadesDestino(unidadeAtual);
        } else {
            displayUnidadeAtual.innerHTML = '<span class="text-muted">Selecione um colaborador</span>';
            selectNovaUnidade.innerHTML = '<option value="" disabled selected>Aguardando colaborador...</option>';
            selectNovaUnidade.disabled = true;
        }
    });

    // --- 4. Processa o envio do formulário ---
    form.addEventListener('submit', (e) => {
        e.preventDefault();

        const selectedOption = selectColaborador.options[selectColaborador.selectedIndex];
        const colabId = Number(selectedOption.value);
        const novaUnidade = selectNovaUnidade.value;
        const unidadeAntiga = selectedOption.dataset.unidadeAtual;
        const nomeColaborador = selectedOption.dataset.nome;

        if (!colabId || !novaUnidade) {
            alert("Por favor, selecione o colaborador e a nova unidade.");
            return;
        }

        // Procura em TODOS os colaboradores (não apenas na minha equipe)
        const colabIndex = allColaboradores.findIndex(c => c.id === colabId);
        if (colabIndex === -1) {
            alert("Erro: Colaborador não encontrado.");
            return;
        }
        
        // Atualiza o colaborador
        allColaboradores[colabIndex].unidade = novaUnidade;
        localStorage.setItem('sigo_colaboradores', JSON.stringify(allColaboradores));

        // Salva o log da transferência
        const logTransferencia = {
            id: Date.now(),
            colaboradorId: colabId,
            colaboradorNome: nomeColaborador,
            unidadeAntiga: unidadeAntiga,
            unidadeNova: novaUnidade,
            data: new Date().toLocaleDateString('pt-BR'),
            coordenadorId: userLogado.id // Salva quem fez a transferência
        };
        listaTransferencias.unshift(logTransferencia);
        localStorage.setItem('sigo_transferencias', JSON.stringify(listaTransferencias));

        alert(`O colaborador "${nomeColaborador}" foi transferido para a unidade "${novaUnidade}"!`);
        window.location.href = 'colaboradores.html';
    });

    // --- Inicialização ---
    carregarColaboradores();
});