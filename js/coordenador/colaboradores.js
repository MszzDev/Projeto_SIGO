// js/coordenador/colaboradores.js
document.addEventListener('DOMContentLoaded', () => {
    const container = document.querySelector('.container'); // Pega o container principal
    if (!container) return;

    const colaboradoresSalvos = localStorage.getItem('sigo_colaboradores');
    const listaColaboradores = colaboradoresSalvos ? JSON.parse(colaboradoresSalvos) : [];

    // 1. Agrupa os colaboradores por unidade
    const unidades = {};
    listaColaboradores.forEach(colab => {
        if (!unidades[colab.unidade]) {
            unidades[colab.unidade] = [];
        }
        unidades[colab.unidade].push(colab);
    });

    // 2. Limpa o container estático
    container.innerHTML = '';

    // 3. Renderiza os blocos
    for (const nomeUnidade in unidades) {
        let htmlColaboradores = '';
        unidades[nomeUnidade].forEach(colab => {
            let statusBtn = '<button class="ativo-btn">Ativo</button>';
            
            htmlColaboradores += `
                <div class="colaborador">
                    <span>${colab.nome}</span>
                    <span>Turno: ${colab.periodo}</span>
                    ${statusBtn}
                    <span>ID: ${colab.id_usuario}</span>
                    
                    <a href="../common/perfil-colaborador.html?id=${colab.id}" class="view-profile-link" title="Ver Perfil">
                        <i class="fas fa-eye"></i>
                    </a>
                </div>
            `;
        });

        // Adiciona o bloco da unidade ao container
        container.innerHTML += `
            <div class="unidade">
                <h2>Unidade ${nomeUnidade}</h2>
                ${htmlColaboradores}
            </div>
        `;
    }

    if (Object.keys(unidades).length === 0) {
         container.innerHTML = '<p style="padding: 20px; text-align: center; color: var(--text-muted);">Nenhum colaborador cadastrado. Use a página "Adicionar Colaborador".</p>';
    }
});