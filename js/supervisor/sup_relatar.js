// js/supervisor/sup_relatar.js
document.addEventListener('DOMContentLoaded', () => {
    
    const form = document.getElementById('report-form');
    const modalOverlay = document.getElementById('confirmation-modal');
    const openModalButton = document.getElementById('open-modal-button');
    const confirmSendButton = document.getElementById('confirm-send');
    const cancelSendButton = document.getElementById('cancel-send');
    const functionButtons = document.querySelectorAll('.js-toggle-function');
    const responsavelSelect = document.getElementById('responsavel');
    const tempMessage = document.getElementById('temp-message');

    //  1. pega dados do sup logado
    const userLogado = JSON.parse(sessionStorage.getItem('sigo_user_logado'));
    
    const inputUnidade = document.getElementById('unidade');
    const inputSupervisor = document.getElementById('supervisor');
    const inputTurno = document.getElementById('turno');

    if (!userLogado || userLogado.cargo !== 'Supervisor') {
        showToast('Erro: Perfil de supervisor não encontrado.', 'error');
        if(openModalButton) openModalButton.disabled = true;
    } else {
        //  2. preenche o formulário 
        if (inputUnidade) inputUnidade.value = userLogado.unidade || 'N/A';
        if (inputSupervisor) inputSupervisor.value = userLogado.nome || 'N/A';
        if (inputTurno) inputTurno.value = userLogado.periodo || 'N/A';
    }
    
    //  3. preenche o dropdown de responsáveis 
    (function carregarEquipe() {
        if (!responsavelSelect || !userLogado) return;

        const allColaboradores = JSON.parse(localStorage.getItem('sigo_colaboradores')) || [];
        // Pega a equipe da mesma unidade
        const minhaEquipe = allColaboradores.filter(c => 
            c.unidade === userLogado.unidade && (c.cargo === 'Supervisor' || c.cargo === 'Colaborador')
        );

        responsavelSelect.innerHTML = '<option value="" disabled selected>Selecionar responsável</option>'; // Limpa
        minhaEquipe.forEach(colab => {
            // Salva o nome e o cargo no próprio <option>
            responsavelSelect.innerHTML += `<option value="${colab.id}" data-cargo="${colab.cargo}">${colab.nome}</option>`;
        });
    })();


    //  Funções de Toast 
    function showToast(message, type = 'success', duration = 3000) {
        if (!tempMessage) return;
        if (type === 'error') {
            tempMessage.classList.remove('success');
            tempMessage.classList.add('error');
            tempMessage.style.backgroundColor = 'var(--toast-error-bg, #f44336)';
        } else {
            tempMessage.classList.remove('error');
            tempMessage.classList.add('success');
            tempMessage.style.backgroundColor = 'var(--toast-success-bg, #4CAF50)';
        }
        tempMessage.textContent = message;
        tempMessage.classList.add('visible');
        setTimeout(() => { hideToast(); }, duration);
    }
    function hideToast() {
        if(tempMessage) tempMessage.classList.remove('visible');
    }
    
    // Funções de Modal
    function showModal() {
        if(modalOverlay) modalOverlay.classList.add('visible');
    }
    function hideModal() {
        if(modalOverlay) modalOverlay.classList.remove('visible');
    }
    
    // Toggle dos botões
    functionButtons.forEach(button => {
        button.addEventListener('click', () => {
            button.classList.toggle('selected');
        });
    });

    // Validação
    function validateForm() {
        const isResponsavelSelected = responsavelSelect && responsavelSelect.value !== "";
        const selectedFunctions = document.querySelectorAll('.js-toggle-function.selected');
        const isAnyFunctionSelected = selectedFunctions.length > 0;

        if (!isResponsavelSelected) {
            responsavelSelect.focus();
            showToast('Por favor, selecione o Responsável pela preleção.', 'error');
            return false;
        }
        if (!isAnyFunctionSelected) {
            showToast('Por favor, marque pelo menos uma Função aplicável.', 'error');
            return false;
        }
        return true;
    }
    
    // Eventos dos botões
    if(openModalButton) openModalButton.addEventListener('click', () => {
        if (validateForm()) {
            showModal();
        }
    });
    
    if(cancelSendButton) cancelSendButton.addEventListener('click', hideModal);
    
    if(confirmSendButton) confirmSendButton.addEventListener('click', () => {
        if (!validateForm() || !userLogado) {
            hideModal();
            return;
        }
        hideModal();
        
        const selectedOption = responsavelSelect.options[responsavelSelect.selectedIndex];
        const selectedResponsavelNome = selectedOption.text;
        const selectedResponsavelCargo = selectedOption.dataset.cargo || 'N/A';

        const selectedFunctionsText = Array.from(document.querySelectorAll('.js-toggle-function.selected'))
                                           .map(btn => btn.textContent.trim());

        try {
            const prelecoesSalvas = localStorage.getItem('sigo_prelecoes');
            const listaPrelecoes = prelecoesSalvas ? JSON.parse(prelecoesSalvas) : [];

            const novaPrelecao = {
                id: Date.now(),
                titulo: `Preleção (${new Date().toLocaleDateString('pt-BR')})`,
                responsavel: selectedResponsavelNome, // Nome de quem deu
                cargo: selectedResponsavelCargo,     // Cargo de quem deu
                data: new Date().toLocaleDateString('pt-BR'),
                status: 'Concluída',
                unidade: userLogado.unidade,
                supervisor: userLogado.nome,     // Nome de quem REGISTROU
                turno: userLogado.periodo,
                funcoes: selectedFunctionsText.join(', ')
            };

            listaPrelecoes.unshift(novaPrelecao);
            localStorage.setItem('sigo_prelecoes', JSON.stringify(listaPrelecoes));
            showToast('Relatório de Preleção enviado com sucesso!', 'success');

        } catch (error) {
            console.error("Falha ao salvar preleção:", error);
            showToast('Erro ao salvar preleção.', 'error');
        }

        setTimeout(() => {
            if(form) form.reset(); 
            if (userLogado) {
                if(inputUnidade) inputUnidade.value = userLogado.unidade || 'N/A';
                if(inputSupervisor) inputSupervisor.value = userLogado.nome || 'N/A';
                if(inputTurno) inputTurno.value = userLogado.periodo || 'N/A';
            }
            document.querySelectorAll('.js-toggle-function.selected').forEach(btn => btn.classList.remove('selected'));
        }, 500);
    });
    
    if(modalOverlay) modalOverlay.addEventListener('click', (event) => {
        if (event.target === modalOverlay) {
            hideModal();
        }
    });
});