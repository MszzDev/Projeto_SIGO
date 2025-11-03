document.addEventListener('DOMContentLoaded', () => {
    const logoutBtn = document.getElementById('logout-btn'); // Botão principal de Sair
    const exitModal = document.getElementById('exit-modal'); // Overlay do Modal
    const confirmBtn = document.getElementById('confirm-btn'); // Botão Confirmar no Modal
    const cancelBtn = document.getElementById('cancel-btn'); // Botão Cancelar no Modal
    const successToast = document.getElementById('success-toast'); // Mensagem Toast

    // --- Funções Auxiliares ---
    function showModal() {
        exitModal.classList.remove('hidden');
    }

    function hideModal() {
        exitModal.classList.add('hidden');
    }

    function showToast() {
        successToast.classList.add('show');
        // Esconder o toast após um tempo
        setTimeout(() => {
            hideToast();
        }, 2500); // 2.5 segundos
    }

     function hideToast() {
        successToast.classList.remove('show');
    }

    // --- Event Listeners ---

    // 1. Mostrar o Modal ao clicar no botão "Sair do Sistema"
    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
            showModal();
        });
    }

    // 2. Esconder o Modal ao clicar em "Cancelar"
    if (cancelBtn) {
        cancelBtn.addEventListener('click', () => {
            hideModal();
        });
    }

    // 3. Processar Saída ao clicar em "Sair" no modal
    if (confirmBtn) {
        confirmBtn.addEventListener('click', () => {
            // 1. Esconde o modal
            hideModal();

            // 2. MOSTRA A MENSAGEM DE SUCESSO (TOAST)
            showToast();

            // ***** LINHA ADICIONADA *****
            // Define que a unidade do supervisor ficou INATIVA
            localStorage.removeItem('sigo_status_unidade_JardimAngela');

            // 3. REDIRECIONAMENTO APÓS UM PEQUENO ATRASO
            const REDIRECT_DELAY_MS = 1500; 

            setTimeout(() => {
                // Redireciona para a tela de login
                window.location.href = '../../login.html';
            }, REDIRECT_DELAY_MS);
        });
    }

    // 4. Esconder o modal ao clicar fora dele (no overlay)
    if (exitModal) {
        exitModal.addEventListener('click', (e) => {
            // Verifica se o clique foi diretamente no overlay (fundo escuro)
            if (e.target === exitModal) {
                hideModal();
            }
        });
    }
});