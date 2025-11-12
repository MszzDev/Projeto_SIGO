// js/gerente/relatorios.js
document.addEventListener('DOMContentLoaded', () => {

    // Carrega todos os dados do localStorage
    const listaSolicitacoes = JSON.parse(localStorage.getItem('sigo_solicitacoes')) || [];
    const listaPrelecoes = JSON.parse(localStorage.getItem('sigo_prelecoes')) || [];
    const listaColaboradores = JSON.parse(localStorage.getItem('sigo_colaboradores')) || [];

    // Cores Padrão para os gráficos
    const CHART_COLORS = {
        red: 'rgb(220, 53, 69)',
        yellow: 'rgb(255, 193, 7)',
        green: 'rgb(40, 167, 69)',
        blue: 'rgb(0, 48, 99)',
        purple: 'rgb(111, 66, 193)',
        orange: 'rgb(253, 126, 20)'
    };
    
    const CHART_BORDER_COLORS = {
        red: 'rgba(220, 53, 69, 0.7)',
        yellow: 'rgba(255, 193, 7, 0.7)',
        green: 'rgba(40, 167, 69, 0.7)',
        blue: 'rgba(0, 48, 99, 0.7)',
        purple: 'rgba(111, 66, 193, 0.7)',
        orange: 'rgba(253, 126, 20, 0.7)'
    };


    /**
     * Preenche os números de estatísticas gerais e cria o gráfico de rosca.
     */
    function renderEstatisticasGerais() {
        const totalSolicitacoes = listaSolicitacoes.length;
        const totalPendentes = listaSolicitacoes.filter(s => s.status === 'Pendente').length;
        const totalAprovadas = listaSolicitacoes.filter(s => s.status === 'Aprovado').length;
        const totalRecusadas = listaSolicitacoes.filter(s => s.status === 'Recusado').length;
        const totalPrelecoes = listaPrelecoes.length;
        const totalColaboradores = listaColaboradores.length;

        document.getElementById('stat-total-solicitacoes').textContent = totalSolicitacoes;
        document.getElementById('stat-pendentes').textContent = totalPendentes;
        document.getElementById('stat-aprovadas').textContent = totalAprovadas;
        document.getElementById('stat-recusadas').textContent = totalRecusadas;
        document.getElementById('stat-total-prelecoes').textContent = totalPrelecoes;
        document.getElementById('stat-total-colaboradores').textContent = totalColaboradores;

        // --- Gráfico de Rosca (Doughnut Chart) ---
        const ctx = document.getElementById('solicitacoesStatusChart')?.getContext('2d');
        if (!ctx) return;

        new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: ['Pendentes', 'Aprovadas', 'Recusadas'],
                datasets: [{
                    label: 'Status das Solicitações',
                    data: [totalPendentes, totalAprovadas, totalRecusadas],
                    backgroundColor: [CHART_COLORS.yellow, CHART_COLORS.green, CHART_COLORS.red],
                    borderColor: '#fff',
                    borderWidth: 2
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: {
                            padding: 15,
                            font: { size: 12 }
                        }
                    }
                }
            }
        });
    }

    /**
     * Cria o gráfico de barras para o ranking de solicitações por unidade.
     */
    function renderRankingSolicitacoes() {
        const container = document.getElementById('ranking-solicitacoes-body');
        const ctx = document.getElementById('solicitacoesPorUnidadeChart')?.getContext('2d');
        if (!ctx || !container) return;

        const rankingSolicitacoes = {};
        listaSolicitacoes.forEach(s => {
            rankingSolicitacoes[s.unidade] = (rankingSolicitacoes[s.unidade] || 0) + 1;
        });

        const rankingOrdenado = Object.entries(rankingSolicitacoes).sort(([, a], [, b]) => b - a);

        if (rankingOrdenado.length === 0) {
            container.innerHTML = '<p class="text-muted">Nenhum dado de solicitação.</p>';
            return;
        }

        const labels = rankingOrdenado.map(item => item[0]);
        const data = rankingOrdenado.map(item => item[1]);

        new Chart(ctx, {
            type: 'bar',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Solicitações',
                    data: data,
                    backgroundColor: CHART_BORDER_COLORS.red,
                    borderColor: CHART_COLORS.red,
                    borderWidth: 1,
                    borderRadius: 4
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                indexAxis: 'y', // Gráfico de barras horizontal
                plugins: {
                    legend: { display: false }
                },
                scales: {
                    x: {
                        beginAtZero: true,
                        ticks: {
                            stepSize: 1 // Garante que o eixo X conte de 1 em 1
                        }
                    }
                }
            }
        });
    }

    /**
     * Cria o ranking visual TOP 3 de supervisores com mais preleções.
     * USA A FOTO DE PERFIL SOLICITADA (perf.png)
     */
    function renderRankingPrelecoes() {
        const container = document.getElementById('ranking-prelecoes-body');
        if (!container) return;

        const rankingPrelecoes = {};
        listaPrelecoes.forEach(p => {
            // Usa 'supervisor' (quem registrou) como chave
            rankingPrelecoes[p.supervisor] = (rankingPrelecoes[p.supervisor] || 0) + 1;
        });

        const rankingOrdenado = Object.entries(rankingPrelecoes).sort(([, a], [, b]) => b - a);
        
        container.innerHTML = ''; // Limpa o "Carregando..."
        
        if (rankingOrdenado.length === 0) {
            container.innerHTML = '<p class="text-muted">Nenhum dado de preleção.</p>';
            return;
        }

        const top3 = rankingOrdenado.slice(0, 3);
        const maxPrelecoes = top3[0] ? top3[0][1] : 0; // Pega o valor máximo para a barra

        top3.forEach(([supervisorNome, contagem]) => {
            // Procura o usuário para pegar a foto
            const supervisorInfo = listaColaboradores.find(c => c.nome === supervisorNome);
            
            // Usa a foto do usuário OU a foto padrão perf.png
            const avatarSrc = supervisorInfo?.foto_url || '../../img/perf.png';
            
            // Calcula a porcentagem da barra
            const barWidth = maxPrelecoes > 0 ? (contagem / maxPrelecoes) * 100 : 0;

            container.innerHTML += `
                <div class="supervisor-ranking-item">
                    <img src="${avatarSrc}" alt="Avatar" class="supervisor-avatar">
                    <div class="supervisor-info">
                        <span class="name">${supervisorNome}</span>
                        <div class="stat-bar">
                            <div class="stat-bar-fill" style="width: ${barWidth}%;"></div>
                        </div>
                    </div>
                    <span class="supervisor-count">${contagem}</span>
                </div>
            `;
        });
        
        // Adiciona um delay para a animação da barra de CSS
        setTimeout(() => {
             container.querySelectorAll('.stat-bar-fill').forEach(bar => {
                bar.style.width = bar.style.width; // Força o CSS a animar
             });
        }, 100);
    }
    
    /**
     * Cria o gráfico de linhas de atividade (Solicitações vs Preleções)
     */
    function renderAtividadeAoLongoTempo() {
        const ctx = document.getElementById('atividadeAoLongoTempoChart')?.getContext('2d');
        if (!ctx) return;

        // 1. Gerar os labels dos últimos 7 dias (ex: "05/11")
        const labels = [];
        const solicitacoesData = new Array(7).fill(0);
        const prelecoesData = new Array(7).fill(0);
        
        for (let i = 6; i >= 0; i--) {
            const d = new Date();
            d.setDate(d.getDate() - i);
            const label = d.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' });
            labels.push(label);
        }

        // 2. Contar solicitações por dia
        listaSolicitacoes.forEach(s => {
            const dataLabel = new Date(s.id).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' });
            const index = labels.indexOf(dataLabel);
            if (index > -1) {
                solicitacoesData[index]++;
            }
        });

        // 3. Contar preleções por dia
        listaPrelecoes.forEach(p => {
             const dataLabel = new Date(p.id).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' });
             const index = labels.indexOf(dataLabel);
            if (index > -1) {
                prelecoesData[index]++;
            }
        });

        // 4. Criar o gráfico
        new Chart(ctx, {
            type: 'line',
            data: {
                labels: labels,
                datasets: [
                    {
                        label: 'Solicitações',
                        data: solicitacoesData,
                        borderColor: CHART_COLORS.red,
                        backgroundColor: CHART_BORDER_COLORS.red,
                        fill: false,
                        tension: 0.1,
                        borderWidth: 2
                    },
                    {
                        label: 'Preleções',
                        data: prelecoesData,
                        borderColor: CHART_COLORS.blue,
                        backgroundColor: CHART_BORDER_COLORS.blue,
                        fill: false,
                        tension: 0.1,
                        borderWidth: 2
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'bottom'
                    },
                    tooltip: {
                        mode: 'index',
                        intersect: false
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                         ticks: {
                            stepSize: 1 // Garante que o eixo Y conte de 1 em 1
                        }
                    }
                }
            }
        });
    }


    // --- Inicialização ---
    // Chama todas as funções para renderizar os relatórios
    renderEstatisticasGerais();
    renderRankingSolicitacoes();
    renderRankingPrelecoes();
    renderAtividadeAoLongoTempo();
});