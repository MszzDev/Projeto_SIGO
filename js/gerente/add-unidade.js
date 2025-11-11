// js/gerente/add-unidade.js
document.addEventListener('DOMContentLoaded', () => {
    
    const form = document.getElementById('add-unidade-form');
    if (!form) return;

    form.addEventListener('submit', (e) => {
        e.preventDefault(); 
        
        try {
            const formData = new FormData(form);
            const coordSelect = form.elements['coordenadorId'];
            const coordId = coordSelect.value;
            // Pega o NOME do coordenador (o texto da opção selecionada)
            const coordNome = (coordId && coordId !== "Nenhum") ? coordSelect.options[coordSelect.selectedIndex].text : "Nenhum";

            const novaUnidade = {
                id: Date.now(),
                nome: formData.get('nome'),
                codigo: formData.get('codigo'),
                endereco: formData.get('endereco'),
                coordenadorId: coordId, // SALVA O ID
                coordenadorNome: coordNome // SALVA O NOME
            };

            if (!novaUnidade.nome || !novaUnidade.codigo) {
                alert('Nome e Código são obrigatórios.');
                return;
            }

            const unidadesSalvas = localStorage.getItem('sigo_unidades');
            const listaUnidades = unidadesSalvas ? JSON.parse(unidadesSalvas) : [];
            
            listaUnidades.push(novaUnidade);
            localStorage.setItem('sigo_unidades', JSON.stringify(listaUnidades));
            
            alert(`Unidade "${novaUnidade.nome}" adicionada com sucesso!`);
            window.location.href = 'unidades.html';

        } catch (error) {
            console.error('Erro ao salvar unidade:', error);
            alert('Houve um erro ao salvar a unidade.');
        }
    });
});