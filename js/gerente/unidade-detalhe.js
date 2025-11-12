// js/gerente/unidade-detalhe.js
document.addEventListener('DOMContentLoaded', function () {
    
    // --- 1. PEGAR UNIDADE DA URL (Modificado para ID) ---
    const params = new URLSearchParams(window.location.search);
    const unidadeId = Number(params.get('id')); 

    const btnEditar = document.getElementById('btn-editar-unidade');

    // --- 2. CARREGAR DADOS ---
    const allUnidades = JSON.parse(localStorage.getItem('sigo_unidades')) || [];
    const allColaboradores = JSON.parse(localStorage.getItem('sigo_colaboradores')) || [];

    // --- 3. ENCONTRAR DADOS DA UNIDADE E EQUIPE (Modificado para ID) ---
    const estaUnidade = allUnidades.find(u => u.id === unidadeId);
    
    if (!estaUnidade) {
        document.getElementById('unit-detail-title').textContent = 'Erro: Unidade não encontrada';
        if (btnEditar) btnEditar.style.display = 'none'; // Esconde botão de editar
        return;
    }
    
    const nomeUnidade = estaUnidade.nome; // Pega o nome a partir da unidade encontrada
    const estaEquipe = allColaboradores.filter(c => c.unidade === nomeUnidade);
    // Lógica CORRIGIDA: Pega supervisores da *equipe* (sigo_colaboradores)
    const supervisoresDaUnidade = estaEquipe.filter(c => c.cargo === 'Supervisor');

    // Define o link do botão Editar
    if (btnEditar) {
        btnEditar.href = `editar-unidade.html?id=${unidadeId}`;
    }

    // --- 4. PREENCHER CABEÇALHO E INFO GERAIS ---
    document.getElementById('unit-detail-title').textContent = `Detalhes da Unidade: ${nomeUnidade}`;
    
    // Bloco de Info Gerais
    document.getElementById('unit-codigo').textContent = estaUnidade.codigo || 'N/A';
    document.getElementById('unit-coordenador').textContent = estaUnidade.coordenadorNome || 'Nenhum'; // Mostra o Coordenador
    
    // Bloco de Endereço
    document.getElementById('unit-logradouro').textContent = estaUnidade.logradouro || 'Não informado';
    document.getElementById('unit-numero').textContent = estaUnidade.numero || 'S/N';
    document.getElementById('unit-bairro').textContent = estaUnidade.bairro || 'Não informado';
    document.getElementById('unit-cidade').textContent = estaUnidade.cidade || '';
    document.getElementById('unit-uf').textContent = estaUnidade.uf || '';
    document.getElementById('unit-cep').textContent = estaUnidade.cep || 'Não informado';
    
    // Bloco ESTÁTICO de Supervisores (REMOVIDO, pois voltamos ao dinâmico)

    // --- 5. FUNÇÃO PARA ATUALIZAR O CARD DO SUPERVISOR (LÓGICA RESTAURADA) ---
    const supervisorContainer = document.getElementById('supervisor-info-body');
    function atualizarCardSupervisor(turno) {
        if (!supervisorContainer) return;

        // Procura na lista de colaboradores quem é supervisor desta unidade E deste turno
        const supervisor = supervisoresDaUnidade.find(s => s.periodo === turno);

        if (supervisor) {
            // Se achar um supervisor com PERFIL
            const avatarSrc = supervisor.foto_url ? supervisor.foto_url : '../../img/perf.png';
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
            // Se não achar, verifica se há um NOME cadastrado na unidade
            let supNome = "Nenhum";
            if(turno === 'Manhã') supNome = estaUnidade.supervisorManhaNome;
            else if (turno === 'Tarde') supNome = estaUnidade.supervisorTardeNome;
            else if (turno === 'Noite') supNome = estaUnidade.supervisorNoiteNome;

            if(supNome && supNome !== "Nenhum") {
                 supervisorContainer.innerHTML = `<p class="text-muted">Supervisor definido: ${supNome} (sem perfil de login)</p>`;
            } else {
                 supervisorContainer.innerHTML = `<p class="text-muted">Nenhum supervisor para este turno.</p>`;
            }
        }
    }

    // --- 6. LÓGICA DAS ABAS (Garante que a função seja chamada) ---
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
                if (targetPane) {
                    targetPane.classList.add('active', 'show');
                }
                
                let turnoSelecionado = 'Manhã';
                if (this.id === 'tarde-tab') turnoSelecionado = 'Tarde';
                if (this.id === 'noite-tab') turnoSelecionado = 'Noite';
                
                // CHAMA A FUNÇÃO DINÂMICA
                atualizarCardSupervisor(turnoSelecionado);
            });
        });
    }

    // --- 7. CARREGAR STATUS DA UNIDADE ---
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
    
    // --- 8. CARREGAR TABELAS DE COLABORADORES ---
    function renderizarTabelaTurno(container, lista) {
        if (!container) return;
        const colaboradoresDoTurno = lista.filter(c => c.cargo === 'Colaborador');

        if (colaboradoresDoTurno.length === 0) {
            container.innerHTML = '<p class="text-muted" style="padding: 15px 0;">Nenhum colaborador registrado para este turno.</p>';
            return;
        }

        let tabelaHtml = `
            <div class="table-responsive">
                <table class="table table-hover">
                    <thead> <tr> <th>Funcionário</th> <th>Status</th> <th>Ações</th> </tr> </thead>
                    <tbody>
        `;
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

    // --- 9. DISTRIBUIR EQUIPE NAS ABAS ---
    const equipeManha = estaEquipe.filter(c => c.periodo === 'Manhã');
    const equipeTarde = estaEquipe.filter(c => c.periodo === 'Tarde');
    const equipeNoite = estaEquipe.filter(c => c.periodo === 'Noite');

    renderizarTabelaTurno(document.getElementById('manha-content'), equipeManha);
    renderizarTabelaTurno(document.getElementById('tarde-content'), equipeTarde);
    renderizarTabelaTurno(document.getElementById('noite-content'), equipeNoite);

    // --- 10. CARREGAMENTO INICIAL ---
    atualizarCardSupervisor('Manhã'); // Chama a função para o turno padrão

});