// js/common/perfil-colaborador.js
document.addEventListener('DOMContentLoaded', () => {
    
    // Pega o ID da URL (ex: ...html?id=12345)
    const params = new URLSearchParams(window.location.search);
    const colaboradorId = Number(params.get('id'));

    if (!colaboradorId) {
        alert('Erro: ID do colaborador não fornecido.');
        history.back(); // Volta para a página anterior
        return;
    }

    // Busca o colaborador no localStorage
    const listaColaboradores = JSON.parse(localStorage.getItem('sigo_colaboradores')) || [];
    const colab = listaColaboradores.find(c => c.id === colaboradorId);

    if (!colab) {
        alert('Erro: Colaborador não encontrado.');
        history.back(); // Volta para a página anterior
        return;
    }

    // --- FUNÇÃO ATUALIZADA ---
    // Preenche .textContent de spans/etc.
    function preencherCampo(id, valor) {
        const campo = document.getElementById(id);
        if (campo) {
            campo.textContent = valor || 'Não informado';
        }
    }
    
    // --- Preenche os campos ---
    
    // Avatar
    const avatar = document.getElementById('prof-avatar');
    if (avatar && colab.nome) {
        avatar.src = colab.foto_url ? colab.foto_url : '../../img/perf.png';
        if (colab.foto_url) avatar.style.objectFit = 'cover';
    }

    // Posição
    preencherCampo('prof-cargo', colab.cargo);
    preencherCampo('prof-unidade', colab.unidade);
    preencherCampo('prof-id', colab.id_usuario);
    preencherCampo('prof-periodo', colab.periodo);

    // Dados Pessoais
    preencherCampo('prof-nome', colab.nome);
    preencherCampo('prof-nome-social', colab.nome_social);
    preencherCampo('prof-rg', colab.rg);
    preencherCampo('prof-cpf', colab.cpf);
    preencherCampo('prof-data-nascimento', colab.data_nascimento);
    preencherCampo('prof-telefone', colab.telefone);
    preencherCampo('prof-email', colab.email);

    // Endereço
    preencherCampo('prof-cep', colab.cep);
    preencherCampo('prof-bairro', colab.bairro);
    preencherCampo('prof-logradouro', colab.logradouro);
    preencherCampo('prof-complemento', colab.complemento);
    preencherCampo('prof-numero', colab.numero);
    
    // Dados Bancários
    preencherCampo('prof-banco_nome', colab.banco_nome); // Usa o nome do banco
    preencherCampo('prof-agencia', colab.agencia);
    preencherCampo('prof-conta', colab.conta);
    preencherCampo('prof-tipo_conta', colab.tipo_conta);
    preencherCampo('prof-chave_pix', colab.chave_pix);
    
});