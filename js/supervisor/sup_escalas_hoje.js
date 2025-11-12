// js/supervisor/sup_escalas_hoje.js
document.addEventListener('DOMContentLoaded', () => {

    // --- 1. Carregar Dados ---
    const userLogado = JSON.parse(sessionStorage.getItem('sigo_user_logado'));
    const allColaboradores = JSON.parse(localStorage.getItem('sigo_colaboradores')) || [];
    const sigoEscalas = JSON.parse(localStorage.getItem('sigo_escalas')) || {};

    const titulo = document.getElementById('escala-titulo');
    const subtitulo = document.getElementById('escala-subtitulo');
    
    if (!userLogado || userLogado.cargo !== 'Supervisor') {
        if(titulo) titulo.textContent = "Erro";
        if(subtitulo) subtitulo.textContent = "Perfil de supervisor não encontrado.";
        return;
    }

    // --- 2. Determinar o Dia de Hoje ---
    const dias = ['dom', 'seg', 'ter', 'qua', 'qui', 'sex', 'sab'];
    const hoje = new Date();
    const diaKey = dias[hoje.getDay()]; // 'seg', 'ter', etc.
    const dataFormatada = hoje.toLocaleDateString('pt-BR', { dateStyle: 'full' }); // "terça-feira, 11 de novembro de 2025"

    if(subtitulo) subtitulo.textContent = `${dataFormatada}`;

    // --- 3. Encontrar a Escala de Hoje ---
    const MINHA_UNIDADE = userLogado.unidade;
    const escalaDaUnidade = sigoEscalas[MINHA_UNIDADE] || {};

    // MODIFICADO: Bloco que bloqueava fim de semana foi REMOVIDO
    
    const idsManha = escalaDaUnidade[`${diaKey}-manha`] || [];
    const idsTarde = escalaDaUnidade[`${diaKey}-tarde`] || [];
    const idsNoite = escalaDaUnidade[`${diaKey}-noite`] || [];

    // --- 4. Função para Renderizar Lista ---
    function renderTurno(containerId, countId, ids) {
        const container = document.getElementById(containerId);
        const countEl = document.getElementById(countId);
        if (!container || !countEl) return;

        countEl.textContent = `${ids.length} Colaborador(es)`;
        container.innerHTML = '';

        if (ids.length === 0) {
            container.innerHTML = '<p style="padding: 20px; text-align: center; color: var(--text-muted);">Nenhum colaborador escalado.</p>';
            return;
        }

        ids.forEach(id => {
            const colab = allColaboradores.find(c => c.id == id);
            if (colab) {
                const badgeClass = colab.cargo === 'Supervisor' ? 'badge-supervisor' : 'badge-colaborador';
                
                container.innerHTML += `
                    <a href="../common/perfil-colaborador.html?id=${colab.id}" class="collaborator-item">
                        <span class="collaborator-name">${colab.nome}</span>
                        <div class="collaborator-status">
                            <span class="badge ${badgeClass}">${colab.cargo}</span>
                            <i class="fas fa-eye view-profile-icon"></i>
                        </div>
                    </a>
                `;
            }
        });
    }
    
    // --- 5. Renderizar Todos os Turnos ---
    renderTurno('lista-manha', 'count-manha', idsManha);
    renderTurno('lista-tarde', 'count-tarde', idsTarde);
    renderTurno('lista-noite', 'count-noite', idsNoite);
});