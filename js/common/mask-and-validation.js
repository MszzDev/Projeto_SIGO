// js/common/mask-and-validation.js
document.addEventListener('DOMContentLoaded', () => {

    const inputsToMask = [
        { selector: '#cpf', mask: '000.000.000-00' },
        { selector: '#telefone', mask: '(00) 00000-0000' },
        { selector: '#cep', mask: '00000-000' }
    ];

    // Aplica máscaras básicas (simulação de um plugin real)
    function applyMasks() {
        inputsToMask.forEach(item => {
            const element = document.querySelector(item.selector);
            if (element) {
                element.addEventListener('input', (e) => {
                    e.target.value = formatInput(e.target.value, item.mask);
                });
            }
        });
    }

    function formatInput(value, pattern) {
        let i = 0;
        let formatted = '';
        const cleanValue = value.replace(/\D/g, '');

        for (let j = 0; j < pattern.length; j++) {
            const char = pattern[j];
            if (i >= cleanValue.length) break;

            if (char === '0') {
                formatted += cleanValue[i];
                i++;
            } else {
                formatted += char;
            }
        }
        return formatted;
    }

    applyMasks();

    // --- FUNÇÃO GLOBAL DE VALIDAÇÃO ---
    
    /**
     * Valida um campo obrigatório, seu formato ou a idade mínima.
     * @param {HTMLElement} field O elemento do input/select.
     * @param {RegExp|null} regex Expressão regular para validar o formato.
     * @param {string} formatMessage Mensagem de erro de formato.
     * @param {number|null} minAge Idade mínima requerida (para campos 'date').
     * @returns {boolean} True se for válido, False caso contrário (e mostra o alert).
     */
    window.validateField = function(field, regex = null, formatMessage = 'Formato inválido.', minAge = null) {
        const value = field.value.trim();
        let errorMessage = '';

        field.classList.remove('input-error');
        
        // 1. Validação de Campo Obrigatório
        if (field.required && !value) {
            const labelText = field.labels ? field.labels[0].textContent.split('(')[0].trim() : field.name;
            errorMessage = `O campo '${labelText}' é obrigatório.`;
        } 
        // 2. Validação de Formato (se houver regex)
        else if (regex && value && !regex.test(value)) {
            errorMessage = formatMessage;
        }
        // 3. Validação de Idade Mínima (se for um campo de data e minAge for fornecido)
        else if (field.type === 'date' && value && minAge !== null) {
            const today = new Date();
            const birthDate = new Date(value + 'T00:00:00'); // Adiciona 'T00:00:00' para evitar problemas de fuso horário
            // Calcula a data limite (14 anos atrás)
            const minAgeDate = new Date(today.getFullYear() - minAge, today.getMonth(), today.getDate());
            
            if (birthDate > minAgeDate) {
                 const labelText = field.labels ? field.labels[0].textContent.split('(')[0].trim() : field.name;
                 errorMessage = `O(A) ${labelText} deve ser de um(a) colaborador(a) maior de ${minAge} anos.`;
            }
        }


        if (errorMessage) {
            window.globalAlert(errorMessage, "Erro de Validação");
            field.classList.add('input-error');
            field.focus();
            return false;
        }

        return true;
    };
}); 