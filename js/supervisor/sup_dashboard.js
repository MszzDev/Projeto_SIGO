// js/supervisor/sup_dashboard.js
document.addEventListener('DOMContentLoaded', () => {

    // 1. Pega o Supervisor logado
    const userLogado = JSON.parse(sessionStorage.getItem('sigo_user_logado'));
    if (!userLogado || userLogado.cargo !== 'Supervisor') {
        console.error("Nenhum supervisor logado.");
        const greetingEl = document.querySelector('.greeting');
        if (greetingEl) greetingEl.textContent = 'Erro de Login';
        return;
    }

    // 2. Preenche o Cabeçalho
    const greetingEl = document.querySelector('.greeting');
    const unitNameEl = document.querySelector('.unit-name');
    if (greetingEl) greetingEl.textContent = `Olá, ${userLogado.nome.split(' ')[0]}`;
    if (unitNameEl) unitNameEl.textContent = `Unidade ${userLogado.unidade} - Supervisor`;

    // 3. ATUALIZA O CARD DE ESTATÍSTICAS (Escala Removida)
    // O sistema de escalas foi removido. A contagem é definida como 0.
    const countEl = document.querySelector('.header-card-stats .count');
    if (countEl) countEl.textContent = '0'; // Define a contagem como 0 ou placeholder.
    
    // 4. Preenche a Data
    const infoDateEl = document.getElementById('info-date-js');
    if (infoDateEl) {
        const data = new Date();
        // Formata a data
        infoDateEl.textContent = data.toLocaleDateString('pt-BR', {
            month: 'long',
            year: 'numeric'
        }).replace(data.toLocaleDateString('pt-BR', { month: 'long' }), m => m.charAt(0).toUpperCase() + m.slice(1));
    }
});