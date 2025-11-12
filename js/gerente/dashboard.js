// js/gerente/dashboard.js
document.addEventListener('DOMContentLoaded', () => {

    // --- 1. Elementos do DOM (Corrigido) ---
    const el = {
        statOcorrencias: document.getElementById('stat-ocorrencias-abertas'), // O card que substituímos
        statPrelecoes: document.getElementById('stat-prelecoes'),
        statUnidades: document.getElementById('stat-unidades-ativas'),
        statColaboradores: document.getElementById('stat-colaboradores'),
        listaAtencao: document.getElementById('lista-atencao-solicitacoes'),
        listaAtividade: document.getElementById('lista-atividade-prelecoes')
    };

    // --- 2. Carregar Dados do localStorage ---
    const solicitacoes = JSON.parse(localStorage.getItem('sigo_solicitacoes')) || [];
    const prelecoes = JSON.parse(localStorage.getItem('sigo_prelecoes')) || [];
    const colaboradores = JSON.parse(localStorage.getItem('sigo_colaboradores')) || [];
    const ocorrencias = JSON.parse(localStorage.getItem('sigo_ocorrencias')) || [];

    // --- 3. Preencher Cards de Estatística (Topo) (Corrigido) ---
    (function preencherCardsTopo() {
        const abertas = ocorrencias.filter(o => o.status === 'Aberta').length;

        if (el.statOcorrencias) el.statOcorrencias.textContent = abertas; // Conta as ocorrências
        if (el.statPrelecoes) el.statPrelecoes.textContent = prelecoes.length;
        if (el.statColaboradores) el.statColaboradores.textContent = colaboradores.length;
        
        const unidadesUnicas = new Set(colaboradores.map(c => c.unidade).filter(u => u && u !== 'N/A'));
        if (el.statUnidades) el.statUnidades.textContent = unidadesUnicas.size;
    })();

    // --- 4. Preencher Lista: Pontos de Atenção (Solicitações Pendentes) ---
    (function preencherAtencao() {
        if (!el.listaAtencao) return;
        const solicitacoesPendentes = solicitacoes.filter(s => s.status === 'Pendente');
        const contagemPorUnidade = solicitacoesPendentes.reduce((acc, sol) => {
            acc[sol.unidade] = (acc[sol.unidade] || 0) + 1;
            return acc;
        }, {});
        const unidadesOrdenadas = Object.entries(contagemPorUnidade).sort(([, a], [, b]) => b - a);
        el.listaAtencao.innerHTML = '';

        if (unidadesOrdenadas.length === 0) {
            el.listaAtencao.innerHTML = '<p class="text-muted">Nenhuma solicitação pendente.</p>';
            return;
        }
        unidadesOrdenadas.slice(0, 5).forEach(([unidade, contagem]) => {
            const label = contagem > 1 ? 'solicitações' : 'solicitação';
            el.listaAtencao.innerHTML += `
                <a href="historico-solicitacoes.html" class="info-list-item">
                    <span class="unit-name">${unidade}</span>
                    <span class="unit-stat stat-atencao">${contagem} ${label}</span>
                </a>
            `;
        });
    })();

    // --- 5. Preencher Lista: Atividade de Preleção (Total) ---
    (function preencherAtividade() {
        if (!el.listaAtividade) return;
        const contagemPorUnidade = prelecoes.reduce((acc, prel) => {
            acc[prel.unidade] = (acc[prel.unidade] || 0) + 1;
            return acc;
        }, {});
        const unidadesOrdenadas = Object.entries(contagemPorUnidade).sort(([, a], [, b]) => b - a);
        el.listaAtividade.innerHTML = '';

        if (unidadesOrdenadas.length === 0) {
            el.listaAtividade.innerHTML = '<p class="text-muted">Nenhuma preleção registrada.</p>';
            return;
        }
        unidadesOrdenadas.slice(0, 5).forEach(([unidade, contagem]) => {
            const label = contagem > 1 ? 'preleções' : 'preleção';
            el.listaAtividade.innerHTML += `
                <a href="historico-prelecoes.html" class="info-list-item">
                    <span class="unit-name">${unidade}</span>
                    <span class="unit-stat stat-atividade">${contagem} ${label}</span>
                </a>
            `;
        });
    })();
});