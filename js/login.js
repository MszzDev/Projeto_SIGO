// js/login.js (Versão MESTRE TEMPORÁRIA)
document.getElementById('login-form').addEventListener('submit', function(event) {
    event.preventDefault(); 

    const usernameInput = document.getElementById('username');
    const passwordInput = document.getElementById('password');
    const errorMessage = document.getElementById('error-message');

    const username = usernameInput.value.trim();
    const password = passwordInput.value.trim();

    errorMessage.classList.remove('visible');
    usernameInput.classList.remove('input-error');
    passwordInput.classList.remove('input-error');

    // --- LÓGICA MESTRE TEMPORÁRIA ---
    // Permite o login G123 mesmo se o banco de dados estiver vazio
    if (username === 'G123' && password === '123') {
        
        // Cria um usuário Gerente FALSO na sessão SÓ para esta vez
        const tempGerente = {
            id: "master",
            nome: "Gerente ADM",
            cargo: "Gerente",
            id_usuario: "G123"
        };
        sessionStorage.setItem('sigo_user_logado', JSON.stringify(tempGerente));
        window.location.href = 'telas/gerente/dashboard.html';
        return; // Pula o resto da verificação
    }
    // --- FIM DA LÓGICA MESTRE ---


    // Lógica Padrão (para todos os outros usuários)
    const allUsers = JSON.parse(localStorage.getItem('sigo_colaboradores')) || [];
    const user = allUsers.find(u => u.id_usuario === username);

    if (user && password === '123') {
        sessionStorage.setItem('sigo_user_logado', JSON.stringify(user));

        if (user.cargo === 'Gerente') {
            window.location.href = 'telas/gerente/dashboard.html';
        } else if (user.cargo === 'Coordenador') {
            window.location.href = 'telas/coordenador/dashboard.html';
        } else if (user.cargo === 'Supervisor') {
            const statusKey = `sigo_status_unidade_${user.unidade.replace(/\s/g, '')}`;
            localStorage.setItem(statusKey, 'Ativa');
            window.location.href = 'telas/supervisor/sup_dashboard.html';
        } else {
             errorMessage.textContent = 'Cargo desconhecido. Contate o admin.';
             errorMessage.classList.add('visible');
        }

    } else {
        errorMessage.textContent = 'ID ou Senha inválidos.';
        errorMessage.classList.add('visible');
        usernameInput.classList.add('input-error');
        passwordInput.classList.add('input-error');
    }
});