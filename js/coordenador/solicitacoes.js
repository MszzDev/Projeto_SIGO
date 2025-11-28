// js/coordenador/solicitacoes.js
document.addEventListener('DOMContentLoaded', () => {
    
    const tbody = document.getElementById('solicitacoes-tbody');
    const tableTitle = document.getElementById('table-title');
    const filterContainer = document.getElementById('unidades-filter-container');
    const modal = document.getElementById('modal-solicitacoes'); // Novo ID
    if (!modal) return;
    
    const closeBtn = modal.querySelector('.close-btn');
    const btnAprovar = document.getElementById('btn-aprovar-modal');
    const btnRecusar = document.getElementById('btn-recusar-modal');
    const btnFechar = document.getElementById('btn-fechar-solicitacoes');

    let solicitacaoIdAtual = null; // ID da solicitação aberta

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

    // --- FUNÇÃO DE ATUALIZAR O STATUS (Do antigo aprovar-solicitacao.js) ---
    function atualizarStatus(idSolicitacao, novoStatus) {
        if (!idSolicitacao) return;

        const solicitacoesSalvas = localStorage.getItem('sigo_solicitacoes');
        let listaSolicitacoes = solicitacoesSalvas ? JSON.parse(solicitacoesSalvas) : [];

        const index = listaSolicitacoes.findIndex(s => s.id == idSolicitacao);

        if (index > -1) {
            listaSolicitacoes[index].status = novoStatus;
            localStorage.setItem('sigo_solicitacoes', JSON.stringify(listaSolicitacoes));
            
            // Re-carrega a tabela e fecha o modal
            fecharModal();
            // Atualiza a lista local para a próxima iteração
            minhasSolicitacoes.find(s => s.id === idSolicitacao).status = novoStatus; 
            
            // Tenta obter o filtro ativo e recarrega
            const filtroAtivo = filterContainer.querySelector('.filter-button.active').dataset.unidade;
            carregarSolicitacoes(filtroAtivo);
            
            window.globalAlert(`Solicitação ${novoStatus.toLowerCase()}!`, "Status Atualizado");
        } else {
            window.globalAlert("Erro ao atualizar status: solicitação não encontrada.", "Erro");
        }
    }

    // --- FUNÇÃO DE RENDERIZAÇÃO DA TABELA ---
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
    
    // --- LÓGICA DO MODAL ---
    function adicionarEventosModal() {
        const detalhesBtns = document.querySelectorAll('.ver-detalhes');
        detalhesBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                solicitacaoIdAtual = Number(btn.dataset.id);

                const solicitacao = minhasSolicitacoes.find(s => s.id === solicitacaoIdAtual);
                if (!solicitacao) return;

                // Preenche o modal
                document.getElementById('det-unidade').innerText = solicitacao.unidade;
                document.getElementById('det-solicitante').innerText = solicitacao.solicitante;
                document.getElementById('det-turno').innerText = solicitacao.turno;
                document.getElementById('det-data').innerText = solicitacao.data;
                document.getElementById('det-qtd').innerText = `${solicitacao.qtd} Colaborador(es)`;
                document.getElementById('det-periodo').innerText = solicitacao.periodo;
                document.getElementById('det-motivo').innerText = solicitacao.motivo;
                
                // Define o status no modal
                let statusBadge = '';
                if (solicitacao.status === 'Pendente') {
                    statusBadge = `<span class="badge badge-warning">Pendente</span>`;
                    btnAprovar.style.display = 'inline-block';
                    btnRecusar.style.display = 'inline-block';
                    btnFechar.style.display = 'none';
                } else if (solicitacao.status === 'Aprovado') {
                    statusBadge = `<span class="badge badge-success">Aprovado</span>`;
                    btnAprovar.style.display = 'none';
                    btnRecusar.style.display = 'none';
                    btnFechar.style.display = 'inline-block';
                } else { // Recusado
                    statusBadge = `<span class="badge badge-danger">Recusado</span>`;
                    btnAprovar.style.display = 'none';
                    btnRecusar.style.display = 'none';
                    btnFechar.style.display = 'inline-block';
                }
                document.getElementById('det-status').innerHTML = statusBadge;

                modal.classList.add('show');
            });
        });
    }

    const fecharModal = () => {
        modal.classList.remove('show');
        solicitacaoIdAtual = null;
    };
    closeBtn.addEventListener('click', fecharModal);
    btnFechar.addEventListener('click', fecharModal);
    window.addEventListener('click', e => { if (e.target === modal) fecharModal(); });

    // Ações do modal: Aprovar/Recusar
    if (btnAprovar) {
        btnAprovar.addEventListener('click', () => {
            window.globalConfirm("Deseja realmente **aprovar** esta solicitação?", (result) => {
                if (result) {
                    atualizarStatus(solicitacaoIdAtual, 'Aprovado');
                }
            }, "Aprovar", "Cancelar", "Confirmar Aprovação");
        });
    }

    if (btnRecusar) {
        btnRecusar.addEventListener('click', () => {
            window.globalConfirm("Deseja realmente **recusar** esta solicitação?", (result) => {
                if (result) {
                    atualizarStatus(solicitacaoIdAtual, 'Recusado');
                }
            }, "Recusar", "Cancelar", "Confirmar Recusa");
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

    // --- LIMPAR NOTIFICAÇÕES (Mantida) ---
    function limparNotificacoesSolicitacao() {
        if (!userLogado) return;
        let allNotificacoes = JSON.parse(localStorage.getItem('sigo_notificacoes')) || [];
        let algumaAlteracao = false;
        
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