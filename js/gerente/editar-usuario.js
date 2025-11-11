// js/gerente/editar-usuario.js
document.addEventListener('DOMContentLoaded', () => {
    
    const form = document.getElementById('edit-user-form');
    if (!form) return;

    const params = new URLSearchParams(window.location.search);
    const userId = Number(params.get('id'));

    if (!userId) {
        alert("Erro: ID de usuário não fornecido.");
        window.location.href = 'colaboradores.html'; // *** CORREÇÃO DO LINK ***
        return;
    }

    const listaColaboradores = JSON.parse(localStorage.getItem('sigo_colaboradores')) || [];
    const usuarioParaEditar = listaColaboradores.find(c => c.id === userId);

    if (!usuarioParaEditar) {
        alert("Erro: Usuário não encontrado.");
        window.location.href = 'colaboradores.html'; // *** CORREÇÃO DO LINK ***
        return;
    }

    Object.keys(usuarioParaEditar).forEach(key => {
        const field = form.elements[key]; 
        if (field) {
            if (field.tagName === 'SELECT' && key === 'unidade') {
                let optionExists = Array.from(field.options).some(opt => opt.value === usuarioParaEditar[key]);
                if (!optionExists && usuarioParaEditar[key]) {
                    field.add(new Option(usuarioParaEditar[key], usuarioParaEditar[key]));
                }
            }
            field.value = usuarioParaEditar[key];
        }
    });

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        try {
            const formData = new FormData(form);
            const usuarioAtualizado = { id: userId }; 
            formData.forEach((value, key) => {
                usuarioAtualizado[key] = value;
            });

            // (Lógica para salvar nome do coordenador em unidades)
            if (usuarioAtualizado.cargo === 'Unidade') {
                 const coordSelect = form.elements['coordenadorId'];
                 if(coordSelect && coordSelect.value !== 'Nenhum') {
                    usuarioAtualizado.coordenadorNome = coordSelect.options[coordSelect.selectedIndex].text;
                 } else {
                    usuarioAtualizado.coordenadorNome = "Nenhum";
                 }
            }

            const index = listaColaboradores.findIndex(c => c.id === userId);
            if (index === -1) {
                alert("Erro ao salvar: usuário não encontrado.");
                return;
            }

            listaColaboradores[index] = usuarioAtualizado;
            localStorage.setItem('sigo_colaboradores', JSON.stringify(listaColaboradores));

            alert("Usuário atualizado com sucesso!");
            
            // *** CORREÇÃO DO LINK ***
            window.location.href = 'colaboradores.html'; 

        } catch (error) {
            console.error('Erro ao salvar usuário:', error);
            alert('Houve um erro ao salvar as alterações.');
        }
    });
});