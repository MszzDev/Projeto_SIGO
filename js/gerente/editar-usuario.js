// js/gerente/editar-usuario.js
document.addEventListener('DOMContentLoaded', () => {
    
    const form = document.getElementById('edit-user-form');
    if (!form) return;

    const params = new URLSearchParams(window.location.search);
    const userId = Number(params.get('id'));

    if (!userId) {
        window.globalAlert("Erro: ID de usuário não fornecido.", "Erro");
        window.location.href = 'colaboradores.html';
        return;
    }

    const listaColaboradores = JSON.parse(localStorage.getItem('sigo_colaboradores')) || [];
    const usuarioParaEditar = listaColaboradores.find(c => c.id === userId);

    if (!usuarioParaEditar) {
        window.globalAlert("Erro: Usuário não encontrado.", "Erro");
        window.location.href = 'colaboradores.html';
        return;
    }

    // Preenche o formulário com os dados salvos
    Object.keys(usuarioParaEditar).forEach(key => {
        const field = form.elements[key]; 
        if (field) {
            // Garante que a 'unidade' (se não existir na lista padrão) seja adicionada
            if (field.tagName === 'SELECT' && key === 'unidade') {
                let optionExists = Array.from(field.options).some(opt => opt.value === usuarioParaEditar[key]);
                if (!optionExists && usuarioParaEditar[key]) {
                    field.add(new Option(usuarioParaEditar[key], usuarioParaEditar[key]));
                }
            }
            field.value = usuarioParaEditar[key];
        }
    });

    // Evento de salvar
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // --- 1. VALIDAÇÃO DOS CAMPOS OBRIGATÓRIOS E FORMATOS ---
        const REGEX = {
            LOGIN_ID: /^[A-Z]\d{3,}$/, 
            CPF: /^\d{3}\.\d{3}\.\d{3}-\d{2}$/,
            PHONE: /^\(\d{2}\) \d{4,5}-\d{4}$/,
            CEP: /^\d{5}-\d{3}$/,
            BANK_CODE: /^\d{3}$/,
            NUMERIC: /^\d+$/
        };
        
        // Posição
        if (!window.validateField(form.elements['cargo'], null, null)) return;
        if (!window.validateField(form.elements['id_usuario'], REGEX.LOGIN_ID, 'ID de Login deve começar com uma letra maiúscula e ter no mínimo 3 números (Ex: C123).')) return;
        
        // Dados Pessoais
        if (!window.validateField(form.elements['nome'], null, null)) return;
        if (!window.validateField(form.elements['rg'], REGEX.NUMERIC, 'RG deve conter apenas números.')) return;
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
            const usuarioAtualizado = { id: userId }; 
            formData.forEach((value, key) => {
                usuarioAtualizado[key] = value;
            });

            const index = listaColaboradores.findIndex(c => c.id === userId);
            if (index === -1) {
                window.globalAlert("Erro ao salvar: usuário não encontrado.", "Erro");
                return;
            }

            // Atualiza o usuário na lista
            listaColaboradores[index] = usuarioAtualizado;
            localStorage.setItem('sigo_colaboradores', JSON.stringify(listaColaboradores));

            window.globalAlert("Usuário atualizado com sucesso!", "Sucesso");
            
            window.location.href = 'colaboradores.html'; 

        } catch (error) {
            console.error('Erro ao salvar usuário:', error);
            window.globalAlert('Houve um erro ao salvar as alterações.', "Erro");
        }
    });
});