// js/gerente/editar-unidade.js
document.addEventListener('DOMContentLoaded', () => {
    
    const form = document.getElementById('edit-unidade-form');
    if (!form) return;

    // 1. Pegar o ID da Unidade pela URL
    const params = new URLSearchParams(window.location.search);
    const unidadeId = Number(params.get('id'));

    if (!unidadeId) {
        window.globalAlert("Erro: ID da unidade não fornecido.", "Erro");
        window.location.href = 'unidades.html';
        return;
    }

    // 2. Carregar os dados
    const listaUnidades = JSON.parse(localStorage.getItem('sigo_unidades')) || [];
    const unidadeParaEditar = listaUnidades.find(u => u.id === unidadeId);

    if (!unidadeParaEditar) {
        window.globalAlert("Erro: Unidade não encontrada.", "Erro");
        window.location.href = 'unidades.html';
        return;
    }

    // 3. Preencher o formulário
    Object.keys(unidadeParaEditar).forEach(key => {
        const field = form.elements[key]; 
        if (field) {
            field.value = unidadeParaEditar[key];
        }
    });

    // 4. Salvar as Alterações
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        try {
            const formData = new FormData(form);
            
            // Função auxiliar para pegar ID e Nome
            function getSelectInfo(elementName) {
                const select = form.elements[elementName];
                const id = select.value;
                const nome = (id && id !== "Nenhum") ? select.options[select.selectedIndex].text : "Nenhum";
                return { id, nome };
            }

            // Pega info do Coordenador
            const coord = getSelectInfo('coordenadorId');
            
            // Pega info dos 3 Supervisores
            const supManha = getSelectInfo('supervisorManhaId');
            const supTarde = getSelectInfo('supervisorTardeId');
            const supNoite = getSelectInfo('supervisorNoiteId');
            
            // Cria o objeto atualizado
            const unidadeAtualizada = {
                id: unidadeId, // Mantém o ID original!
                nome: formData.get('nome'),
                codigo: formData.get('codigo'),
                
                coordenadorId: coord.id,
                coordenadorNome: coord.nome,
                
                supervisorManhaId: supManha.id,
                supervisorManhaNome: supManha.nome,
                supervisorTardeId: supTarde.id,
                supervisorTardeNome: supTarde.nome,
                supervisorNoiteId: supNoite.id,
                supervisorNoiteNome: supNoite.nome,

                cep: formData.get('cep'),
                logradouro: formData.get('logradouro'),
                numero: formData.get('numero'),
                bairro: formData.get('bairro'),
                cidade: formData.get('cidade'),
                uf: formData.get('uf')
            };

            // Encontra o índice da unidade antiga na lista
            const index = listaUnidades.findIndex(u => u.id === unidadeId);
            if (index === -1) {
                window.globalAlert("Erro ao salvar: unidade não encontrada.", "Erro");
                return;
            }

            // Substitui a unidade antiga pela nova
            listaUnidades[index] = unidadeAtualizada;
            localStorage.setItem('sigo_unidades', JSON.stringify(listaUnidades));

            window.globalAlert("Unidade atualizada com sucesso!", "Sucesso");
            window.location.href = 'unidades.html'; 

        } catch (error) {
            console.error('Erro ao salvar unidade:', error);
            window.globalAlert('Houve um erro ao salvar as alterações.', "Erro");
        }
    });
});