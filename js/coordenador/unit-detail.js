// js/coordenador/unit-detail.js
document.addEventListener('DOMContentLoaded', function () {
    
    const params = new URLSearchParams(window.location.search);
    const nomeUnidade = decodeURIComponent(params.get('unidade')); 

    const allUnidades = JSON.parse(localStorage.getItem('sigo_unidades')) || [];
    const allColaboradores = JSON.parse(localStorage.getItem('sigo_colaboradores')) || [];

    const estaUnidade = allUnidades.find(u => u.nome === nomeUnidade);
    const estaEquipe = allColaboradores.filter(c => c.unidade === nomeUnidade);
    // ATUALIZADO: Pega TODOS os supervisores
    const supervisoresDaUnidade = estaEquipe.filter(c => c.cargo === 'Supervisor');

    // Preenche infos gerais
    if (nomeUnidade) {
        document.getElementById('unit-detail-title').textContent = `Detalhes da Unidade: ${nomeUnidade}`;
    }
    if (estaUnidade) {
        document.getElementById('unit-codigo').textContent = estaUnidade.codigo || 'N/A';
        document.getElementById('unit-endereco').textContent = estaUnidade.endereco || 'Não informado';
        document.getElementById('unit-coordenador').textContent = estaUnidade.coordenadorNome || 'Nenhum';
    } else {
        document.getElementById('unit-codigo').textContent = 'N/A';
        document.getElementById('unit-endereco').textContent = 'Não cadastrado';
        document.getElementById('unit-coordenador').textContent = 'Não atribuído';
    }

    // --- ATUALIZAÇÃO DO CARD DE SUPERVISOR (Dinâmico) ---
    const supervisorContainer = document.getElementById('supervisor-info-body');
    function atualizarCardSupervisor(turno) {
        if (!supervisorContainer) return;
        const supervisor = supervisoresDaUnidade.find(s => s.periodo === turno);

        if (supervisor) {
            // Meta 3: Usar foto_url se existir
            const iniciais = supervisor.nome ? supervisor.nome.substring(0, 2).toUpperCase() : '??';
            const avatarSrc = supervisor.foto_url 
                ? supervisor.foto_url 
                : `https://via.placeholder.com/50/003063/ffffff?text=${iniciais}`;
            
            // Meta 2: Card é um link
            supervisorContainer.innerHTML = `
                <a href="../common/perfil-colaborador.html?id=${supervisor.id}" class="supervisor-link-wrapper" title="Ver perfil de ${supervisor.nome}">
                    <img src="${avatarSrc}" alt="Supervisor Avatar" class="rounded-circle me-3">
                    <div>
                        <h6 class="mb-0">${supervisor.nome}</h6>
                        <small class="text-muted">Supervisor - ${supervisor.periodo}</small>
                    </div>
                </a>
            `;
        } else {
            supervisorContainer.innerHTML = `<p class="text-muted">Nenhum supervisor para este turno.</p>`;
        }
    }

    // Lógica das Abas
    const tabs = document.querySelectorAll('#collaboratorTabs .nav-link');
    const tabPanes = document.querySelectorAll('#collaboratorTabsContent .tab-pane');
    if (tabs.length > 0 && tabPanes.length > 0) {
        tabs.forEach(tab => {
            tab.addEventListener('click', function (event) {
                event.preventDefault();
                tabs.forEach(t => t.classList.remove('active'));
                tabPanes.forEach(p => { p.classList.remove('active', 'show'); });
                this.classList.add('active');
                const targetPane = document.querySelector(this.getAttribute('data-bs-target'));
                if (targetPane) targetPane.classList.add('active', 'show');
                
                // Meta 1: Atualiza o card
                let turnoSelecionado = 'Manhã';
                if (this.id === 'tarde-tab') turnoSelecionado = 'Tarde';
                if (this.id === 'noite-tab') turnoSelecionado = 'Noite';
                atualizarCardSupervisor(turnoSelecionado);
            });
        });
    }

    // Carregar Status da Unidade
    const badgeElement = document.getElementById('unit-status');
    if (badgeElement) {
        const statusStorageKey = `sigo_status_unidade_${nomeUnidade.replace(/\s/g, '')}`;
        const statusAtivo = localStorage.getItem(statusStorageKey);
        if (statusAtivo === 'Ativa') {
            badgeElement.textContent = 'Ativa';
            badgeElement.classList.remove('badge-secondary');
            badgeElement.classList.add('badge-success');
        } else {
            badgeElement.textContent = 'Inativa';
            badgeElement.classList.remove('badge-success');
            badgeElement.classList.add('badge-secondary');
        }
    }
    
    // Carregar Tabelas de Colaboradores
    function renderizarTabelaTurno(container, lista) {
        // (Esta função permanece a mesma)
        if (!container) return;
        const colaboradoresDoTurno = lista.filter(c => c.cargo === 'Colaborador');
        if (colaboradoresDoTurno.length === 0) {
            container.innerHTML = '<p class="text-muted" style="padding: 15px 0;">Nenhum colaborador registrado para este turno.</p>';
            return;
        }
        let tabelaHtml = `<div class="table-responsive"><table class="table table-hover"><thead>...</thead><tbody>`;
        colaboradoresDoTurno.forEach(colab => {
            tabelaHtml += `
                <tr>
                    <td>${colab.nome}</td>
                    <td><span class="badge badge-success">Ativo</span></td>
                    <td>
                        <a href="../common/perfil-colaborador.html?id=${colab.id}" class="btn btn-sm btn-outline-primary" title="Ver Perfil">
                            <i class="fas fa-eye"></i>
                        </a>
                    </td>
                </tr>
            `;
        });
        tabelaHtml += `</tbody></table></div>`;
        container.innerHTML = tabelaHtml;
    }

    const equipeManha = estaEquipe.filter(c => c.periodo === 'Manhã');
    const equipeTarde = estaEquipe.filter(c => c.periodo === 'Tarde');
    const equipeNoite = estaEquipe.filter(c => c.periodo === 'Noite');
    renderizarTabelaTurno(document.getElementById('manha-content'), equipeManha);
    renderizarTabelaTurno(document.getElementById('tarde-content'), equipeTarde);
    renderizarTabelaTurno(document.getElementById('noite-content'), equipeNoite);

    // Carregamento Inicial
    atualizarCardSupervisor('Manhã');
});