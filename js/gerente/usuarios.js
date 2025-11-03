// js/gerente/usuarios.js (ATUALIZADO)
document.addEventListener('DOMContentLoaded', () => {
    const tableBody = document.getElementById('user-table-body');
    if (!tableBody) return;

    // --- 1. FUNÇÃO PRINCIPAL PARA CARREGAR A TABELA ---
    function carregarTabelaUsuarios() {
        const colaboradoresSalvos = localStorage.getItem('sigo_colaboradores');
        const listaColaboradores = colaboradoresSalvos ? JSON.parse(colaboradoresSalvos) : [];

        // Filtra apenas por Coordenador e Supervisor
        const listaUsuarios = listaColaboradores.filter(
            colab => colab.cargo === "Coordenador" || colab.cargo === "Supervisor"
        );

        tableBody.innerHTML = ''; // Limpa a tabela

        if (listaUsuarios.length === 0) {
            tableBody.innerHTML = '<tr><td colspan="6" style="text-align:center; padding: 20px;">Nenhum Coordenador ou Supervisor cadastrado.</td></tr>';
            return;
        }

        listaUsuarios.forEach(user => {
            const cargoClass = user.cargo === 'Coordenador' ? 'badge-coordenador' : 'badge-supervisor';
            const avatarIniciais = user.nome ? user.nome.substring(0, 2).toUpperCase() : '??';

            tableBody.innerHTML += `
                <tr data-user-id="${user.id}" data-user-name="${user.nome || 'Usuário sem nome'}">
                    <td>
                        <img src="https://via.placeholder.com/32/1a3a52/ffffff?text=${avatarIniciais}" alt="Avatar" class="user-avatar">
                        <span>
                            ${user.nome || 'Nome não encontrado'}
                            <small class="d-block text-muted">${user.email || 'email@naoinformado.com'}</small>
                        </span>
                    </td>
                    <td>${user.id_usuario || 'S/ ID'}</td>
                    <td><span class="badge ${cargoClass}">${user.cargo}</span></td>
                    <td>${user.unidade || 'N/A'}</td>
                    <td>${user.periodo || 'N/A'}</td>
                    <td>
                        <a href="editar-usuario.html?id=${user.id}" class="btn btn-sm btn-outline-primary btn-edit" title="Editar">
                            <i class="fas fa-pencil-alt"></i>
                        </a>
                        <button class="btn btn-sm btn-danger btn-remove" title="Remover">
                            <i class="fas fa-trash-alt"></i>
                        </button>
                    </td>
                </tr>
            `;
        });

        // 4. Adiciona os event listeners aos novos botões de "Remover"
        adicionarEventListenersRemover();
    }

    // --- 2. FUNÇÃO PARA ADICIONAR CLIQUE DE "REMOVER" ---
    function adicionarEventListenersRemover() {
        const removeButtons = document.querySelectorAll('.btn-remove');
        removeButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const row = e.currentTarget.closest('tr');
                const userId = Number(row.dataset.userId);
                const userName = row.dataset.userName;

                if (!userId) return;

                // Pede confirmação
                if (confirm(`Tem certeza que deseja remover o usuário "${userName}"? Esta ação não pode ser desfeita.`)) {
                    removerUsuario(userId);
                }
            });
        });
    }

    // --- 3. FUNÇÃO QUE REMOVE O USUÁRIO DO LOCALSTORAGE ---
    function removerUsuario(id) {
        const colaboradoresSalvos = localStorage.getItem('sigo_colaboradores');
        let listaColaboradores = colaboradoresSalvos ? JSON.parse(colaboradoresSalvos) : [];
        
        // Filtra a lista, mantendo todos EXCETO o usuário com o ID
        const novaLista = listaColaboradores.filter(c => c.id !== id);

        // Salva a nova lista de volta
        localStorage.setItem('sigo_colaboradores', JSON.stringify(novaLista));

        // Recarrega a tabela para mostrar a mudança
        carregarTabelaUsuarios();
    }

    // --- INICIALIZAÇÃO ---
    carregarTabelaUsuarios();
});