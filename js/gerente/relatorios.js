// js/gerente/relatorios.js
document.addEventListener('DOMContentLoaded', () => {

    // Carrega todos os dados do localStorage
    const listaSolicitacoes = JSON.parse(localStorage.getItem('sigo_solicitacoes')) || [];
    const listaPrelecoes = JSON.parse(localStorage.getItem('sigo_prelecoes')) || [];
    const listaColaboradores = JSON.parse(localStorage.getItem('sigo_colaboradores')) || [];

    // --- 1. Estatísticas Gerais ---
    const totalSolicitacoes = listaSolicitacoes.length;
    const totalPendentes = listaSolicitacoes.filter(s => s.status === 'Pendente').length;
    const totalAprovadas = listaSolicitacoes.filter(s => s.status === 'Aprovado').length;
    const totalRecusadas = listaSolicitacoes.filter(s => s.status === 'Recusado').length;
    
    document.getElementById('stat-total-solicitacoes').textContent = totalSolicitacoes;
    document.getElementById('stat-pendentes').textContent = totalPendentes;
    document.getElementById('stat-aprovadas').textContent = totalAprovadas;
    document.getElementById('stat-recusadas').textContent = totalRecusadas;

    const totalPrelecoes = listaPrelecoes.length;
    const totalColaboradores = listaColaboradores.length;
    
    document.getElementById('stat-total-prelecoes').textContent = totalPrelecoes;
    document.getElementById('stat-total-colaboradores').textContent = totalColaboradores;

    // --- 2. Ranking de Unidades (por Solicitações) ---
    const containerSolicitacoes = document.getElementById('ranking-solicitacoes-body');
    const rankingSolicitacoes = {};
    listaSolicitacoes.forEach(s => {
        rankingSolicitacoes[s.unidade] = (rankingSolicitacoes[s.unidade] || 0) + 1;
    });
    
    // Converte para array e ordena do maior para o menor
    const rankingSolicitacoesOrdenado = Object.entries(rankingSolicitacoes)
        .sort(([, a], [, b]) => b - a);
    
    // Exibe no HTML
    containerSolicitacoes.innerHTML = '';
    rankingSolicitacoesOrdenado.forEach(([unidade, contagem]) => {
        containerSolicitacoes.innerHTML += `
            <div class="stat-item">
                <span class="stat-label">${unidade}</span>
                <span class="stat-value negative">${contagem} ${contagem > 1 ? 'pedidos' : 'pedido'}</span>
            </div>
        `;
    });
    if (rankingSolicitacoesOrdenado.length === 0) {
        containerSolicitacoes.innerHTML = '<p class="text-muted">Nenhum dado de solicitação.</p>';
    }

    // --- 3. Ranking de Supervisores (por Preleções) ---
    const containerPrelecoes = document.getElementById('ranking-prelecoes-body');
    const rankingPrelecoes = {};
    listaPrelecoes.forEach(p => {
        rankingPrelecoes[p.supervisor] = (rankingPrelecoes[p.supervisor] || 0) + 1;
    });

    const rankingPrelecoesOrdenado = Object.entries(rankingPrelecoes)
        .sort(([, a], [, b]) => b - a);

    containerPrelecoes.innerHTML = '';
    rankingPrelecoesOrdenado.forEach(([supervisor, contagem]) => {
        containerPrelecoes.innerHTML += `
            <div class="stat-item">
                <span class="stat-label">${supervisor}</span>
                <span class="stat-value positive">${contagem} ${contagem > 1 ? 'preleções' : 'preleção'}</span>
            </div>
        `;
    });
    if (rankingPrelecoesOrdenado.length === 0) {
        containerPrelecoes.innerHTML = '<p class="text-muted">Nenhum dado de preleção.</p>';
    }
});