// js/coordenador/add-colaborador.js
document.addEventListener('DOMContentLoaded', () => {
    
    const form = document.getElementById('add-colab-form');
    if (!form) return;

    form.addEventListener('submit', (e) => {
        // Impede o envio padrão do formulário
        e.preventDefault(); 
        
        try {
            // Pega todos os dados do formulário
            const formData = new FormData(form);
            const novoColaborador = {};
            // Converte os dados do formulário em um objeto simples
            formData.forEach((value, key) => {
                novoColaborador[key] = value;
            });
            
            // Adiciona um ID único
            novoColaborador.id = Date.now();
            
            // Pega a lista existente de colaboradores do localStorage
            const colaboradoresSalvos = localStorage.getItem('sigo_colaboradores');
            const listaColaboradores = colaboradoresSalvos ? JSON.parse(colaboradoresSalvos) : [];
            
            // Adiciona o novo colaborador à lista
            listaColaboradores.unshift(novoColaborador);
            
            // Salva a lista atualizada de volta no localStorage
            localStorage.setItem('sigo_colaboradores', JSON.stringify(listaColaboradores));
            
            // Sucesso
            alert('Colaborador adicionado com sucesso!');
            
            // Redireciona para a página de colaboradores
            // (O script transitions.js vai pegar esse clique)
            window.location.href = 'colaboradores.html';

        } catch (error) {
            console.error('Erro ao salvar colaborador:', error);
            alert('Houve um erro ao salvar o colaborador.');
        }
    });

});