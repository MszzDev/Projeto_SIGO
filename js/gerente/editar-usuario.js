// js/gerente/editar-usuario.js
document.addEventListener('DOMContentLoaded', () => {
    
    const form = document.getElementById('edit-user-form');
    if (!form) return;

    // --- 1. PEGAR ID DA URL E CARREGAR DADOS ---
    const params = new URLSearchParams(window.location.search);
    const userId = Number(params.get('id'));

    if (!userId) {
        alert("Erro: ID de usuário não fornecido.");
        window.location.href = 'usuarios.html'; // Volta para a lista
        return;
    }

    const listaColaboradores = JSON.parse(localStorage.getItem('sigo_colaboradores')) || [];
    const usuarioParaEditar = listaColaboradores.find(c => c.id === userId);

    if (!usuarioParaEditar) {
        alert("Erro: Usuário não encontrado.");
        window.location.href = 'usuarios.html'; // Volta para a lista
        return;
    }

    // --- 2. PREENCHER O FORMULÁRIO ---
    // Pega todas as chaves (nomes dos campos) do objeto salvo
    Object.keys(usuarioParaEditar).forEach(key => {
        const field = form.elements[key]; // Encontra o campo do formulário pelo 'name'
        if (field) {
            field.value = usuarioParaEditar[key];
        }
    });

    // --- 3. SALVAR ALTERAÇÕES (SUBMIT) ---
    form.addEventListener('submit', (e) => {
        e.preventDefault();

        try {
            // Pega os dados atualizados do formulário
            const formData = new FormData(form);
            const usuarioAtualizado = { id: userId }; // Mantém o ID original
            formData.forEach((value, key) => {
                usuarioAtualizado[key] = value;
            });

            // Encontra o índice do usuário antigo na lista
            const index = listaColaboradores.findIndex(c => c.id === userId);
            if (index === -1) {
                alert("Erro ao salvar: usuário não encontrado.");
                return;
            }

            // Substitui o usuário antigo pelo atualizado
            listaColaboradores[index] = usuarioAtualizado;

            // Salva a lista inteira de volta no localStorage
            localStorage.setItem('sigo_colaboradores', JSON.stringify(listaColaboradores));

            alert("Usuário atualizado com sucesso!");
            window.location.href = 'usuarios.html'; // Volta para a lista

        } catch (error) {
            console.error('Erro ao salvar usuário:', error);
            alert('Houve um erro ao salvar as alterações.');
        }
    });
});