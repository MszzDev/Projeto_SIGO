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

    // 3. (LÓGICA ATUALIZADA) Conta os colaboradores NA ESCALA DE HOJE
    const sigoEscalas = JSON.parse(localStorage.getItem('sigo_escalas')) || {};
    let contagemHoje = 0;
    
    const dias = ['dom', 'seg', 'ter', 'qua', 'qui', 'sex', 'sab'];
    const diaKey = dias[new Date().getDay()]; // 'seg', 'ter', etc.

    // MODIFICADO: Verificação de fim de semana REMOVIDA
    const escalaDaUnidade = sigoEscalas[userLogado.unidade] || {};
    const idsManha = escalaDaUnidade[`${diaKey}-manha`] || [];
    const idsTarde = escalaDaUnidade[`${diaKey}-tarde`] || [];
    const idsNoite = escalaDaUnidade[`${diaKey}-noite`] || [];
    contagemHoje = idsManha.length + idsTarde.length + idsNoite.length;
    
    const countEl = document.querySelector('.header-card-stats .count');
    if (countEl) countEl.textContent = contagemHoje;

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