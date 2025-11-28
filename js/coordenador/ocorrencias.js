// js/coordenador/ocorrencias.js
document.addEventListener('DOMContentLoaded', () => {
    
    const tbody = document.getElementById('ocorrencias-tbody');
    const tableTitle = document.getElementById('table-title');
    const filterContainer = document.getElementById('unidades-filter-container');
    const modal = document.getElementById('modal-detalhes');
    if (!modal) return; 

    const closeBtn = modal.querySelector('.close-btn');
    const btnMarcarResolvida = document.getElementById('btn-marcar-resolvida');
    const btnFechar = document.getElementById('btn-fechar-ocorrencias'); // Novo elemento Fechar
    
    // 1. Pega o Coordenador logado
    const userLogado = JSON.parse(sessionStorage.getItem('sigo_user_logado'));
    
    // 2. Pega todas as unidades e filtra as dele
    const allUnidades = JSON.parse(localStorage.getItem('sigo_unidades')) || [];
    const minhasUnidades = (userLogado)
        ? allUnidades.filter(u => u.coordenadorId == userLogado.id)
        : [];
    const minhasUnidadesNomes = minhasUnidades.map(u => u.nome);

    // 3. Pega todas as ocorrências
    let allOcorrencias = JSON.parse(localStorage.getItem('sigo_ocorrencias')) || [];
    
    // 4. Filtra ocorrências que pertencem às unidades deste Coordenador
    let minhasOcorrencias = allOcorrencias.filter(o => minhasUnidadesNomes.includes(o.unidade));
    
    let ocorrenciaIdAtual = null; // Para saber qual ocorrência fechar

    // --- FUNÇÃO DE RENDERIZAÇÃO ---
    function carregarOcorrencias(filtroUnidade) {
        if (!tbody || !tableTitle) return;
        tbody.innerHTML = ''; 

        let listaFiltrada = minhasOcorrencias;

        if (filtroUnidade === "Todos") {
            tableTitle.textContent = `Todas as Ocorrências`;
        } else {
            tableTitle.textContent = `Ocorrências - Unidade ${filtroUnidade}`;
            listaFiltrada = minhasOcorrencias.filter(o => o.unidade === filtroUnidade);
        }

        if (listaFiltrada.length === 0) {
            tbody.innerHTML = `<tr><td colspan="6" class="text-muted text-center p-4">Nenhuma ocorrência encontrada.</td></tr>`;
            return;
        }

        // Ordena para mostrar 'Abertas' primeiro
        listaFiltrada.sort((a, b) => (a.status === 'Aberta' ? -1 : 1));

        listaFiltrada.forEach(ocorrencia => {
            let statusBadge = '';
            if (ocorrencia.status === 'Aberta') {
                statusBadge = `<span class="badge badge-danger">Aberta</span>`;
            } else {
                statusBadge = `<span class="badge badge-success">Resolvida</span>`;
            }

            const novaLinha = document.createElement('tr');
            novaLinha.innerHTML = `
                <td>${ocorrencia.unidade}</td>
                <td>${ocorrencia.data}</td>
                <td>${ocorrencia.tipo}</td>
                <td>${ocorrencia.supervisor}</td>
                <td>${statusBadge}</td>
                <td>
                    <button class="btn btn-sm btn-outline-secondary ver-detalhes" data-id="${ocorrencia.id}">
                       Detalhes
                    </button>
                </td>
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
                ocorrenciaIdAtual = Number(btn.dataset.id);
                if (!ocorrenciaIdAtual) return;

                const ocorrencia = minhasOcorrencias.find(o => o.id === ocorrenciaIdAtual);
                if (!ocorrencia) return;
                
                // Preenche o modal
                document.getElementById('det-unidade').innerText = ocorrencia.unidade;
                document.getElementById('det-data').innerText = ocorrencia.data;
                document.getElementById('det-supervisor').innerText = ocorrencia.supervisor;
                document.getElementById('det-turno').innerText = ocorrencia.turno;
                document.getElementById('det-tipo').innerText = ocorrencia.tipo;
                document.getElementById('det-descricao').innerText = ocorrencia.descricao;
                document.getElementById('det-status').innerHTML = ocorrencia.status === 'Aberta' 
                    ? `<span class="badge badge-danger">Aberta</span>`
                    : `<span class="badge badge-success">Resolvida</span>`;
                
                // Mostra/esconde botões
                if (ocorrencia.status === 'Aberta') {
                    btnMarcarResolvida.style.display = 'inline-block';
                    btnFechar.style.display = 'none'; // Esconde o Fechar secundário
                } else {
                    btnMarcarResolvida.style.display = 'none';
                    btnFechar.style.display = 'inline-block'; // Mostra o Fechar como única ação
                }
                
                modal.classList.add('show');
            });
        });
    }
    const fecharModal = () => modal.classList.remove('show');
    closeBtn.addEventListener('click', fecharModal);
    btnFechar.addEventListener('click', fecharModal); // Adiciona listener para o novo botão 'Fechar'
    window.addEventListener('click', e => { if (e.target === modal) fecharModal(); });
    
    // --- LÓGICA PARA MARCAR COMO RESOLVIDA ---
    btnMarcarResolvida.addEventListener('click', () => {
        if (!ocorrenciaIdAtual) return;
        
        window.globalConfirm('Tem certeza que deseja marcar esta ocorrência como **Resolvida**?', (result) => {
            if (result) {
                // Atualiza a lista principal (allOcorrencias)
                const indexGlobal = allOcorrencias.findIndex(o => o.id === ocorrenciaIdAtual);
                if (indexGlobal > -1) {
                    allOcorrencias[indexGlobal].status = 'Resolvida';
                    localStorage.setItem('sigo_ocorrencias', JSON.stringify(allOcorrencias));
                }
                
                // Atualiza a lista local (minhasOcorrencias)
                const indexLocal = minhasOcorrencias.findIndex(o => o.id === ocorrenciaIdAtual);
                 if (indexLocal > -1) {
                    minhasOcorrencias[indexLocal].status = 'Resolvida';
                }

                fecharModal();
                const filtroAtivo = filterContainer.querySelector('.filter-button.active').dataset.unidade;
                carregarOcorrencias(filtroAtivo);
            }
        }, 'Marcar Resolvida', 'Cancelar', 'Confirmação');
    });
    
    // --- LÓGICA DOS FILTROS DINÂMICOS ---
    if (filterContainer) {
        minhasUnidades.forEach(unit => {
            filterContainer.innerHTML += `<a href="#" class="filter-button" data-unidade="${unit.nome}">${unit.nome}</a>`;
        });

        const filterButtons = filterContainer.querySelectorAll('.filter-button');
        filterButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                e.preventDefault();
                filterButtons.forEach(btn => btn.classList.remove('active'));
                button.classList.add('active');
                
                const novaUnidade = button.dataset.unidade;
                carregarOcorrencias(novaUnidade);
            });
        });
    }

    // --- LIMPAR NOTIFICAÇÕES (Ao carregar a página) ---
    function limparNotificacoesOcorrencia() {
        if (!userLogado) return;
        let allNotificacoes = JSON.parse(localStorage.getItem('sigo_notificacoes')) || [];
        let algumaAlteracao = false;
        
        allNotificacoes.forEach(n => {
            if (n.coordenadorId == userLogado.id && n.tipo === 'ocorrencia' && n.lida === false) {
                n.lida = true;
                algumaAlteracao = true;
            }
        });

        if (algumaAlteracao) {
            localStorage.setItem('sigo_notificacoes', JSON.stringify(allNotificacoes));
        }
    }

    // --- CARGA INICIAL ---
    carregarOcorrencias("Todos");
    limparNotificacoesOcorrencia();
});