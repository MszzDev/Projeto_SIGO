// js/coordenador/solicitacoes.js
document.addEventListener('DOMContentLoaded', () => {
    
    const tbody = document.getElementById('solicitacoes-tbody');
    const tableTitle = document.getElementById('table-title');
    const filterContainer = document.getElementById('unidades-filter-container');
    const modal = document.getElementById('modal-solicitacoes'); 
    
    const closeBtn = modal.querySelector('.close-btn');
    const btnAprovar = document.getElementById('btn-aprovar-modal');
    const btnRecusar = document.getElementById('btn-recusar-modal');
    const btnFechar = document.getElementById('btn-fechar-solicitacoes');

    let solicitacaoIdAtual = null; 

    // 1. Pega o Coordenador logado
    const userLogado = JSON.parse(sessionStorage.getItem('sigo_user_logado'));
    
    // 2. Pega todas as unidades e filtra as dele
    const allUnidades = JSON.parse(localStorage.getItem('sigo_unidades')) || [];
    const minhasUnidades = (userLogado)
        ? allUnidades.filter(u => u.coordenadorId == userLogado.id)
        : [];
    const minhasUnidadesNomes = minhasUnidades.map(u => u.nome);

    // 3. Pega todas as solicitações
    let allSolicitacoes = JSON.parse(localStorage.getItem('sigo_solicitacoes')) || [];
    
    // 4. Filtra solicitações que pertencem às unidades deste Coordenador
    const minhasSolicitacoes = allSolicitacoes.filter(s => minhasUnidadesNomes.includes(s.unidade));

    // --- FUNÇÃO DE ATUALIZAR O STATUS (COM LÓGICA DE NOTIFICAÇÃO PARA O SUPERVISOR) ---
    function atualizarStatus(idSolicitacao, novoStatus) {
        if (!idSolicitacao) return;

        const solicitacoesSalvas = localStorage.getItem('sigo_solicitacoes');
        let listaSolicitacoes = solicitacoesSalvas ? JSON.parse(solicitacoesSalvas) : [];

        const index = listaSolicitacoes.findIndex(s => s.id == idSolicitacao);

        if (index > -1) {
            const solicitacaoOriginal = listaSolicitacoes[index];
            
            // 1. Atualiza o status na lista global
            listaSolicitacoes[index].status = novoStatus;
            localStorage.setItem('sigo_solicitacoes', JSON.stringify(listaSolicitacoes));
            
            // 2. CRIA A NOTIFICAÇÃO PARA O SUPERVISOR
            const notificacoes = JSON.parse(localStorage.getItem('sigo_notificacoes')) || [];
            
            const novaNotificacao = {
                id: Date.now() + Math.random(), // ID único
                tipo: 'solicitacao-status',
                supervisorNome: solicitacaoOriginal.solicitante, // Supervisor alvo
                unidade: solicitacaoOriginal.unidade,
                texto: `Sua solicitação para a unidade ${solicitacaoOriginal.unidade} foi **${novoStatus}**!`,
                lida: false,
                link: '../supervisor/sup_hist_solicitar.html' 
            };
            
            notificacoes.unshift(novaNotificacao);
            localStorage.setItem('sigo_notificacoes', JSON.stringify(notificacoes));
            
            // 3. Re-carrega a tabela e fecha o modal
            fecharModal();
            minhasSolicitacoes.find(s => s.id === idSolicitacao).status = novoStatus; 
            
            const filtroAtivo = filterContainer.querySelector('.filter-button.active').dataset.unidade;
            carregarSolicitacoes(filtroAtivo);
            
            window.globalAlert(`Solicitação ${novoStatus.toLowerCase()}!`, "Status Atualizado");
        } else {
            window.globalAlert("Erro ao atualizar status: solicitação não encontrada.", "Erro");
        }
    }

    // --- FUNÇÃO DE RENDERIZAÇÃO DA TABELA (Mantida) ---
    function carregarSolicitacoes(filtroUnidade) {
        if (!tbody || !tableTitle) return;
        tbody.innerHTML = ''; // Limpa a tabela

        let listaFiltrada = minhasSolicitacoes;
        
        if (filtroUnidade === "Todos") {
            tableTitle.textContent = `Todas as Solicitações`;
        } else {
            tableTitle.textContent = `Solicitações - Unidade ${filtroUnidade}`;
            listaFiltrada = minhasSolicitacoes.filter(s => s.unidade === filtroUnidade);
        }

        if (listaFiltrada.length === 0) {
            tbody.innerHTML = `<tr><td colspan="4" class="text-muted text-center p-4">Nenhuma solicitação encontrada.</td></tr>`;
            return;
        }

        listaFiltrada.forEach(solicitacao => {
            let statusHtml = '';
            let actionBtn = '';
            
            if (solicitacao.status === 'Pendente') {
                 statusHtml = `<span class="badge badge-warning">Pendente</span>`;
                 actionBtn = `<button class="btn btn-sm btn-primary ver-detalhes" data-id="${solicitacao.id}">Analisar</button>`;
            } else if (solicitacao.status === 'Aprovado') {
                statusHtml = `<span class="badge badge-success">Aprovado</span>`;
                 actionBtn = `<button class="btn btn-sm btn-outline-secondary ver-detalhes" data-id="${solicitacao.id}">Detalhes</button>`;
            } else if (solicitacao.status === 'Recusado') {
                statusHtml = `<span class="badge badge-danger">Recusado</span>`;
                 actionBtn = `<button class="btn btn-sm btn-outline-secondary ver-detalhes" data-id="${solicitacao.id}">Detalhes</button>`;
            }

            const novaLinha = document.createElement('tr');
            novaLinha.innerHTML = `
                <td><span>${solicitacao.solicitante} <small class="text-muted d-block">${solicitacao.cargo || 'Supervisor'}</small></span></td>
                <td>${solicitacao.unidade}</td>
                <td>${solicitacao.data}</td>
                <td>${statusHtml} ${actionBtn}</td>
            `;
            tbody.appendChild(novaLinha);
        });
        
        adicionarEventosModal();
    }
    
    // --- LÓGICA DO MODAL, FILTROS DINÂMICOS e CARGA INICIAL (MANTIDAS) ---
    function adicionarEventosModal() { /* ... */ }
    const fecharModal = () => { /* ... */ }; 
    // ... (restante do código original) ...
    carregarSolicitacoes("Todos"); 
    limparNotificacoesSolicitacao(); 
});