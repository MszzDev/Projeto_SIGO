// js/coordenador/prelecoes.js
document.addEventListener('DOMContentLoaded', () => {
    
    const tbody = document.getElementById('prelecoes-tbody');
    const tableTitle = document.getElementById('table-title');
    const filterContainer = document.getElementById('unidades-filter-container');
    const modal = document.getElementById('modal-detalhes');
    if (!modal) return; 

    const closeBtn = modal.querySelector('.close-btn');
    const btnFechar = modal.querySelector('.btn-fechar');
    
    // 1. Pega o Coordenador logado
    const userLogado = JSON.parse(sessionStorage.getItem('sigo_user_logado'));
    
    // 2. Pega todas as unidades e filtra as dele
    const allUnidades = JSON.parse(localStorage.getItem('sigo_unidades')) || [];
    const minhasUnidades = (userLogado)
        ? allUnidades.filter(u => u.coordenadorId == userLogado.id)
        : [];
    const minhasUnidadesNomes = minhasUnidades.map(u => u.nome);

    // 3. Pega todas as preleções
    const allPrelecoes = JSON.parse(localStorage.getItem('sigo_prelecoes')) || [];
    
    // 4. Filtra preleções que pertencem às unidades deste Coordenador
    const minhasPrelecoes = allPrelecoes.filter(p => minhasUnidadesNomes.includes(p.unidade));

    // --- FUNÇÃO DE RENDERIZAÇÃO ---
    function carregarPrelecoes(filtroUnidade) {
        if (!tbody || !tableTitle) return;
        tbody.innerHTML = ''; 

        let listaFiltrada = minhasPrelecoes;

        if (filtroUnidade === "Todos") {
            tableTitle.textContent = `Todas as Preleções`;
        } else {
            tableTitle.textContent = `Preleções - Unidade ${filtroUnidade}`;
            listaFiltrada = minhasPrelecoes.filter(p => p.unidade === filtroUnidade);
        }

        if (listaFiltrada.length === 0) {
            tbody.innerHTML = `<tr><td colspan="5" class="text-muted text-center p-4">Nenhuma preleção encontrada.</td></tr>`;
            return;
        }

        listaFiltrada.forEach(prelecao => {
            let statusBadge = '';
            if (prelecao.status === 'Concluída') {
                statusBadge = `<span class="badge badge-success">Concluída</span>`;
            } else {
                statusBadge = `<span class="badge badge-info">Agendada</span>`;
            }

            const novaLinha = document.createElement('tr');
            novaLinha.innerHTML = `
                <td>${prelecao.titulo}</td>
                <td><span>${prelecao.responsavel} <small class="text-muted d-block">${prelecao.cargo || 'Supervisor'}</small></span></td>
                <td>${prelecao.data}</td>
                <td>${statusBadge}</td>
                <td>
                    <button class="btn btn-sm btn-outline-primary ver-detalhes" data-id="${prelecao.id}">
                       Ver Detalhes
                    </button>
                </td>
            `;
            tbody.appendChild(novaLinha);
        });
        
        adicionarEventosModal();
    }

    // --- LÓGICA DO MODAL (sem alterações) ---
    function adicionarEventosModal() {
        const detalhesBtns = document.querySelectorAll('.ver-detalhes');
        detalhesBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                const prelecaoId = Number(btn.dataset.id);
                if (!prelecaoId) return;

                const prelecao = allPrelecoes.find(p => p.id === prelecaoId); // Busca na lista geral
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
                document.getElementById('det-selecao').innerText = prelecao.responsavel; // (Revisar esta lógica se 'selecao' for diferente)
                document.getElementById('det-funcoes').innerText = prelecao.funcoes;

                modal.classList.add('show');
            });
        });
    }
    const fecharModal = () => modal.classList.remove('show');
    closeBtn.addEventListener('click', fecharModal);
    btnFechar.addEventListener('click', fecharModal);
    window.addEventListener('click', e => { if (e.target === modal) fecharModal(); });
    
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
                carregarPrelecoes(novaUnidade);
            });
        });
    }

    // --- CARGA INICIAL ---
    carregarPrelecoes("Todos");
});