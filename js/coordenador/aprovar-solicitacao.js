// js/coordenador/aprovar-solicitacao.js
document.addEventListener('DOMContentLoaded', () => {

    // --- ELEMENTOS DO DOM ---
    const spans = {
        unidade: document.getElementById('det-unidade'),
        solicitante: document.getElementById('det-solicitante'),
        turno: document.getElementById('det-turno'),
        data: document.getElementById('det-data'),
        qtd: document.getElementById('det-qtd'),
        periodo: document.getElementById('det-periodo'),
        motivo: document.getElementById('det-motivo')
    };
    const btnAprovar = document.getElementById('btn-aprovar');
    const btnRecusar = document.getElementById('btn-recusar');

    // --- FUNÇÃO PARA PEGAR O ID DA URL ---
    function getIdSolicitacao() {
        // Pega os parâmetros da URL (ex: ?id=12345)
        const params = new URLSearchParams(window.location.search);
        // Retorna o valor do parâmetro 'id' (convertido para número)
        return Number(params.get('id'));
    }

    // --- FUNÇÃO PARA CARREGAR OS DADOS ---
    function carregarDetalhes(idSolicitacao) {
        if (!idSolicitacao) {
            console.error("ID não encontrado na URL.");
            window.globalAlert("Erro: ID da solicitação não encontrado.", "Erro de Carregamento");
            return;
        }

        const solicitacoesSalvas = localStorage.getItem('sigo_solicitacoes');
        const listaSolicitacoes = solicitacoesSalvas ? JSON.parse(solicitacoesSalvas) : [];

        // Encontra a solicitação específica pelo ID
        // Usamos == (em vez de ===) porque o ID da URL pode ser string e o salvo ser número
        const solicitacao = listaSolicitacoes.find(s => s.id == idSolicitacao);

        if (!solicitacao) {
            console.error("Solicitação não encontrada no localStorage.");
            window.globalAlert("Erro: Solicitação não encontrada.", "Erro de Busca");
            return;
        }

        // Preenche os campos na página com os dados encontrados
        spans.unidade.textContent = solicitacao.unidade;
        spans.solicitante.textContent = solicitacao.solicitante;
        spans.turno.textContent = solicitacao.turno;
        spans.data.textContent = solicitacao.data;
        spans.qtd.textContent = `${solicitacao.qtd} Colaborador(es)`;
        spans.periodo.textContent = solicitacao.periodo;
        spans.motivo.textContent = solicitacao.motivo;
    }

    // --- FUNÇÃO PARA ATUALIZAR O STATUS ---
    function atualizarStatus(idSolicitacao, novoStatus) {
        if (!idSolicitacao) return;

        const solicitacoesSalvas = localStorage.getItem('sigo_solicitacoes');
        let listaSolicitacoes = solicitacoesSalvas ? JSON.parse(solicitacoesSalvas) : [];

        // Encontra o índice (posição) do item na lista
        const index = listaSolicitacoes.findIndex(s => s.id == idSolicitacao);

        if (index > -1) {
            // Atualiza o status do item encontrado
            listaSolicitacoes[index].status = novoStatus;

            // Salva a lista inteira de volta no localStorage
            localStorage.setItem('sigo_solicitacoes', JSON.stringify(listaSolicitacoes));
            
            // Redireciona de volta para a lista de solicitações
            window.globalAlert(`Solicitação ${novoStatus.toLowerCase()}!`, "Status Atualizado");
            window.location.href = 'solicitacoes.html';
        } else {
            window.globalAlert("Erro ao atualizar status: solicitação não encontrada.", "Erro");
        }
    }

    // --- INICIALIZAÇÃO E EVENTOS ---
    
    // Pega o ID da solicitação assim que a página carrega
    const idAtual = getIdSolicitacao();
    
    // Carrega os detalhes na página
    carregarDetalhes(idAtual);

    // Adiciona os cliques nos botões
    if (btnAprovar) {
        btnAprovar.addEventListener('click', (e) => {
            e.preventDefault(); // Impede o link de navegar
            window.globalConfirm("Deseja realmente **aprovar** esta solicitação? Esta ação é irreversível.", (result) => {
                if (result) {
                    atualizarStatus(idAtual, 'Aprovado');
                }
            }, "Aprovar", "Cancelar", "Confirmar Aprovação");
        });
    }

    if (btnRecusar) {
        btnRecusar.addEventListener('click', (e) => {
            e.preventDefault(); // Impede o link de navegar
            window.globalConfirm("Deseja realmente **recusar** esta solicitação? Esta ação é irreversível.", (result) => {
                if (result) {
                    atualizarStatus(idAtual, 'Recusado');
                }
            }, "Recusar", "Cancelar", "Confirmar Recusa");
        });
    }

});