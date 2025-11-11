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

    // 3. Conta os colaboradores
    const allColaboradores = JSON.parse(localStorage.getItem('sigo_colaboradores')) || [];
    const meusColaboradores = allColaboradores.filter(c => 
        c.unidade === userLogado.unidade && c.cargo === 'Colaborador'
    );
    
    const countEl = document.querySelector('.header-card-stats .count');
    if (countEl) countEl.textContent = meusColaboradores.length;

    // 4. Preenche a Data
    const infoDateEl = document.getElementById('info-date-js');
    if (infoDateEl) {
        const data = new Date();
        // Formata a data para "Novembro, 2025"
        infoDateEl.textContent = data.toLocaleDateString('pt-BR', {
            month: 'long',
            year: 'numeric'
        }).replace(data.toLocaleDateString('pt-BR', { month: 'long' }), m => m.charAt(0).toUpperCase() + m.slice(1)); // Garante a primeira letra maiúscula
    }
});