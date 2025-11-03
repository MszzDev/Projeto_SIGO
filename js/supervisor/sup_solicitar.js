document.addEventListener('DOMContentLoaded', () => {

    // --- Elementos ---
    const form = document.getElementById('solicitation-form');
    const triggerBtn = document.getElementById('trigger-solicitar-btn');
    const modal = document.getElementById('confirmation-modal');
    const cancelBtn = document.getElementById('cancel-send-btn');
    const confirmBtn = document.getElementById('confirm-send-btn');
    const successToast = document.getElementById('success-message');
    const errorToast = document.getElementById('error-message'); // Adicionado para erros

    // --- Funções de Toast ---
    function showToast(element, message, duration = 3000) {
        element.textContent = message;
        element.classList.add('visible');
        setTimeout(() => {
            hideToast(element);
        }, duration);
    }

    function hideToast(element) {
        element.classList.remove('visible');
    }

    // --- Funções do Modal ---
    function showModal() {
        modal.classList.add('visible');
    }

    function hideModal() {
        modal.classList.remove('visible');
    }

    // --- Validação e Coleta de Dados ---
    function getFormData() {
        const data = {
            // Campos readonly são pegos pelo value, que deve estar correto no HTML
            unidade: document.getElementById('unidade').value.trim(),
            supervisor: document.getElementById('supervisor').value.trim(),
            turno: document.getElementById('turno').value.trim(),
            // Campos preenchidos pelo usuário
            colaborador: document.getElementById('colaborador').value.trim(),
            horaInicio: document.getElementById('hora-inicio').value,
            horaFim: document.getElementById('hora-fim').value,
            motivo: document.getElementById('motivo').value.trim()
        };

        const requiredFields = [
            // Readonly fields are pre-filled, focus on user inputs
            { key: 'colaborador', label: 'Quantidade de Colaboradores', elementId: 'colaborador' },
            { key: 'horaInicio', label: 'Hora de Início', elementId: 'hora-inicio' },
            { key: 'horaFim', label: 'Hora de Fim', elementId: 'hora-fim' },
            { key: 'motivo', label: 'Motivo', elementId: 'motivo' }
        ];

        // Validação de campos obrigatórios
        for (const field of requiredFields) {
            if (!data[field.key]) { // Verifica se está vazio ou é null/undefined
                showToast(errorToast, `Erro: O campo '${field.label}' é obrigatório.`);
                document.getElementById(field.elementId)?.focus(); // Opcional: focar no campo
                return null; // Indica erro
            }
        }

        // Validação específica de quantidade (deve ser número positivo)
        const colaboradores = parseInt(data.colaborador);
        if (isNaN(colaboradores) || colaboradores <= 0) {
            showToast(errorToast, 'Erro: A quantidade de colaboradores deve ser um número positivo.');
            document.getElementById('colaborador')?.focus();
            return null;
        }

        // Validação básica de hora (só verifica se foram selecionados)
        if (data.horaInicio === "" || data.horaFim === "") {
             showToast(errorToast, 'Erro: Selecione Hora de Início e Fim.');
             // Poderia focar no primeiro select vazio
             return null;
        }

        // Validação adicional (opcional): verificar se hora fim > hora início
        // (Isso pode ser mais complexo dependendo dos formatos)

        return data; // Retorna dados se válidos
    }

    // --- Handlers de Eventos ---

    // Botão "Solicitar": Valida e abre o modal
    triggerBtn.addEventListener('click', () => {
        const data = getFormData(); // Tenta obter e validar os dados
        if (data) {
            showModal(); // Se válido, mostra modal de confirmação
        }
    });

    // Botão "Cancelar" no modal: Fecha o modal
    cancelBtn.addEventListener('click', hideModal);

   // Botão "Confirmar" no modal: Processa o envio
    confirmBtn.addEventListener('click', () => {
        const data = getFormData(); // Revalida
        if (data) {
            // 1. Esconde o modal
            hideModal();

            // 2. ***** NOVA LÓGICA DE SALVAMENTO *****
            try {
                // Pega a lista de solicitações existentes (ou cria uma nova)
                const solicitacoesSalvas = localStorage.getItem('sigo_solicitacoes');
                const listaSolicitacoes = solicitacoesSalvas ? JSON.parse(solicitacoesSalvas) : [];

                // Adiciona um ID único e data/status à nova solicitação
                const novaSolicitacao = {
                    id: Date.now(), // ID único baseado no tempo
                    solicitante: data.supervisor,
                    cargo: 'Supervisor',
                    unidade: data.unidade,
                    turno: data.turno,
                    qtd: data.colaborador,
                    periodo: `${data.horaInicio} às ${data.horaFim}`,
                    motivo: data.motivo,
                    data: new Date().toLocaleDateString('pt-BR'), // Data de hoje
                    status: 'Pendente' // Status inicial
                };

                // Adiciona a nova solicitação no início da lista
                listaSolicitacoes.unshift(novaSolicitacao);

                // Salva a lista atualizada de volta no localStorage
                localStorage.setItem('sigo_solicitacoes', JSON.stringify(listaSolicitacoes));
                
                // 3. Exibe mensagem de sucesso
                showToast(successToast, 'Solicitação enviada com sucesso!');

            } catch (error) {
                console.error("Falha ao salvar no localStorage:", error);
                showToast(errorToast, 'Erro ao salvar solicitação.');
            }
            
            // 4. Limpa o formulário após um pequeno atraso
            setTimeout(() => {
                form.reset(); 
            }, 500); 

        } else {
             hideModal(); 
        }
    });

});