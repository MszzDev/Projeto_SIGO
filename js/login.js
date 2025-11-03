document.getElementById('login-form').addEventListener('submit', function(event) {
    event.preventDefault(); // Impede o envio padrão do formulário

    const usernameInput = document.getElementById('username');
    const passwordInput = document.getElementById('password');
    const errorMessage = document.getElementById('error-message');

    const username = usernameInput.value.trim();
    const password = passwordInput.value.trim();

    // Limpa estilos de erro anteriores
    errorMessage.classList.remove('visible');
    usernameInput.classList.remove('input-error');
    passwordInput.classList.remove('input-error');

   // Verifica as credenciais
    if (username === 'C123' && password === '123') {
        // Redireciona para o dashboard do Coordenador
        window.location.href = 'telas/coordenador/dashboard.html';
    
    } else if (username === 'S123' && password === '123') {
        // Define que o supervisor S123 (Jardim Ângela) está ATIVO
        localStorage.setItem('sigo_status_unidade_JardimAngela', 'Ativa');
        // Redireciona para o dashboard do Supervisor
        window.location.href = 'telas/supervisor/sup_dashboard.html';

    // --- NOVO BLOCO ADICIONADO ---
    } else if (username === 'G123' && password === '123') {
        // Redireciona para o novo dashboard do Gerente
        window.location.href = 'telas/gerente/dashboard.html';
    // --- FIM DO NOVO BLOCO ---

    } else {
        // Exibe mensagem de erro
        errorMessage.classList.add('visible');
        usernameInput.classList.add('input-error');
        passwordInput.classList.add('input-error');
    }
});
