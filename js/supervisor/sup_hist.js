// js/supervisor/sup_hist.js
document.addEventListener('DOMContentLoaded', () => {
    
    // --- LÓGICA DO DATE PICKER (Já existente) ---
    document.querySelectorAll('.date-filter-wrapper').forEach(wrapper => {
        const input = wrapper.querySelector('.date-input-field');
        if(input) {
            wrapper.addEventListener('click', () => {
                 try { input.showPicker(); } 
                 catch (e) { input.click(); }
            });
        }
    });

    // --- LÓGICA DE CARREGAMENTO (NOVA) ---
    const historyList = document.querySelector('.history-list');
    if (!historyList) return; // Se não houver lista, para

    // Simulação: Supervisor S123 (Victor Hugo) está logado
    const supervisorLogado = "Victor Hugo F. Silva"; 
    historyList.innerHTML = ''; // Limpa o conteúdo estático

    // Verifica se estamos na página de SOLICITAÇÕES
    if (document.title.includes("Histórico de Solicitações")) {
        carregarHistoricoSolicitacoes(historyList, supervisorLogado);
    } 
    // Verifica se estamos na página de PRELEÇÕES
    else if (document.title.includes("Histórico de Preleções")) {
        carregarHistoricoPrelecoes(historyList, supervisorLogado);
    }
});

function carregarHistoricoSolicitacoes(container, supervisor) {
    const solicitacoesSalvas = localStorage.getItem('sigo_solicitacoes');
    const listaSolicitacoes = solicitacoesSalvas ? JSON.parse(solicitacoesSalvas) : [];
    // Filtra SÓ as solicitações deste supervisor
    const minhasSolicitacoes = listaSolicitacoes.filter(s => s.solicitante === supervisor);

    if (minhasSolicitacoes.length === 0) {
        container.innerHTML = '<p style="padding: 20px; text-align: center; color: var(--text-muted);">Você ainda não fez nenhuma solicitação.</p>';
        return;
    }
    
    // Agrupa por data (simplificado)
    let grupos = {};
    minhasSolicitacoes.forEach(s => {
        if (!grupos[s.data]) grupos[s.data] = [];
        grupos[s.data].push(s);
    });

    for (const data in grupos) {
        container.innerHTML += `<h3 class="day-of-week">${data}</h3>`;
        grupos[data].forEach(s => {
            let statusClass = s.status === 'Aprovado' ? 'approved' : (s.status === 'Recusado' ? 'rejected' : 'pending');
            container.innerHTML += `
            <div class="day-group">
                <div class="card history-card solicitation-card">
                    <div class="card-header"><span class="status ${statusClass}">${s.status}</span><span class="date">${s.data}</span></div>
                    <div class="card-body">
                        <div class="info-group"><span class="info-label">Qtd.</span><span class="info-value">${s.qtd}</span></div>
                        <div class="info-group"><span class="info-label">Unidade</span><span class="info-value">${s.unidade}</span></div>
                        <div class="info-group"><span class="info-label">Tempo</span><span class="info-value">${s.periodo}</span></div>
                    </div>
                    <div class="card-footer"><span class="info-label">Motivo</span><div class="motive-box">${s.motivo}</div></div>
                </div>
            </div>`;
        });
    }
}

function carregarHistoricoPrelecoes(container, supervisor) {
    const prelecoesSalvas = localStorage.getItem('sigo_prelecoes');
    const listaPrelecoes = prelecoesSalvas ? JSON.parse(prelecoesSalvas) : [];
    // Filtra SÓ as preleções deste supervisor
    const minhasPrelecoes = listaPrelecoes.filter(p => p.supervisor === supervisor);

    if (minhasPrelecoes.length === 0) {
        container.innerHTML = '<p style="padding: 20px; text-align: center; color: var(--text-muted);">Você ainda não registrou nenhuma preleção.</p>';
        return;
    }
    
    // Agrupa por data (simplificado)
    let grupos = {};
    minhasPrelecoes.forEach(p => {
        if (!grupos[p.data]) grupos[p.data] = [];
        grupos[p.data].push(p);
    });

    for (const data in grupos) {
        container.innerHTML += `<h3 class="day-of-week">${data}</h3>`;
        grupos[data].forEach(p => {
            container.innerHTML += `
            <div class="day-group">
                <a href="#" class="card history-card prelecao-card" data-id="${p.id}"> 
                    <div class="card-header-prelecao">
                        <span class="prelecao-title">${p.titulo}</span>
                        <div class="prelecao-meta"><span class="date">${p.data}</span><i class="fas fa-chevron-right view-icon"></i></div>
                    </div>
                    <div class="card-body-prelecao">
                        <span class="info-label">Responsável:</span><span class="info-value">${p.responsavel}</span>
                        <span class="info-label mt-1">Funções Abordadas:</span><span class="info-value small">${p.funcoes}</span>
                    </div>
                </a>
            </div>`;
        });
    }
}