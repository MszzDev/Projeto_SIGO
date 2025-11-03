// js/coordenador/unit-detail.js
document.addEventListener('DOMContentLoaded', function () {
    
    // --- PEGA A UNIDADE DA URL ---
    const params = new URLSearchParams(window.location.search);
    const nomeUnidade = decodeURIComponent(params.get('unidade')); // ex: "Jardim Ângela"

    // --- ATUALIZA TÍTULO E DADOS ESTÁTICOS ---
    if (nomeUnidade) {
        document.querySelector('.welcome-section h2').textContent = `Detalhes da Unidade: ${nomeUnidade}`;
    }

    // --- LÓGICA DAS ABAS (Já existente) ---
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
            }); // Fim do addEventListener
        }); // Fim do tabs.forEach
    } // Fim do if (tabs.length > 0)


    // --- CARREGA STATUS DA UNIDADE (Já existente) ---
    (function carregarStatusUnidadeDetalhe() {
        let status = "Inativa"; // Padrão
        
        // Simulação: Só funciona para Jardim Ângela por enquanto
        if (nomeUnidade === "Jardim Ângela") { 
            const statusJA = localStorage.getItem('sigo_status_unidade_JardimAngela');
            if (statusJA === 'Ativa') {
                status = 'Ativa';
            }
        }
        // (Você pode adicionar lógicas 'else if' para outras unidades aqui)
        
        const badgeElement = document.getElementById('status-unidade-JardimAngela');
        if (badgeElement) {
            if (status === 'Ativa') {
                badgeElement.textContent = 'Ativa';
                badgeElement.classList.remove('badge-secondary', 'badge-warning', 'badge-danger');
                badgeElement.classList.add('badge-success');
            } else {
                badgeElement.textContent = 'Inativa';
                badgeElement.classList.remove('badge-success');
                badgeElement.classList.add('badge-secondary');
            }
        }
    })();
    
    // --- CARREGA COLABORADORES DA UNIDADE (NOVO) ---
    (function carregarColaboradoresDaUnidade() {
        if (!nomeUnidade) return; // Não faz nada se não houver unidade na URL

        const colaboradoresSalvos = localStorage.getItem('sigo_colaboradores');
        const listaColaboradores = colaboradoresSalvos ? JSON.parse(colaboradoresSalvos) : [];
        
        // Filtra por esta unidade
        const meusColaboradores = listaColaboradores.filter(c => c.unidade === nomeUnidade);

        // Separa por turno
        const turnos = { Manhã: [], Tarde: [], Noite: [] };
        meusColaboradores.forEach(colab => {
            // Verifica se o turno existe no objeto, se não, ignora
            if (turnos[colab.periodo]) {
                turnos[colab.periodo].push(colab);
            }
        });

        // Renderiza as tabelas
        renderizarTabelaTurno(document.getElementById('manha-content'), turnos.Manhã);
        renderizarTabelaTurno(document.getElementById('tarde-content'), turnos.Tarde);
        renderizarTabelaTurno(document.getElementById('noite-content'), turnos.Noite);
    })();

    /**
     * Preenche o container de um turno com a lista de colaboradores
     * @param {HTMLElement} container - O elemento (ex: #manha-content)
     * @param {Array} lista - A lista de colaboradores daquele turno
     */
    function renderizarTabelaTurno(container, lista) {
        if (!container) return; // Se o container da aba não existir
        
        // Se a lista estiver vazia, mostra a mensagem
        if (lista.length === 0) {
            container.innerHTML = '<p class="text-muted">Nenhum colaborador registrado para este turno.</p>';
            return;
        }

        // Se a lista não estiver vazia, encontra a tabela
        const tabelaContainer = container.querySelector('.table-responsive');
        if (!tabelaContainer) return; // Se a estrutura da tabela não existir

        const tabelaBody = tabelaContainer.querySelector('tbody');
        if (!tabelaBody) return; // Se o <tbody> não existir

        tabelaBody.innerHTML = ''; // Limpa o <tbody>

        // Preenche com os dados
        lista.forEach(colab => {
            tabelaBody.innerHTML += `
                <tr>
                    <td>
                        ${colab.nome}
                    </td>
                    <td><span class="badge badge-success">Ativo</span></td>
                    <td>
                        <a href="../common/perfil-colaborador.html?id=${colab.id}" class="btn btn-sm btn-outline-primary" title="Ver Perfil">
                            <i class="fas fa-eye"></i>
                        </a>
                        
                        <button class="btn btn-sm btn-outline-primary">Editar</button>
                        <button class="btn btn-sm btn-danger">Remover</button>
                    </td>
                </tr>
            `;
        });
    } // Fim da função renderizarTabelaTurno

}); // FIM do DOMContentLoaded