// js/coordenador/solicitacoes.js
document.addEventListener('DOMContentLoaded', () => {
    
    const tbody = document.getElementById('solicitacoes-tbody');
    const tableTitle = document.getElementById('table-title');
    const filterContainer = document.getElementById('unidades-filter-container');

    // 1. Pega o Coordenador logado
    const userLogado = JSON.parse(sessionStorage.getItem('sigo_user_logado'));
    
    // 2. Pega todas as unidades e filtra as dele
    const allUnidades = JSON.parse(localStorage.getItem('sigo_unidades')) || [];
    const minhasUnidades = (userLogado)
        ? allUnidades.filter(u => u.coordenadorId == userLogado.id)
        : [];
    const minhasUnidadesNomes = minhasUnidades.map(u => u.nome);

    // 3. Pega todas as solicitações
    const allSolicitacoes = JSON.parse(localStorage.getItem('sigo_solicitacoes')) || [];
    
    // 4. Filtra solicitações que pertencem às unidades deste Coordenador
    const minhasSolicitacoes = allSolicitacoes.filter(s => minhasUnidadesNomes.includes(s.unidade));

    // --- FUNÇÃO DE RENDERIZAÇÃO ---
    function carregarSolicitacoes(filtroUnidade) {
        if (!tbody || !tableTitle) return;
        tbody.innerHTML = ''; // Limpa a tabela

        let listaFiltrada = minhasSolicitacoes;

        // Atualiza o título
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
            if (solicitacao.status === 'Pendente') {
                statusHtml = `<a href="aprovar-solicitacao.html?id=${solicitacao.id}" class="btn btn-sm btn-outline-primary">Analisar</a>`;
            } else if (solicitacao.status === 'Aprovado') {
                statusHtml = `<span class="badge badge-success">Aprovado</span>`;
            } else if (solicitacao.status === 'Recusado') {
                statusHtml = `<span class="badge badge-danger">Recusado</span>`;
            }

            tbody.innerHTML += `
                <tr>
                    <td><span>${solicitacao.solicitante} <small class="text-muted d-block">${solicitacao.cargo || 'Supervisor'}</small></span></td>
                    <td>${solicitacao.turno}</td>
                    <td>${solicitacao.data}</td>
                    <td>${statusHtml}</td>
                </tr>
            `;
        });
    }

    // --- LÓGICA DOS FILTROS DINÂMICOS ---
    if (filterContainer) {
        // Cria os botões de filtro
        minhasUnidades.forEach(unit => {
            filterContainer.innerHTML += `<a href="#" class="filter-button" data-unidade="${unit.nome}">${unit.nome}</a>`;
        });

        // Adiciona evento de clique a todos os botões
        const filterButtons = filterContainer.querySelectorAll('.filter-button');
        filterButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                e.preventDefault();
                filterButtons.forEach(btn => btn.classList.remove('active'));
                button.classList.add('active');
                
                const novaUnidade = button.dataset.unidade;
                carregarSolicitacoes(novaUnidade);
            });
        });
    }

    // --- FUNÇÃO PARA LIMPAR NOTIFICAÇÕES (Adicionar no final) ---
    function limparNotificacoesSolicitacao() {
        if (!userLogado) return;
        let allNotificacoes = JSON.parse(localStorage.getItem('sigo_notificacoes')) || [];
        let algumaAlteracao = false;
        
        // Marca como lida todas as notificações de 'solicitacao' deste usuário
        allNotificacoes.forEach(n => {
            if (n.coordenadorId == userLogado.id && n.tipo === 'solicitacao' && n.lida === false) {
                n.lida = true;
                algumaAlteracao = true;
            }
        });

        if (algumaAlteracao) {
            localStorage.setItem('sigo_notificacoes', JSON.stringify(allNotificacoes));
        }
    }

    // --- CARGA INICIAL ---
    carregarSolicitacoes("Todos"); // Começa mostrando tudo
    limparNotificacoesSolicitacao(); // Limpa as notificações ao carregar a página
});