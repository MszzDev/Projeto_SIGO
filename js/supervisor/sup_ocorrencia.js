// js/supervisor/sup_ocorrencia.js
document.addEventListener('DOMContentLoaded', () => {
    
    const form = document.getElementById('ocorrencia-form');
    const modalOverlay = document.getElementById('confirmation-modal');
    const openModalButton = document.getElementById('open-modal-button');
    const confirmSendButton = document.getElementById('confirm-send');
    const cancelSendButton = document.getElementById('cancel-send');
    const tempMessage = document.getElementById('temp-message');

    // --- 1. PEGAR DADOS DO SUPERVISOR LOGADO ---
    const userLogado = JSON.parse(sessionStorage.getItem('sigo_user_logado'));
    
    const inputUnidade = document.getElementById('unidade');
    const inputSupervisor = document.getElementById('supervisor');
    const inputTurno = document.getElementById('turno');

    if (!userLogado || userLogado.cargo !== 'Supervisor') {
        showToast('Erro: Perfil de supervisor não encontrado.', 'error');
        if(openModalButton) openModalButton.disabled = true;
    } else {
        // --- 2. PREENCHER O FORMULÁRIO (READONLY) ---
        if (inputUnidade) inputUnidade.value = userLogado.unidade || 'N/A';
        if (inputSupervisor) inputSupervisor.value = userLogado.nome || 'N/A';
        if (inputTurno) inputTurno.value = userLogado.periodo || 'N/A';
    }

    // --- Funções de Toast ---
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
    
    // --- Funções de Modal ---
    function showModal() {
        if(modalOverlay) modalOverlay.classList.add('visible');
    }
    function hideModal() {
        if(modalOverlay) modalOverlay.classList.remove('visible');
    }
    
    // --- Validação ---
    function validateForm() {
        const tipo = document.getElementById('ocorrencia_tipo').value;
        const descricao = document.getElementById('ocorrencia_descricao').value.trim();

        if (!tipo) {
            document.getElementById('ocorrencia_tipo').focus();
            showToast('Por favor, selecione o Tipo de Ocorrência.', 'error');
            return false;
        }
        if (!descricao) {
             document.getElementById('ocorrencia_descricao').focus();
            showToast('Por favor, preencha a Descrição.', 'error');
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
        
        const tipo = document.getElementById('ocorrencia_tipo').value;
        const descricao = document.getElementById('ocorrencia_descricao').value.trim();

        try {
            
            const allUnidades = JSON.parse(localStorage.getItem('sigo_unidades')) || [];
            const estaUnidade = allUnidades.find(u => u.nome === userLogado.unidade);
            const targetCoordenadorId = estaUnidade ? estaUnidade.coordenadorId : null;

            if (targetCoordenadorId) {
                const notificacoes = JSON.parse(localStorage.getItem('sigo_notificacoes')) || [];
                const novaNotificacao = {
                    id: Date.now() + 1, // +1 para diferenciar de solicitação
                    tipo: 'ocorrencia',
                    unidade: userLogado.unidade,
                    texto: `Nova ocorrência (${tipo}) registrada por ${userLogado.nome.split(' ')[0]}.`,
                    coordenadorId: targetCoordenadorId,
                    lida: false,
                    link: 'ocorrencias.html' // Leva para a nova pag de ocorrencias
                };
                notificacoes.unshift(novaNotificacao);
                localStorage.setItem('sigo_notificacoes', JSON.stringify(notificacoes));
            }
           
            
            const ocorrenciasSalvas = localStorage.getItem('sigo_ocorrencias');
            const listaOcorrencias = ocorrenciasSalvas ? JSON.parse(ocorrenciasSalvas) : [];

            const novaOcorrencia = {
                id: Date.now(),
                data: new Date().toLocaleDateString('pt-BR'),
                unidade: userLogado.unidade,
                supervisor: userLogado.nome,
                turno: userLogado.periodo,
                tipo: tipo,
                descricao: descricao,
                status: 'Aberta' // Ocorrências começam como 'Aberta'
            };

            listaOcorrencias.unshift(novaOcorrencia);
            localStorage.setItem('sigo_ocorrencias', JSON.stringify(listaOcorrencias));
            showToast('Ocorrência registrada com sucesso!', 'success');

        } catch (error) {
            console.error("Falha ao salvar ocorrência:", error);
            showToast('Erro ao salvar ocorrência.', 'error');
        }

        // Limpa o formulário após salvar
        setTimeout(() => {
            if(form) form.reset(); 
            if (userLogado) {
                if(inputUnidade) inputUnidade.value = userLogado.unidade || 'N/A';
                if(inputSupervisor) inputSupervisor.value = userLogado.nome || 'N/A';
                if(inputTurno) inputTurno.value = userLogado.periodo || 'N/A';
            }
        }, 500);
    });
    
    if(modalOverlay) modalOverlay.addEventListener('click', (event) => {
        if (event.target === modalOverlay) {
            hideModal();
        }
    });
});