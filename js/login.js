// mszzdev/projeto_sigo/Projeto_SIGO-6cfac3251b9ada9a0b333c00ca1cccf1b37dbb40/js/login.js
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

    // Login do Gerente sem bd
    if (username === 'G123' && password === '123') {
        
        // Gerente falso
        // CORRIGIDO: Adicionado todos os campos necessários para o profile-loader e edit-profile-self
        const tempGerente = {
            id: "master",
            nome: "Gerente",
            cargo: "Gerente",
            id_usuario: "G123",
            foto_url: '../../img/perf.png',
            unidade: "N/A",
            periodo: "N/A",
            nome_social: "",
            rg: "000000000", 
            cpf: "000.000.000-00",
            data_nascimento: "1980-01-01",
            telefone: "(00) 00000-0000",
            email: "gerente@sigo.com.br",
            cep: "00000-000",
            logradouro: "Rua Falsa Gerencial",
            numero: "1",
            bairro: "Centro",
            cidade: "São Paulo",
            uf: "SP",
            complemento: "Escritório Central",
            banco_codigo: "001",
            banco_nome: "Banco do Brasil",
            agencia: "1234",
            conta: "567890",
            tipo_conta: "Corrente",
            chave_pix: "gerente@pix.com"
        };
        sessionStorage.setItem('sigo_user_logado', JSON.stringify(tempGerente));
        window.location.href = 'telas/gerente/dashboard.html';
        return; 
    }

    // Lógica Padrão de Login
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