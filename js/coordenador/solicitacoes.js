// js/coordenador/solicitacoes.js
document.addEventListener('DOMContentLoaded', () => {
    
    const tabela = document.querySelector('.table tbody');
    const cardHeader = document.querySelector('.card-header h5');
    const filterButtons = document.querySelectorAll('.unit-filters .filter-button');

    // --- FUNÇÃO DE CARREGAMENTO (MODIFICADA) ---
    // Agora aceita um filtro de unidade
    function carregarSolicitacoes(filtroUnidade) {
        if (!tabela) {
            console.error("Tabela <tbody> não encontrada.");
            return;
        }

        tabela.innerHTML = ''; // Limpa a tabela

        // Pega os dados do localStorage
        const solicitacoesSalvas = localStorage.getItem('sigo_solicitacoes');
        let listaSolicitacoes = solicitacoesSalvas ? JSON.parse(solicitacoesSalvas) : [];

        // ATUALIZA O TÍTULO DO CARD
        if (cardHeader) {
            // Se nenhum filtro for aplicado (ex: "Todos"), mostra um título geral
            if (!filtroUnidade || filtroUnidade === "Todos") {
                cardHeader.textContent = `Todas as Solicitações`;
            } else {
                cardHeader.textContent = `Solicitações - Unidade ${filtroUnidade}`;
            }
        }

        // FILTRA A LISTA (só filtra se o filtro não for "Todos")
        if (filtroUnidade && filtroUnidade !== "Todos") {
            listaSolicitacoes = listaSolicitacoes.filter(s => s.unidade === filtroUnidade);
        }

        if (listaSolicitacoes.length === 0) {
            tabela.innerHTML = `<tr><td colspan="4" style="text-align:center; padding: 20px;">Nenhuma solicitação encontrada para esta unidade.</td></tr>`;
            return;
        }

        // Adiciona cada solicitação à tabela
        listaSolicitacoes.forEach(solicitacao => {
            let statusHtml = '';
            if (solicitacao.status === 'Pendente') {
                statusHtml = `<a href="aprovar-solicitacao.html?id=${solicitacao.id}" class="btn btn-sm btn-outline-primary">Analisar</a>`;
            } else if (solicitacao.status === 'Aprovado') {
                statusHtml = `<span class="badge badge-success">Aprovado</span>`;
            } else if (solicitacao.status === 'Recusado') {
                statusHtml = `<span class="badge badge-danger">Recusado</span>`;
            }

            const novaLinha = document.createElement('tr');
            novaLinha.innerHTML = `
                <td><span>${solicitacao.solicitante} <small class="text-muted d-block">${solicitacao.cargo}</small></span></td>
                <td>${solicitacao.turno}</td>
                <td>${solicitacao.data}</td>
                <td>${statusHtml}</td>
            `;
            tabela.appendChild(novaLinha);
        });
    }

    // --- LÓGICA DOS FILTROS ---
    let filtroAtivo = '';
    
    // Encontra o botão ativo inicial e carrega os dados
    const botaoAtivoInicial = document.querySelector('.unit-filters .filter-button.active');
    if (botaoAtivoInicial) {
        filtroAtivo = botaoAtivoInicial.textContent.trim();
    } else if (filterButtons.length > 0) {
        // Se nenhum estiver ativo, ativa o primeiro
        filterButtons[0].classList.add('active');
        filtroAtivo = filterButtons[0].textContent.trim();
    }

    // Carrega os dados iniciais
    if (filtroAtivo) {
        carregarSolicitacoes(filtroAtivo);
    }

    // Adiciona evento de clique aos botões
    filterButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault();

            // Remove a classe 'active' de TODOS
            filterButtons.forEach(btn => btn.classList.remove('active'));

            // Adiciona a classe 'active' apenas no clicado
            button.classList.add('active');
            
            // Pega o nome da unidade pelo texto do botão
            const novaUnidade = button.textContent.trim();
            
            // Recarrega a tabela com o novo filtro
            carregarSolicitacoes(novaUnidade);
        });
    });
});