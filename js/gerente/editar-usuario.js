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