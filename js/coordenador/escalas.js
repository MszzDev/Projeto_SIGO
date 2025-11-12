// js/coordenador/escalas.js
document.addEventListener('DOMContentLoaded', () => {

    // --- 1. Elementos do DOM ---
    const selectUnidade = document.getElementById('select-unidade');
    const scheduleContainer = document.getElementById('schedule-container');
    const scheduleTitle = document.getElementById('schedule-title');
    const scheduleActions = document.getElementById('schedule-actions');
    const btnSave = document.getElementById('btn-save-schedule');

    // --- 2. Carregar Dados ---
    const userLogado = JSON.parse(sessionStorage.getItem('sigo_user_logado'));
    const allUnidades = JSON.parse(localStorage.getItem('sigo_unidades')) || [];
    const allColaboradores = JSON.parse(localStorage.getItem('sigo_colaboradores')) || [];
    const sigoEscalas = JSON.parse(localStorage.getItem('sigo_escalas')) || {};

    let minhasUnidades = [];
    let minhaEquipe = {}; // Objeto para guardar a equipe por unidade
    let unidadeSelecionada = "";

    // --- 3. Inicialização ---
    function init() {
        if (!userLogado || userLogado.cargo !== 'Coordenador') {
            scheduleContainer.innerHTML = '<p class="text-muted">Erro: Perfil de coordenador não encontrado.</p>';
            return;
        }

        minhasUnidades = allUnidades.filter(u => u.coordenadorId == userLogado.id);
        
        if (minhasUnidades.length === 0) {
            selectUnidade.innerHTML = '<option value="" disabled selected>Nenhuma unidade associada</option>';
            return;
        }

        // Popula o <select> de unidades
        selectUnidade.innerHTML = '<option value="" disabled selected>Selecione uma unidade</option>';
        minhasUnidades.forEach(unit => {
            selectUnidade.innerHTML += `<option value="${unit.nome}">${unit.nome}</option>`;
            
            // Pré-carrega a equipe de cada unidade
            minhaEquipe[unit.nome] = allColaboradores.filter(c => 
                c.unidade === unit.nome && (c.cargo === 'Supervisor' || c.cargo === 'Colaborador')
            );
        });

        // Adiciona Event Listeners
        selectUnidade.addEventListener('change', handleUnidadeChange);
        btnSave.addEventListener('click', saveEscala);
    }

    // --- 4. Handler de Mudança de Unidade ---
    function handleUnidadeChange(e) {
        unidadeSelecionada = e.target.value;
        if (!unidadeSelecionada) return;

        scheduleTitle.textContent = `Escala Semanal - ${unidadeSelecionada}`;
        renderEscala(unidadeSelecionada);
        scheduleActions.style.display = 'block';
    }

    // --- 5. Renderizar a Grade da Escala ---
    function renderEscala(unidadeNome) {
        const equipe = minhaEquipe[unidadeNome] || [];
        const escalaDaUnidade = sigoEscalas[unidadeNome] || {};
        
        // MODIFICADO: Arrays de 7 dias
        const dias = ['seg', 'ter', 'qua', 'qui', 'sex', 'sab', 'dom'];
        const diasLabel = ['Segunda-feira', 'Terça-feira', 'Quarta-feira', 'Quinta-feira', 'Sexta-feira', 'Sábado', 'Domingo'];
        const turnos = ['manha', 'tarde', 'noite'];
        const turnosLabel = ['Manhã', 'Tarde', 'Noite'];

        let gridHtml = '';

        dias.forEach((dia, index) => {
            gridHtml += `<div class="day-column">
                            <div class="day-header">${diasLabel[index]}</div>`;
            
            turnos.forEach(turno => {
                const turnoLabel = turnosLabel[turnos.indexOf(turno)];
                const selectId = `${dia}-${turno}`; // Ex: "seg-manha"
                const selecionados = escalaDaUnidade[selectId] || []; // IDs dos selecionados
                
                gridHtml += `<div class="shift-box">
                                <label class="shift-title" for="${selectId}">${turnoLabel}</label>
                                <select id="${selectId}" class="form-control shift-select" multiple>`;
                
                // Adiciona opções (colaboradores)
                equipe.forEach(colab => {
                    // Verifica se o ID do colaborador está na lista de selecionados
                    const isSelected = selecionados.includes(colab.id.toString());
                    gridHtml += `<option value="${colab.id}" ${isSelected ? 'selected' : ''}>
                                    ${colab.nome} (${colab.cargo.substring(0,3)})
                                 </option>`;
                });

                gridHtml += `</select></div>`;
            });
            gridHtml += `</div>`; // Fim da .day-column
        });

        scheduleContainer.innerHTML = gridHtml;
    }

    // --- 6. Salvar Escala ---
    function saveEscala() {
        if (!unidadeSelecionada) return;

        const novaEscalaDaUnidade = {};
        // MODIFICADO: Array de 7 dias
        const dias = ['seg', 'ter', 'qua', 'qui', 'sex', 'sab', 'dom'];
        const turnos = ['manha', 'tarde', 'noite'];

        dias.forEach(dia => {
            turnos.forEach(turno => {
                const selectId = `${dia}-${turno}`;
                const selectElement = document.getElementById(selectId);
                
                // Pega todos os options selecionados e extrai os IDs
                const selecionados = Array.from(selectElement.selectedOptions).map(opt => opt.value);
                novaEscalaDaUnidade[selectId] = selecionados;
            });
        });

        // Atualiza o objeto principal de escalas
        sigoEscalas[unidadeSelecionada] = novaEscalaDaUnidade;

        // Salva de volta no localStorage
        try {
            localStorage.setItem('sigo_escalas', JSON.stringify(sigoEscalas));
            alert(`Escala da unidade ${unidadeSelecionada} salva com sucesso!`);
        } catch (error) {
            console.error("Erro ao salvar escala:", error);
            alert("Erro ao salvar escala. Verifique o console.");
        }
    }

    // --- Iniciar ---
    init();
});