// js/supervisor/sup_sobremim.js
document.addEventListener('DOMContentLoaded', () => {
    const logoutBtn = document.getElementById('logout-btn');
    const exitModal = document.getElementById('exit-modal');
    const confirmBtn = document.getElementById('confirm-btn');
    const cancelBtn = document.getElementById('cancel-btn');
    const successToast = document.getElementById('success-toast');

    // Pega o usuário logado DA SESSÃO para saber qual unidade limpar
    const userLogado = JSON.parse(sessionStorage.getItem('sigo_user_logado'));

    function showModal() { if(exitModal) exitModal.classList.remove('hidden'); }
    function hideModal() { if(exitModal) exitModal.classList.add('hidden'); }
    function showToast() {
        if(successToast) successToast.classList.add('show');
        setTimeout(() => { hideToast(); }, 2500);
    }
     function hideToast() { if(successToast) successToast.classList.remove('show'); }

    // 1. Mostrar o Modal
    if (logoutBtn) { logoutBtn.addEventListener('click', showModal); }

    // 2. Esconder o Modal
    if (cancelBtn) { cancelBtn.addEventListener('click', hideModal); }
    if (exitModal) {
        exitModal.addEventListener('click', (e) => {
            if (e.target === exitModal) hideModal();
        });
    }

    // 3. Processar Saída (Confirmar)
    if (confirmBtn) {
        confirmBtn.addEventListener('click', () => {
            hideModal();
            showToast();

            // *** LÓGICA DE LOGOUT ATUALIZADA E CORRIGIDA ***
            // Define que a unidade deste supervisor ficou INATIVA
            if (userLogado && userLogado.unidade && userLogado.cargo === 'Supervisor') {
                const statusKey = `sigo_status_unidade_${userLogado.unidade.replace(/\s/g, '')}`;
                localStorage.removeItem(statusKey);
                console.log(`Status da ${userLogado.unidade} foi limpo.`);
            }
            
            // Limpa os dados da sessão
            sessionStorage.removeItem('sigo_user_logado');
            // *** FIM DA LÓGICA ATUALIZADA ***

            // Redireciona após o toast
            setTimeout(() => {
                window.location.href = '../../login.html';
            }, 1500);
        });
    }
});