// js/coordenador/solicitacoes-pendentes.js
document.addEventListener('DOMContentLoaded', () => {

    const listaContainer = document.querySelector('.pending-requests-list');
    if (!listaContainer) return;

    // Pega o usuário logado
    const userLogado = JSON.parse(sessionStorage.getItem('sigo_user_logado'));

    // Limpa a lista estática do HTML
    listaContainer.innerHTML = ''; 

    // Pega os dados
    const solicitacoesSalvas = localStorage.getItem('sigo_solicitacoes');
    const listaSolicitacoes = solicitacoesSalvas ? JSON.parse(solicitacoesSalvas) : [];

    // Filtra para mostrar APENAS os pendentes
    const pendentes = listaSolicitacoes.filter(s => s.status === 'Pendente');

    if (pendentes.length === 0) {
        listaContainer.innerHTML = '<p style="padding: 20px; text-align: center; color: var(--text-muted);">Nenhuma solicitação pendente.</p>';
        return;
    }

    // Adiciona os cards pendentes à página
    pendentes.forEach(solicitacao => {
        const cardHtml = `
            <div class="card pending-request-item">
                <div class="request-info">
                    <div class="request-header">
                        <span class="request-date">${solicitacao.data}</span> - 
                        <span class="request-unit">Unidade ${solicitacao.unidade}</span>
                    </div>
                    <div class="request-content">
                        <img src="../../img/perf.png" alt="Avatar" class="rounded-circle me-2 request-avatar" style="width: 28px; height: 28px; object-fit: cover;">
                        <strong class="requester-name">${solicitacao.solicitante}</strong>
                        <span class="request-action">solicitou</span>
                        <strong class="request-count">${solicitacao.qtd} Colaborador(es)</strong>
                        <span class="request-details">(${solicitacao.periodo})</span>
                    </div>
                </div>
                <div class="request-actions">
                    <a href="aprovar-solicitacao.html?id=${solicitacao.id}" class="btn btn-sm btn-primary">Analisar</a>
                </div>
            </div>
        `;
        listaContainer.innerHTML += cardHtml;
    });

    // --- FUNÇÃO PARA LIMPAR NOTIFICAÇÕES (Adicionada) ---
    function limparNotificacoesSolicitacao() {
        if (!userLogado) return;
        let allNotificacoes = JSON.parse(localStorage.getItem('sigo_notificacoes')) || [];
        let algumaAlteracao = false;
        
        // Marca como lida todas as notificações de 'solicitacao' deste usuário
        allNotificacoes.forEach(n => {
            if (n.coordenadorId == userLogado.id && n.tipo === 'solicitacao' && n.lida === false) {
                n.lida = true;
                algumaAlteracao = true;
            }
        });

        if (algumaAlteracao) {
            localStorage.setItem('sigo_notificacoes', JSON.stringify(allNotificacoes));
        }
    }
    
    limparNotificacoesSolicitacao(); // Limpa as notificações ao carregar a página
});