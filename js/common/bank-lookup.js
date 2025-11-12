// js/common/bank-lookup.js
document.addEventListener('DOMContentLoaded', () => {

    const bankCodeInput = document.getElementById('banco_codigo');
    if (!bankCodeInput) return; // Se não houver campo de código, não faz nada

    const bankNameInput = document.getElementById('banco_nome');
    
    // Labels de feedback
    const bankLabel = document.querySelector('label[for="banco_codigo"]');
    const loadingSpan = document.createElement('span');
    loadingSpan.className = 'cep-loading'; // Reutiliza o estilo do CEP
    loadingSpan.innerHTML = ' <i class="fas fa-spinner fa-spin"></i>';
    
    const errorSpan = document.createElement('span');
    errorSpan.className = 'cep-error'; // Reutiliza o estilo do CEP
    
    if (bankLabel) {
        bankLabel.appendChild(loadingSpan);
        bankLabel.appendChild(errorSpan);
    }

    function showLoading() {
        if (loadingSpan) loadingSpan.style.display = 'inline';
        if (errorSpan) errorSpan.style.display = 'none';
    }
    function showError(message) {
        if (errorSpan) { errorSpan.textContent = message; errorSpan.style.display = 'inline'; }
        if (loadingSpan) loadingSpan.style.display = 'none';
    }
    function hideFeedback() {
        if (loadingSpan) loadingSpan.style.display = 'none';
        if (errorSpan) errorSpan.style.display = 'none';
    }
    
    let isFetching = false;
    let fetchTimeout;

    async function fetchBankName(code) {
        if (isFetching) return;
        isFetching = true;
        
        bankNameInput.value = ''; // Limpa o campo
        showLoading();
        
        try {
            // Usa a BrasilAPI para buscar o banco pelo código
            const response = await fetch(`https://brasilapi.com.br/api/banks/v1/${code}`);
            if (!response.ok) {
                if (response.status === 404) {
                    throw new Error('Código não encontrado.');
                }
                throw new Error('Erro na rede ao buscar banco.');
            }
            const data = await response.json();

            if (data && data.name) {
                bankNameInput.value = data.name; // Preenche o nome do banco
                hideFeedback();
            } else {
                throw new Error('Resposta inválida da API.');
            }

        } catch (error) {
            console.error('Erro BrasilAPI Bancos:', error);
            bankNameInput.value = '';
            showError(error.message);
        } finally {
            isFetching = false;
        }
    }

    // Adiciona o listener no evento 'input'
    bankCodeInput.addEventListener('input', (e) => {
        clearTimeout(fetchTimeout); // Cancela o timeout anterior
        const code = e.target.value.replace(/\D/g, ''); // Remove não-dígitos

        hideFeedback();
        bankNameInput.value = '';

        if (code.length === 3) {
            // Espera 500ms após o usuário parar de digitar para fazer a busca
            fetchTimeout = setTimeout(() => {
                fetchBankName(code);
            }, 500);
        } else if (code.length > 3) {
             showError('Código deve ter 3 dígitos.');
        }
    });
});