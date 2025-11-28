// js/supervisor/sup_escalas_hoje.js
document.addEventListener('DOMContentLoaded', () => {

    const userLogado = JSON.parse(sessionStorage.getItem('sigo_user_logado'));
    const allColaboradores = JSON.parse(localStorage.getItem('sigo_colaboradores')) || [];
    const sigoEscalas = JSON.parse(localStorage.getItem('sigo_escalas')) || {};

    // --- Elementos de cada turno (Novos) ---
    const turnoGroups = {
        'Manhã': document.querySelector('.turno-group.manha'),
        'Tarde': document.querySelector('.turno-group.tarde'),
        'Noite': document.querySelector('.turno-group.noite')
    };

    const titulo = document.getElementById('escala-titulo');
    const subtitulo = document.getElementById('escala-subtitulo');
    
    if (!userLogado || userLogado.cargo !== 'Supervisor' || !userLogado.periodo || userLogado.periodo === 'N/A') {
        if(titulo) titulo.textContent = "Erro";
        if(subtitulo) subtitulo.textContent = "Perfil de supervisor ou turno não encontrado.";
        return;
    }
    
    const MEU_TURNO = userLogado.periodo; // 'Manhã', 'Tarde' ou 'Noite'

    // --- 2. Determinar o Dia de Hoje ---
    const dias = ['dom', 'seg', 'ter', 'qua', 'qui', 'sex', 'sab'];
    const hoje = new Date();
    const diaKey = dias[hoje.getDay()]; // 'seg', 'ter', etc.
    const dataFormatada = hoje.toLocaleDateString('pt-BR', { dateStyle: 'full' }); 

    if(subtitulo) subtitulo.textContent = `${dataFormatada} - Turno ${MEU_TURNO}`;

    // --- 3. Encontrar a Escala de Hoje ---
    const MINHA_UNIDADE = userLogado.unidade;
    const escalaDaUnidade = sigoEscalas[MINHA_UNIDADE] || {};

    const idsManha = escalaDaUnidade[`${diaKey}-manha`] || [];
    const idsTarde = escalaDaUnidade[`${diaKey}-tarde`] || [];
    const idsNoite = escalaDaUnidade[`${diaKey}-noite`] || [];

    // --- 4. Função para Renderizar Lista ---
    function renderTurno(containerId, countId, ids, turnoLabel) {
        const container = document.getElementById(containerId);
        const countEl = document.getElementById(countId);
        if (!container || !countEl) return;

        countEl.textContent = `${ids.length} Colaborador(es)`;
        container.innerHTML = '';

        if (ids.length === 0) {
            container.innerHTML = `<p style="padding: 20px; text-align: center; color: var(--text-muted);">Nenhum colaborador escalado para o turno ${turnoLabel}.</p>`;
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
    
    // --- 5. Renderizar SOMENTE O MEU TURNO ---
    
    // Esconde todos os grupos de turno no JS para garantir
    Object.values(turnoGroups).forEach(group => {
        if(group) group.style.display = 'none';
    });

    if (MEU_TURNO === 'Manhã') {
        const group = turnoGroups['Manhã'];
        if(group) group.style.display = 'block';
        renderTurno('lista-manha', 'count-manha', idsManha, 'Manhã');
    } else if (MEU_TURNO === 'Tarde') {
        const group = turnoGroups['Tarde'];
        if(group) group.style.display = 'block';
        renderTurno('lista-tarde', 'count-tarde', idsTarde, 'Tarde');
    } else if (MEU_TURNO === 'Noite') {
        const group = turnoGroups['Noite'];
        if(group) group.style.display = 'block';
        renderTurno('lista-noite', 'count-noite', idsNoite, 'Noite');
    }
});