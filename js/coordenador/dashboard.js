// js/coordenador/dashboard.js
document.addEventListener('DOMContentLoaded', function() {
    
    // --- 1. PEGAR DADOS DO USUÁRIO LOGADO ---
    const userLogado = JSON.parse(sessionStorage.getItem('sigo_user_logado'));
    
    if (!userLogado || userLogado.cargo !== 'Coordenador') {
        // Se não for Coordenador, esconde info e mostra erro
        const welcomeContainer = document.getElementById('welcome-container');
        if (welcomeContainer) welcomeContainer.innerHTML = '<h2>Erro: Perfil de Coordenador não encontrado.</h2>';
        return; 
    }

    // --- 2. CARREGAR TODOS OS DADOS DO SISTEMA ---
    const allUnidades = JSON.parse(localStorage.getItem('sigo_unidades')) || [];
    const allColaboradores = JSON.parse(localStorage.getItem('sigo_colaboradores')) || [];
    const allSolicitacoes = JSON.parse(localStorage.getItem('sigo_solicitacoes')) || [];
    const allPrelecoes = JSON.parse(localStorage.getItem('sigo_prelecoes')) || [];
    
    // --- 3. FILTRAR DADOS *DESTE* COORDENADOR ---
    const minhasUnidades = allUnidades.filter(u => u.coordenadorId == userLogado.id);
    const minhasUnidadesNomes = minhasUnidades.map(u => u.nome);
    const minhaEquipe = allColaboradores.filter(c => minhasUnidadesNomes.includes(c.unidade));
    const minhasSolicitacoes = allSolicitacoes.filter(s => minhasUnidadesNomes.includes(s.unidade));
    const minhasPrelecoes = allPrelecoes.filter(p => minhasUnidadesNomes.includes(p.unidade));

    // --- 4. PREENCHER SAUDAÇÕES ---
    (function preencherSaudacoes() {
        document.getElementById('welcome-container').querySelector('h2').textContent = `Olá, ${userLogado.nome.split(' ')[0]}`;
        document.getElementById('welcome-container').querySelector('p').textContent = userLogado.cargo;
        
        document.getElementById('sidebar-user-name').textContent = `Olá, ${userLogado.nome.split(' ')[0]}`;
        
        const userProfile = document.querySelector('.user-profile .user-info');
        userProfile.querySelector('.user-name').textContent = userLogado.nome;
        userProfile.querySelector('.user-role').textContent = userLogado.cargo;

        const avatarHeader = document.getElementById('header-user-avatar');
        if (userLogado.foto_url) {
            avatarHeader.src = userLogado.foto_url;
        } else {
            const iniciais = userLogado.nome ? userLogado.nome.substring(0, 2).toUpperCase() : '??';
            avatarHeader.src = `https://via.placeholder.com/40/003063/ffffff?text=${iniciais}`;
        }
    })();

    // --- 5. PREENCHER CARDS DE ESTATÍSTICA ---
    (function preencherStats() {
        document.getElementById('stat-unidades').textContent = minhasUnidades.length;
        document.getElementById('stat-colaboradores').textContent = minhaEquipe.length;
        document.getElementById('stat-solicitacoes').textContent = minhasSolicitacoes.filter(s => s.status === 'Pendente').length;
        document.getElementById('stat-prelecoes').textContent = minhasPrelecoes.length; // (Simples - total)
    })();

    // --- 6. PREENCHER TABELA DE UNIDADES ---
    (function carregarStatusUnidades() {
        const tbody = document.getElementById('unidades-tbody');
        if (!tbody) return;

        tbody.innerHTML = ''; // Limpa a tabela

        if (minhasUnidades.length === 0) {
            tbody.innerHTML = '<tr><td colspan="4" class="text-muted text-center p-4">Nenhuma unidade associada a você.</td></tr>';
            return;
        }

        minhasUnidades.forEach(unit => {
            // Verifica se a unidade está ativa (pelo localStorage do supervisor)
            const statusKey = `sigo_status_unidade_${unit.nome.replace(/\s/g, '')}`;
            const statusAtivo = localStorage.getItem(statusKey);
            
            let statusBadge = '';
            if (statusAtivo === 'Ativa') {
                statusBadge = `<span class="badge badge-success">Ativa</span>`;
            } else {
                statusBadge = `<span class="badge badge-secondary">Inativa</span>`;
            }

            tbody.innerHTML += `
                <tr>
                    <td>${unit.nome}</td>
                    <td>${unit.codigo}</td>
                    <td>${statusBadge}</td>
                    <td><a href="unit-detail.html?unidade=${encodeURIComponent(unit.nome)}" class="btn btn-sm btn-outline-primary">Ver Detalhes</a></td>
                </tr>
            `;
        });
    })();
});