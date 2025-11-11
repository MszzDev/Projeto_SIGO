// js/common/profile-loader.js
// Este script preenche a página de perfil do *usuário logado* (Coordenador ou Supervisor)
document.addEventListener('DOMContentLoaded', () => {
    
    // 1. Pega o usuário logado da sessão
    const userLogado = JSON.parse(sessionStorage.getItem('sigo_user_logado'));

    if (!userLogado) {
        alert('Erro: Nenhum usuário logado.');
        // (Idealmente redireciona para o login)
        return;
    }

    // 2. Função para preencher
    function preencherCampo(id, valor) {
        const campo = document.getElementById(id);
        if (campo) {
            // Se for um input (página do supervisor)
            if (campo.tagName === 'INPUT') {
                campo.value = valor || 'Não informado';
            } 
            // Se for um span (página do coordenador/gerente)
            else {
                campo.textContent = valor || 'Não informado';
            }
        }
    }

    // 3. Preencher Avatar (detecta o avatar correto na página)
    const avatar = document.getElementById('prof-avatar'); // ID do card
    const headerAvatar = document.getElementById('header-user-avatar'); // ID do header
    const sidebarName = document.getElementById('sidebar-user-name'); // ID da sidebar

    if (userLogado.nome) {
        const iniciais = userLogado.nome.substring(0, 2).toUpperCase();
        let avatarSrc = `https://via.placeholder.com/40/003063/ffffff?text=${iniciais}`; // Padrão header
        
        if (userLogado.foto_url) {
            avatarSrc = userLogado.foto_url;
        }

        // Atualiza o avatar do header
        if (headerAvatar) {
            headerAvatar.src = avatarSrc;
            if (userLogado.foto_url) headerAvatar.style.objectFit = 'cover';
        }

        // Atualiza o avatar grande da página de perfil
        if (avatar) {
            const size = avatar.classList.contains('profile-photo') ? '120' : '100';
            avatar.src = userLogado.foto_url ? userLogado.foto_url : `https://via.placeholder.com/${size}/1a3a52/ffffff?text=${iniciais}`;
            if (userLogado.foto_url) avatar.style.objectFit = 'cover';
        }
        
        // Atualiza nome na sidebar
        if(sidebarName) {
            sidebarName.textContent = `Olá, ${userLogado.nome.split(' ')[0]}`;
        }
    }

    // 4. Preencher Campos (com base nos IDs do HTML)
    preencherCampo('prof-cargo', userLogado.cargo);
    preencherCampo('prof-unidade', userLogado.unidade);
    preencherCampo('prof-id', userLogado.id_usuario);
    preencherCampo('prof-periodo', userLogado.periodo);
    preencherCampo('prof-nome', userLogado.nome);
    preencherCampo('prof-nome-social', userLogado.nome_social);
    preencherCampo('prof-rg', userLogado.rg);
    preencherCampo('prof-cpf', userLogado.cpf);
    preencherCampo('prof-data-nascimento', userLogado.data_nascimento);
    preencherCampo('prof-telefone', userLogado.telefone);
    preencherCampo('prof-email', userLogado.email);
    preencherCampo('prof-cep', userLogado.cep);
    preencherCampo('prof-bairro', userLogado.bairro);
    preencherCampo('prof-logradouro', userLogado.logradouro);
    preencherCampo('prof-complemento', userLogado.complemento);
    preencherCampo('prof-numero', userLogado.numero);
    preencherCampo('prof-banco', userLogado.banco);
    preencherCampo('prof-agencia', userLogado.agencia);
    preencherCampo('prof-conta', userLogado.conta);
    preencherCampo('prof-tipo-conta', userLogado.tipo_conta);
    preencherCampo('prof-chave-pix', userLogado.chave_pix);
});