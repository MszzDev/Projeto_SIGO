// js/gerente/add-unidade.js
document.addEventListener('DOMContentLoaded', () => {
    
    const form = document.getElementById('add-unidade-form');
    if (!form) return;

    // NOVO: Função para gerar Código da Unidade (Ex: 1001, 1002)
    function generateUnitCode(listaUnidades) {
        // Gera um número sequencial simples, a partir de 1000
        const baseCode = 1000;
        const nextCode = baseCode + listaUnidades.length; 
        return nextCode.toString();
    }


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

            // 1. Geração de Código
            const unidadesSalvas = localStorage.getItem('sigo_unidades');
            const listaUnidades = unidadesSalvas ? JSON.parse(unidadesSalvas) : [];
            const unitCode = generateUnitCode(listaUnidades); // NOVO

            const novaUnidade = {
                id: Date.now(), // ID automático (para operações internas)
                nome: formData.get('nome'),
                codigo: unitCode, // USADO CÓDIGO GERADO
                
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

            if (!novaUnidade.nome || !unitCode) {
                window.globalAlert('Nome da Unidade é obrigatório e o Código deve ser gerado.', "Campos Faltando");
                return;
            }
            
            listaUnidades.push(novaUnidade);
            localStorage.setItem('sigo_unidades', JSON.stringify(listaUnidades));
            
            window.globalAlert(`Unidade "${novaUnidade.nome}" (Código: **${novaUnidade.codigo}**) adicionada com sucesso!`, "Unidade Criada");
            window.location.href = 'unidades.html';

        } catch (error) {
            console.error('Erro ao salvar unidade:', error);
            window.globalAlert('Houve um erro ao salvar a unidade.', "Erro");
        }
    });
});