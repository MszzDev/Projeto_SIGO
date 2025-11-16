// js/supervisor/sup_solicitar.js
document.addEventListener('DOMContentLoaded', () => {

    const form = document.getElementById('solicitation-form');
    const triggerBtn = document.getElementById('trigger-solicitar-btn');
    const modal = document.getElementById('confirmation-modal');
    const cancelBtn = document.getElementById('cancel-send-btn');
    const confirmBtn = document.getElementById('confirm-send-btn');
    const successToast = document.getElementById('success-message');
    const errorToast = document.getElementById('error-message');

    //  1. pega dados do sup logado
    const userLogado = JSON.parse(sessionStorage.getItem('sigo_user_logado'));
    
    const inputUnidade = document.getElementById('unidade');
    const inputSupervisor = document.getElementById('supervisor');
    const inputTurno = document.getElementById('turno');

    if (!userLogado || userLogado.cargo !== 'Supervisor') {
        showToast(errorToast, 'Erro: Perfil de supervisor não encontrado.');
        if(triggerBtn) triggerBtn.disabled = true;
    } else {
        //  2. preenche o formulário com dados do sup
        if (inputUnidade) inputUnidade.value = userLogado.unidade || 'N/A';
        if (inputSupervisor) inputSupervisor.value = userLogado.nome || 'N/A';
        if (inputTurno) inputTurno.value = userLogado.periodo || 'N/A';
    }

    function showToast(element, message, duration = 3000) {
        if (!element) return;
        element.textContent = message;
        element.classList.add('visible');
        setTimeout(() => {
            hideToast(element);
        }, duration);
    }
    function hideToast(element) {
        if(element) element.classList.remove('visible');
    }
    
    // Funções do Modal 
    function showModal() {
        if(modal) modal.classList.add('visible');
    }
    function hideModal() {
        if(modal) modal.classList.remove('visible');
    }
    
    //  Validação e coleta dos dados do formulário
    function getFormData() {
        const data = {
            unidade: inputUnidade.value,
            supervisor: inputSupervisor.value,
            turno: inputTurno.value,
            colaborador: document.getElementById('colaborador').value.trim(),
            horaInicio: document.getElementById('hora-inicio').value,
            horaFim: document.getElementById('hora-fim').value,
            motivo: document.getElementById('motivo').value.trim()
        };
        // Validação
        const requiredFields = [
            { key: 'colaborador', label: 'Quantidade de Colaboradores', elementId: 'colaborador' },
            { key: 'horaInicio', label: 'Hora de Início', elementId: 'hora-inicio' },
            { key: 'horaFim', label: 'Hora de Fim', elementId: 'hora-fim' },
            { key: 'motivo', label: 'Motivo', elementId: 'motivo' }
        ];
        for (const field of requiredFields) {
            if (!data[field.key]) { 
                showToast(errorToast, `Erro: O campo '${field.label}' é obrigatório.`);
                document.getElementById(field.elementId)?.focus(); 
                return null; 
            }
        }
        const colaboradores = parseInt(data.colaborador);
        if (isNaN(colaboradores) || colaboradores <= 0) {
            showToast(errorToast, 'Erro: A quantidade de colaboradores deve ser um número positivo.');
            document.getElementById('colaborador')?.focus();
            return null;
        }
        if (data.horaInicio === "" || data.horaFim === "") {
             showToast(errorToast, 'Erro: Selecione Hora de Início e Fim.');
             return null;
        }
        return data; 
    }

    // Handlers de Eventos 
    if(triggerBtn) triggerBtn.addEventListener('click', () => {
        if (!userLogado) return; // Bloqueia se não houver usuário
        const data = getFormData();
        if (data) {
            showModal();
        }
    });
    
    if(cancelBtn) cancelBtn.addEventListener('click', hideModal);
    
    if(confirmBtn) confirmBtn.addEventListener('click', () => {
        const data = getFormData(); 
        
        // verificação 
        if (data && userLogado) {
            hideModal();
            try {
                //  lógica de notificação 
                const allUnidades = JSON.parse(localStorage.getItem('sigo_unidades')) || [];
                const estaUnidade = allUnidades.find(u => u.nome === userLogado.unidade);
                const targetCoordenadorId = estaUnidade ? estaUnidade.coordenadorId : null;

                if (targetCoordenadorId) {
                    const notificacoes = JSON.parse(localStorage.getItem('sigo_notificacoes')) || [];
                    const novaNotificacao = {
                        id: Date.now(),
                        tipo: 'solicitacao',
                        unidade: userLogado.unidade,
                        texto: `Nova solicitação de ${userLogado.nome.split(' ')[0]} para a unidade ${userLogado.unidade}.`,
                        coordenadorId: targetCoordenadorId,
                        lida: false,
                        link: 'solicitacoes-pendentes.html' // Leva para a pág. de pendentes
                    };
                    notificacoes.unshift(novaNotificacao);
                    localStorage.setItem('sigo_notificacoes', JSON.stringify(notificacoes));
                }
                //  lógica de notificação 

                const solicitacoesSalvas = localStorage.getItem('sigo_solicitacoes');
                const listaSolicitacoes = solicitacoesSalvas ? JSON.parse(solicitacoesSalvas) : [];
                const novaSolicitacao = {
                    id: Date.now(), 
                    solicitante: data.supervisor, // Nome do Supervisor
                    cargo: userLogado.cargo,      // "Supervisor"
                    unidade: data.unidade,
                    turno: data.turno,
                    qtd: data.colaborador,
                    periodo: `${data.horaInicio} às ${data.horaFim}`,
                    motivo: data.motivo,
                    data: new Date().toLocaleDateString('pt-BR'), 
                    status: 'Pendente' 
                };
                listaSolicitacoes.unshift(novaSolicitacao);
                localStorage.setItem('sigo_solicitacoes', JSON.stringify(listaSolicitacoes));
                showToast(successToast, 'Solicitação enviada com sucesso!');
            } catch (error) {
                console.error("Falha ao salvar no localStorage:", error);
                showToast(errorToast, 'Erro ao salvar solicitação.');
            }
            
            // Limpa o formulário 
            setTimeout(() => {
                if(form) form.reset(); 
                if (userLogado) {
                    if (inputUnidade) inputUnidade.value = userLogado.unidade || 'N/A';
                    if (inputSupervisor) inputSupervisor.value = userLogado.nome || 'N/A';
                    if (inputTurno) inputTurno.value = userLogado.periodo || 'N/A';
                }
            }, 500); 

        } else {
             // Se falhar ,apenas fecha
             hideModal(); 
             if (!userLogado) {
                showToast(errorToast, 'Erro de sessão. Faça login novamente.');
             }
        }
    });
});