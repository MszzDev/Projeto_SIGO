// js/coordenador/units.js
document.addEventListener('DOMContentLoaded', () => {
    const container = document.getElementById('unidades-container');
    if (!container) return;

    // 1. Pega o usuário logado
    const userLogado = JSON.parse(sessionStorage.getItem('sigo_user_logado'));
    if (!userLogado || userLogado.cargo !== 'Coordenador') {
        container.innerHTML = '<p class="text-muted" style="padding: 20px;">Erro: Usuário não é um coordenador.</p>';
        return;
    }

    // 2. Carrega as unidades
    const allUnidades = JSON.parse(localStorage.getItem('sigo_unidades')) || [];
    
    // 3. Filtra as unidades deste coordenador (pelo ID único)
    const minhasUnidades = allUnidades.filter(u => u.coordenadorId == userLogado.id);

    container.innerHTML = ''; // Limpa o "Carregando..."
    if (minhasUnidades.length === 0) {
        container.innerHTML = '<p class="text-muted" style="padding: 20px;">Você ainda não foi associado a nenhuma unidade.</p>';
        return;
    }

    // 4. Desenha os cards
    minhasUnidades.forEach(unit => {
        // ATUALIZADO: Link agora usa ?id=
        container.innerHTML += `
            <div class="col-card">
                <a href="unit-detail.html?id=${unit.id}" class="unit-card">
                    <h3 class="unit-card-title">${unit.nome}</h3>
                    <span class="unit-card-code">#${unit.codigo}</span>
                </a>
            </div>
        `;
    });
});