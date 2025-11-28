// js/common/profile-loader.js
// Este script preenche a página de perfil do *usuário logado* (Coordenador ou Supervisor)
document.addEventListener('DOMContentLoaded', () => {
    
    // 1. Pega o usuário logado da sessão
    const userLogado = JSON.parse(sessionStorage.getItem('sigo_user_logado'));

    if (!userLogado) {
        return;
    }

    const nomeCurto = userLogado.nome.split(' ')[0];
    let avatarSrc = userLogado.foto_url ? userLogado.foto_url : '../../img/perf.png';

    // --- FUNÇÃO DE ATUALIZAÇÃO DO HEADER/SIDEBAR (COM FALLBACK) ---
    (function updateHeader() {
        // Elementos de ID (Método preferido)
        let headerName = document.getElementById('header-user-name');
        let headerRole = document.getElementById('header-user-role');
        let sidebarName = document.getElementById('sidebar-user-name');
        let headerAvatar = document.getElementById('header-user-avatar');

        // FALLBACK: Se o elemento ID não for encontrado, tenta usar o seletor de classe/tag
        if (!headerName) headerName = document.querySelector('.user-profile .user-info .user-name');
        if (!headerRole) headerRole = document.querySelector('.user-profile .user-info .user-role');
        
        // Aplica o conteúdo
        if (headerName) headerName.textContent = userLogado.nome;
        if (headerRole) headerRole.textContent = userLogado.cargo;
        if (sidebarName) {
            sidebarName.textContent = `Olá, ${nomeCurto}`;
        }
        
        // Atualiza Avatar
        if (headerAvatar) {
            headerAvatar.src = avatarSrc;
            if (userLogado.foto_url) headerAvatar.style.objectFit = 'cover';
        }
    })();
    
    // 2. Função para preencher a página de perfil (prof-campos)
    function preencherCampo(id, valor) {
        const campo = document.getElementById(id);
        if (campo) {
            if (campo.tagName === 'INPUT') {
                campo.value = valor || 'Não informado';
            } 
            else {
                campo.textContent = valor || 'Não informado';
            }
        }
    }

    // 3. Preencher Avatar Grande do Perfil (se estiver na página de perfil)
    const avatar = document.getElementById('prof-avatar'); 
    if (avatar && userLogado.nome) {
        avatar.src = avatarSrc;
        if (userLogado.foto_url) avatar.style.objectFit = 'cover';
    }


    // 4. Preencher Campos (com base nos IDs do HTML)
    
    // Posição
    preencherCampo('prof-cargo', userLogado.cargo);
    preencherCampo('prof-unidade', userLogado.unidade);
    preencherCampo('prof-id', userLogado.id_usuario);
    preencherCampo('prof-periodo', userLogado.periodo);
    
    // Pessoais
    preencherCampo('prof-nome', userLogado.nome);
    preencherCampo('prof-nome-social', userLogado.nome_social);
    preencherCampo('prof-rg', userLogado.rg);
    preencherCampo('prof-cpf', userLogado.cpf);
    preencherCampo('prof-data-nascimento', userLogado.data_nascimento);
    preencherCampo('prof-telefone', userLogado.telefone);
    preencherCampo('prof-email', userLogado.email);
    
    // Endereço 
    preencherCampo('prof-cep', userLogado.cep);
    preencherCampo('prof-bairro', userLogado.bairro);
    preencherCampo('prof-logradouro', userLogado.logradouro);
    preencherCampo('prof-complemento', userLogado.complemento);
    preencherCampo('prof-numero', userLogado.numero);
    
    // Bancários 
    preencherCampo('prof-banco_nome', userLogado.banco_nome); 
    preencherCampo('prof-agencia', userLogado.agencia);
    preencherCampo('prof-conta', userLogado.conta);
    preencherCampo('prof-tipo_conta', userLogado.tipo_conta);
    preencherCampo('prof-chave_pix', userLogado.chave_pix);
});