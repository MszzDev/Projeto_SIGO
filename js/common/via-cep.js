// js/common/via-cep.js
document.addEventListener('DOMContentLoaded', () => {

    const cepInput = document.getElementById('cep');
    if (!cepInput) return; // Se não houver campo CEP, não faz nada

    const logradouroInput = document.getElementById('logradouro');
    const bairroInput = document.getElementById('bairro');
    const cidadeInput = document.getElementById('cidade');
    const ufInput = document.getElementById('uf');
    const numeroInput = document.getElementById('numero');
    
    // Labels de feedback
    const cepLabel = document.querySelector('label[for="cep"]');
    const loadingSpan = cepLabel ? cepLabel.querySelector('.cep-loading') : null;
    const errorSpan = cepLabel ? cepLabel.querySelector('.cep-error') : null;

    function showLoading(message) {
        if (loadingSpan) { loadingSpan.textContent = message; loadingSpan.style.display = 'inline'; }
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
    function clearAddressFields() {
        if(logradouroInput) logradouroInput.value = '';
        if(bairroInput) bairroInput.value = '';
        if(cidadeInput) cidadeInput.value = '';
        if(ufInput) ufInput.value = '';
    }
    
    // Trava para evitar múltiplas chamadas
    let isFetching = false;

    async function fetchAddress(cep) {
        if (isFetching) return;
        isFetching = true;
        
        clearAddressFields();
        showLoading('Buscando...');
        
        try {
            const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
            if (!response.ok) {
                throw new Error('Erro na rede ao buscar CEP.');
            }
            const data = await response.json();

            if (data.erro) {
                showError('CEP não encontrado.');
            } else {
                // Preenche os campos
                if(logradouroInput) logradouroInput.value = data.logradouro;
                if(bairroInput) bairroInput.value = data.bairro;
                if(cidadeInput) cidadeInput.value = data.localidade;
                if(ufInput) ufInput.value = data.uf;
                hideFeedback();
                
                // Foca no campo "Número"
                if(numeroInput) numeroInput.focus();
            }

        } catch (error) {
            console.error('Erro ViaCEP:', error);
            showError('Erro ao buscar CEP.');
        } finally {
            isFetching = false;
        }
    }

    // Adiciona o listener no evento 'blur' (quando o usuário sai do campo)
    cepInput.addEventListener('blur', (e) => {
        const cep = e.target.value.replace(/\D/g, ''); // Remove traços e pontos

        if (cep.length === 8) {
            fetchAddress(cep);
        } else if (cep.length > 0) {
            clearAddressFields();
            showError('CEP inválido. Deve conter 8 dígitos.');
        } else {
            clearAddressFields();
            hideFeedback();
        }
    });
});