document.addEventListener('DOMContentLoaded', () => {
    // --- Elementos ---
    const form = document.getElementById('report-form');
    const modalOverlay = document.getElementById('confirmation-modal');
    const openModalButton = document.getElementById('open-modal-button');
    const confirmSendButton = document.getElementById('confirm-send');
    const cancelSendButton = document.getElementById('cancel-send');
    const functionButtons = document.querySelectorAll('.js-toggle-function');
    const responsavelSelect = document.getElementById('responsavel');
    const tempMessage = document.getElementById('temp-message'); // Toast no topo

    // --- Funções de Toast ---
    function showToast(message, type = 'success', duration = 3000) {
        // Define cor baseada no tipo
        if (type === 'error') {
            tempMessage.classList.remove('success'); // Assume que 'success' é a cor padrão se existir
            tempMessage.classList.add('error');
            tempMessage.style.backgroundColor = 'var(--toast-error-bg, #f44336)'; // Usa variável ou fallback
        } else {
            tempMessage.classList.remove('error');
            tempMessage.classList.add('success');
            tempMessage.style.backgroundColor = 'var(--toast-success-bg, #4CAF50)';
        }

        tempMessage.textContent = message;
        tempMessage.classList.add('visible'); // Mostra o toast

        // Esconde após a duração
        setTimeout(() => {
            hideToast();
        }, duration);
    }

    function hideToast() {
        tempMessage.classList.remove('visible');
    }

     // --- Funções do Modal ---
    function showModal() {
        modalOverlay.classList.add('visible');
    }

    function hideModal() {
        modalOverlay.classList.remove('visible');
    }


    // --- Lógica de Toggle dos Botões de Função ---
    functionButtons.forEach(button => {
        button.addEventListener('click', () => {
            button.classList.toggle('selected'); // Adiciona/Remove a classe 'selected'
        });
    });

    // --- Função de Validação ---
    function validateForm() {
        const isResponsavelSelected = responsavelSelect.value !== "";
        const selectedFunctions = document.querySelectorAll('.js-toggle-function.selected');
        const isAnyFunctionSelected = selectedFunctions.length > 0;

        if (!isResponsavelSelected) {
            responsavelSelect.focus();
            showToast('Por favor, selecione o Responsável pela preleção.', 'error');
            return false;
        }
        if (!isAnyFunctionSelected) {
            // Focar no container dos botões pode ser complicado, apenas mostrar erro
            showToast('Por favor, marque pelo menos uma Função aplicável.', 'error');
            return false;
        }
        return true;
    }

    // --- Handlers de Eventos ---

    // 1. Abrir Modal (Validar antes)
    openModalButton.addEventListener('click', () => {
        if (validateForm()) {
            showModal();
        }
    });

    // 2. Fechar Modal (Cancelar)
    cancelSendButton.addEventListener('click', hideModal);

    // 3. Confirmar Envio
    confirmSendButton.addEventListener('click', () => {
        // Revalida rapidamente
        if (!validateForm()) {
            hideModal();
            return;
        }

        hideModal(); // Fecha o modal

        // --- PEGANDO DADOS DO FORMULÁRIO ---
        const unidade = document.querySelector('.form-card input[value="Jardim Ângela"]').value;
        const supervisor = document.querySelector('.form-card input[value="Victor Hugo F. Silva"]').value;
        const turno = document.querySelector('.form-card input[value="Manhã"]').value;
        const selectedResponsavel = responsavelSelect.options[responsavelSelect.selectedIndex].text;
        const selectedFunctionsText = Array.from(document.querySelectorAll('.js-toggle-function.selected'))
                                           .map(btn => btn.textContent.trim());

        // --- NOVA LÓGICA DE SALVAMENTO ---
        try {
            // Pega a lista de preleções existentes
            const prelecoesSalvas = localStorage.getItem('sigo_prelecoes');
            const listaPrelecoes = prelecoesSalvas ? JSON.parse(prelecoesSalvas) : [];

            // Cria o novo objeto de preleção
            const novaPrelecao = {
                id: Date.now(),
                titulo: `Preleção Diária (${new Date().toLocaleDateString('pt-BR')})`,
                responsavel: selectedResponsavel,
                cargo: 'Supervisor', // Assumindo que quem relata é o responsável
                data: new Date().toLocaleDateString('pt-BR'),
                status: 'Concluída',
                unidade: unidade,
                supervisor: supervisor, // Supervisor da unidade
                turno: turno,
                funcoes: selectedFunctionsText.join(', ')
            };

            // Adiciona a nova preleção no início da lista
            listaPrelecoes.unshift(novaPrelecao);

            // Salva a lista atualizada de volta no localStorage
            localStorage.setItem('sigo_prelecoes', JSON.stringify(listaPrelecoes));

            // Exibe a mensagem de sucesso no topo
            showToast('Relatório de Preleção enviado com sucesso!', 'success');

        } catch (error) {
            console.error("Falha ao salvar preleção:", error);
            showToast('Erro ao salvar preleção.', 'error');
        }


        // Limpar o formulário após o envio
        setTimeout(() => {
            form.reset(); // Limpa select e outros campos
            // Desmarcar botões de função
            document.querySelectorAll('.js-toggle-function.selected').forEach(btn => btn.classList.remove('selected'));
        }, 500); // Meio segundo de delay
    });

    // Ocultar modal ao clicar fora
    modalOverlay.addEventListener('click', (event) => {
        if (event.target === modalOverlay) {
            hideModal();
        }
    });
});