// ... (início do arquivo)
    meusColaboradores.forEach(colab => {
        // (Simulação de status)
        let statusBadge = '<span class="badge badge-success">Ativo</span>';

        listContainer.innerHTML += `
            <a href="../common/perfil-colaborador.html?id=${colab.id}" class="collaborator-item">
                <span class="collaborator-name">${colab.nome}</span>
                <div class="collaborator-status">
                    ${statusBadge}
                    <i class="fas fa-eye view-profile-icon"></i>
                </div>
            </a>
        `;
    });
// ... (resto do arquivo)