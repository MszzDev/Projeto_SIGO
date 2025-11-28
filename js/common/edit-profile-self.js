// js/common/edit-profile-self.js
document.addEventListener('DOMContentLoaded', () => {
    
    const form = document.getElementById('edit-profile-form');
    if (!form) return;

    // 1. Pega o usuário logado
    const userLogado = JSON.parse(sessionStorage.getItem('sigo_user_logado'));
    
    if (!userLogado || userLogado.cargo === 'Colaborador') {
        window.globalAlert("Erro: Apenas perfis de Coordenador e Supervisor podem editar seus próprios dados.", "Acesso Negado");
        window.location.href = '../../login.html';
        return;
    }

    // 2. Preenche o formulário com os dados do usuário logado
    Object.keys(userLogado).forEach(key => {
        const field = form.elements[key]; 
        if (field) {
            field.value = userLogado[key];
        }
    });

    // Atualiza o título dinamicamente
    const pageTitle = document.getElementById('page-title');
    if(pageTitle) pageTitle.textContent = `Atualizar Perfil de ${userLogado.cargo}`;


    // 3. Evento de salvar
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // --- VALIDAÇÃO DOS CAMPOS OBRIGATÓRIOS E FORMATOS ---
        const REGEX = {
            CPF: /^\d{3}\.\d{3}\.\d{3}-\d{2}$/,
            PHONE: /^\(\d{2}\) \d{4,5}-\d{4}$/,
            CEP: /^\d{5}-\d{3}$/,
            BANK_CODE: /^\d{3}$/,
            NUMERIC: /^\d+$/
        };
        
        // Dados Pessoais
        if (!window.validateField(form.elements['nome'], null, null)) return;
        if (!window.validateField(form.elements['rg'], REGEX.NUMERIC, 'RG deve conter apenas números.')) return; // VALIDAÇÃO RG
        if (!window.validateField(form.elements['cpf'], REGEX.CPF, 'CPF deve estar no formato 000.000.000-00.')) return;
        if (!window.validateField(form.elements['data_nascimento'], null, null, 14)) return; // VALIDAÇÃO DE IDADE (14 ANOS)
        if (!window.validateField(form.elements['telefone'], REGEX.PHONE, 'Telefone deve estar no formato (00) 00000-0000.')) return;
        if (!window.validateField(form.elements['email'], null, null)) return; 
        
        // Endereço
        if (!window.validateField(form.elements['cep'], REGEX.CEP, 'CEP deve estar no formato 00000-000.')) return;
        if (!window.validateField(form.elements['numero'], null, null)) return;
        
        // Dados Bancários
        if (!window.validateField(form.elements['banco_codigo'], REGEX.BANK_CODE, 'Código do Banco deve ter 3 dígitos.')) return;
        if (!window.validateField(form.elements['agencia'], REGEX.NUMERIC, 'Agência deve conter apenas números.')) return; // VALIDAÇÃO AGÊNCIA
        if (!window.validateField(form.elements['conta'], REGEX.NUMERIC, 'Conta deve conter apenas números.')) return;
        if (!window.validateField(form.elements['tipo_conta'], null, null)) return;
        // --- FIM DA VALIDAÇÃO ---

        try {
            const formData = new FormData(form);
            const usuarioAtualizado = { id: userLogado.id }; 
            
            // 4. Cria o objeto atualizado e mantém campos "disabled"
            formData.forEach((value, key) => {
                // Se o campo estiver disabled (posição), usa o valor original do userLogado
                if (['cargo', 'id_usuario', 'unidade', 'periodo'].includes(key)) {
                     usuarioAtualizado[key] = userLogado[key];
                } else {
                     usuarioAtualizado[key] = value;
                }
            });

            // 5. Atualiza o localStorage (lista completa de colaboradores)
            const listaColaboradores = JSON.parse(localStorage.getItem('sigo_colaboradores')) || [];
            const index = listaColaboradores.findIndex(c => c.id === userLogado.id);

            if (index > -1) {
                // Atualiza o usuário na lista
                listaColaboradores[index] = usuarioAtualizado;
                localStorage.setItem('sigo_colaboradores', JSON.stringify(listaColaboradores));
                
                // 6. Atualiza a sessão do usuário logado
                sessionStorage.setItem('sigo_user_logado', JSON.stringify(usuarioAtualizado));

                window.globalAlert("Perfil atualizado com sucesso!", "Sucesso");
                
                // 7. Redireciona de volta para a tela de visualização (ou dashboard)
                const targetPage = userLogado.cargo === 'Coordenador' ? '../coordenador/profile.html' : '../supervisor/sup_perfil_supervisor.html';
                setTimeout(() => {
                    window.location.href = targetPage;
                }, 500);
            } else {
                window.globalAlert("Erro: Usuário não encontrado no banco de dados.", "Erro Crítico");
            }

        } catch (error) {
            console.error('Erro ao salvar perfil:', error);
            window.globalAlert('Houve um erro ao salvar as alterações.', "Erro");
        }
    });
});