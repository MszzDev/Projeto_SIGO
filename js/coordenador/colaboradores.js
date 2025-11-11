// js/coordenador/colaboradores.js
document.addEventListener('DOMContentLoaded', () => {
    const container = document.getElementById('colaboradores-container');
    if (!container) return;

    // 1. Pega o usuário logado
    const userLogado = JSON.parse(sessionStorage.getItem('sigo_user_logado'));
    if (!userLogado || userLogado.cargo !== 'Coordenador') {
        container.innerHTML = '<p class="text-muted" style="padding: 20px;">Erro: Usuário não é um coordenador.</p>';
        return;
    }

    // 2. Carrega todos os dados
    const allUnidades = JSON.parse(localStorage.getItem('sigo_unidades')) || [];
    const allColaboradores = JSON.parse(localStorage.getItem('sigo_colaboradores')) || [];

    // 3. Filtra as unidades deste coordenador
    const minhasUnidades = allUnidades.filter(u => u.coordenadorId == userLogado.id);
    const minhasUnidadesNomes = minhasUnidades.map(u => u.nome);

    container.innerHTML = ''; // Limpa o "Carregando..."

    if (minhasUnidades.length === 0) {
        container.innerHTML = '<p class="text-muted" style="padding: 20px;">Você não tem unidades associadas.</p>';
        return;
    }

    // 4. Renderiza os blocos
    minhasUnidades.forEach(unidade => {
        // Pega a equipe (Supervisores + Colaboradores) DESSA unidade
        const equipeDaUnidade = allColaboradores.filter(c => 
            c.unidade === unidade.nome && (c.cargo === 'Supervisor' || c.cargo === 'Colaborador')
        );

        let htmlColaboradores = '';
        if (equipeDaUnidade.length > 0) {
            equipeDaUnidade.forEach(colab => {
                let statusBtn = '<button class="ativo-btn">Ativo</button>';
                
                htmlColaboradores += `
                    <div class="colaborador">
                        <span>${colab.nome}</span>
                        <span>Cargo: ${colab.cargo}</span>
                        <span>Turno: ${colab.periodo}</span>
                        ${statusBtn}
                        <span>ID: ${colab.id_usuario}</span>
                        
                        <a href="../common/perfil-colaborador.html?id=${colab.id}" class="view-profile-link" title="Ver Perfil">
                            <i class="fas fa-eye"></i>
                        </a>
                    </div>
                `;
            });
        } else {
            htmlColaboradores = '<p class="text-muted" style="padding: 10px 15px;">Nenhum colaborador nesta unidade.</p>';
        }

        // Adiciona o bloco da unidade ao container
        container.innerHTML += `
            <div class="unidade">
                <h2>Unidade ${unidade.nome}</h2>
                ${htmlColaboradores}
            </div>
        `;
    });

    // 5. Adiciona colaboradores "perdidos" (em unidades que não estão mais com este coordenador)
    const equipeOrfa = allColaboradores.filter(c => 
        !minhasUnidadesNomes.includes(c.unidade) && // Não está na minha lista de unidades
        (c.cargo === 'Supervisor' || c.cargo === 'Colaborador') // Mas é um subalterno
    );
    // (Esta seção pode ser removida se não for desejada)
});