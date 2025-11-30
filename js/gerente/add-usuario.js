// js/gerente/add-usuario.js
document.addEventListener('DOMContentLoaded', () => {
    
    const form = document.getElementById('add-user-form');
    if (!form) return;

    // NOVO: Função para gerar ID baseado no cargo e tamanho da lista
    function generateUserId(cargo, listaColaboradores) {
        let prefix = '';
        if (cargo === 'Coordenador') prefix = 'C';
        else if (cargo === 'Supervisor') prefix = 'S';
        else if (cargo === 'Colaborador') prefix = 'E';
        else return null;

        // Gera um número sequencial simples, a partir de 100
        const baseId = 100 + listaColaboradores.length; 
        
        return prefix + baseId.toString();
    }


    form.addEventListener('submit', (e) => {
        e.preventDefault(); 
        
        // --- 1. VALIDAÇÃO DOS CAMPOS OBRIGATÓRIOS E FORMATOS ---
        const REGEX = {
            CPF: /^\d{3}\.\d{3}\.\d{3}-\d{2}$/,
            PHONE: /^\(\d{2}\) \d{4,5}-\d{4}$/,
            CEP: /^\d{5}-\d{3}$/,
            BANK_CODE: /^\d{3}$/,
            NUMERIC: /^\d+$/
        };
        
        // Posição
        if (!window.validateField(form.elements['cargo'], null, null)) return;
        
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
            const novoUsuario = {};
            formData.forEach((value, key) => {
                novoUsuario[key] = value;
            });
            
            // 2. Lógica para Persistência e Geração de ID
            const colaboradoresSalvos = localStorage.getItem('sigo_colaboradores');
            const listaColaboradores = colaboradoresSalvos ? JSON.parse(colaboradoresSalvos) : [];

            // Adiciona um ID numérico único (Para operações de busca/update)
            novoUsuario.id = Date.now(); 
            
            // NOVO: Gera ID de Login (id_usuario) e adiciona senha/flag temporária
            const cargo = novoUsuario.cargo;
            novoUsuario.id_usuario = generateUserId(cargo, listaColaboradores); 
            
            if (cargo !== 'Gerente') {
                novoUsuario.senha = '123'; // Senha padrão inicial
                novoUsuario.must_change_password = true; // Força a troca no login
            } else {
                 novoUsuario.senha = '123'; // Gerente usa a senha padrão e não troca
                 novoUsuario.must_change_password = false; 
            }
            
            listaColaboradores.unshift(novoUsuario);
            
            localStorage.setItem('sigo_colaboradores', JSON.stringify(listaColaboradores));
            
            window.globalAlert(`Usuário [${novoUsuario.cargo}] com ID de Login **${novoUsuario.id_usuario}** adicionado com sucesso!`, "Usuário Criado");
            
            window.location.href = 'colaboradores.html';

        } catch (error) {
            console.error('Erro ao salvar usuário:', error);
            window.globalAlert('Houve um erro ao salvar o usuário.', "Erro");
        }
    });
});