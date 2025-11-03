// js/coordenador/prelecoes.js
document.addEventListener('DOMContentLoaded', () => {
    
    const tabela = document.querySelector('.table tbody');
    const cardHeader = document.querySelector('.card-header h5');
    const filterButtons = document.querySelectorAll('.unit-filters .filter-button');
    const modal = document.getElementById('modal-detalhes');
    if (!modal) return; // Se não houver modal, sai

    const closeBtn = modal.querySelector('.close-btn');
    const btnFechar = modal.querySelector('.btn-fechar');

    // --- FUNÇÃO DE CARREGAMENTO (MODIFICADA) ---
    function carregarPrelecoes(filtroUnidade) {
        if (!tabela) return;

        tabela.innerHTML = ''; // Limpa a tabela

        const prelecoesSalvas = localStorage.getItem('sigo_prelecoes');
        let listaPrelecoes = prelecoesSalvas ? JSON.parse(prelecoesSalvas) : [];

        // ATUALIZA O TÍTULO DO CARD
        if (cardHeader) {
            if (!filtroUnidade || filtroUnidade === "Todos") {
                cardHeader.textContent = `Todas as Preleções`;
            } else {
                cardHeader.textContent = `Preleções - Unidade ${filtroUnidade}`;
            }
        }

        // FILTRA A LISTA
        if (filtroUnidade && filtroUnidade !== "Todos") {
            listaPrelecoes = listaPrelecoes.filter(p => p.unidade === filtroUnidade);
        }

        if (listaPrelecoes.length === 0) {
            tabela.innerHTML = `<tr><td colspan="5" style="text-align:center; padding: 20px;">Nenhuma preleção encontrada para esta unidade.</td></tr>`;
            return;
        }

        listaPrelecoes.forEach(prelecao => {
            let statusBadge = '';
            if (prelecao.status === 'Concluída') {
                statusBadge = `<span class="badge badge-success">Concluída</span>`;
            } else if (prelecao.status === 'Agendada') {
                statusBadge = `<span class="badge badge-info">Agendada</span>`;
            } else if (prelecao.status === 'Cancelada') {
                statusBadge = `<span class="badge badge-danger">Cancelada</span>`;
            }

            const novaLinha = document.createElement('tr');
            novaLinha.innerHTML = `
                <td>${prelecao.titulo}</td>
                <td><span>${prelecao.responsavel} <small class="text-muted d-block">${prelecao.cargo}</small></span></td>
                <td>${prelecao.data}</td>
                <td>${statusBadge}</td>
                <td>
                    <button class="btn btn-sm btn-outline-primary ver-detalhes" data-id="${prelecao.id}">
                       Ver Detalhes
                    </button>
                </td>
            `;
            tabela.appendChild(novaLinha);
        });
        
        // RE-ADICIONA os eventos de clique aos novos botões do modal
        adicionarEventosModal();
    }

    // --- LÓGICA DO MODAL ---
    function adicionarEventosModal() {
        const detalhesBtns = document.querySelectorAll('.ver-detalhes');

        detalhesBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                const prelecaoId = Number(btn.dataset.id);
                if (!prelecaoId) return;

                const prelecoesSalvas = localStorage.getItem('sigo_prelecoes');
                const listaPrelecoes = prelecoesSalvas ? JSON.parse(prelecoesSalvas) : [];
                const prelecao = listaPrelecoes.find(p => p.id === prelecaoId);

                if (!prelecao) {
                    alert("Erro: não foi possível encontrar os detalhes da preleção.");
                    return;
                }
                
                // Preenche o modal
                document.getElementById('det-titulo').innerText = prelecao.titulo;
                document.getElementById('det-responsavel').innerText = prelecao.responsavel;
                document.getElementById('det-cargo').innerText = prelecao.cargo;
                document.getElementById('det-data').innerText = prelecao.data;
                document.getElementById('det-status').innerText = prelecao.status;
                document.getElementById('det-unidade').innerText = prelecao.unidade;
                document.getElementById('det-supervisor').innerText = prelecao.supervisor;
                document.getElementById('det-turno').innerText = prelecao.turno;
                document.getElementById('det-selecao').innerText = prelecao.responsavel;
                document.getElementById('det-funcoes').innerText = prelecao.funcoes;

                modal.classList.add('show');
            });
        });
    }
    const fecharModal = () => modal.classList.remove('show');
    closeBtn.addEventListener('click', fecharModal);
    btnFechar.addEventListener('click', fecharModal);
    window.addEventListener('click', e => { if (e.target === modal) fecharModal(); });
    
    // --- LÓGICA DOS FILTROS ---
    let filtroAtivo = '';
    
    const botaoAtivoInicial = document.querySelector('.unit-filters .filter-button.active');
    if (botaoAtivoInicial) {
        filtroAtivo = botaoAtivoInicial.textContent.trim();
    } else if (filterButtons.length > 0) {
        filterButtons[0].classList.add('active');
        filtroAtivo = filterButtons[0].textContent.trim();
    }

    if (filtroAtivo) {
        carregarPrelecoes(filtroAtivo);
    }

    filterButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault();
            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            const novaUnidade = button.textContent.trim();
            carregarPrelecoes(novaUnidade);
        });
    });
});