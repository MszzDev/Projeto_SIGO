// js/gerente/add-unidade.js
document.addEventListener('DOMContentLoaded', () => {
    
    const form = document.getElementById('add-unidade-form');
    if (!form) return;

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

            const novaUnidade = {
                id: Date.now(), // ID automático
                nome: formData.get('nome'),
                codigo: formData.get('codigo'),
                
                // Coordenador Responsável
                coordenadorId: coord.id,
                coordenadorNome: coord.nome,
                
                // Supervisores por Turno
                supervisorManhaId: supManha.id,
                supervisorManhaNome: supManha.nome,
                supervisorTardeId: supTarde.id,
                supervisorTardeNome: supTarde.nome,
                supervisorNoiteId: supNoite.id,
                supervisorNoiteNome: supNoite.nome,

                // Endereço
                cep: formData.get('cep'),
                logradouro: formData.get('logradouro'),
                numero: formData.get('numero'),
                bairro: formData.get('bairro'),
                cidade: formData.get('cidade'),
                uf: formData.get('uf')
            };

            if (!novaUnidade.nome || !novaUnidade.codigo) {
                window.globalAlert('Nome e Código são obrigatórios.', "Campos Faltando");
                return;
            }

            const unidadesSalvas = localStorage.getItem('sigo_unidades');
            const listaUnidades = unidadesSalvas ? JSON.parse(unidadesSalvas) : [];
            
            listaUnidades.push(novaUnidade);
            localStorage.setItem('sigo_unidades', JSON.stringify(listaUnidades));
            
            window.globalAlert(`Unidade "${novaUnidade.nome}" adicionada com sucesso!`, "Unidade Criada");
            window.location.href = 'unidades.html';

        } catch (error) {
            console.error('Erro ao salvar unidade:', error);
            window.globalAlert('Houve um erro ao salvar a unidade.', "Erro");
        }
    });
});