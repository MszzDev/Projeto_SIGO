// js/supervisor/sup_sobremim-loader.js
document.addEventListener('DOMContentLoaded', () => {
    const userLogado = JSON.parse(sessionStorage.getItem('sigo_user_logado'));
    
    // Referências aos NOVOS elementos do HTML
    const avatarImg = document.getElementById('user-avatar');
    const userNameEl = document.getElementById('user-name-large');
    const userUnitEl = document.getElementById('user-unit-large');

    if (userLogado) {
        // Preenche o avatar
        if (avatarImg) {
            if (userLogado.foto_url) {
                avatarImg.src = userLogado.foto_url;
                avatarImg.style.objectFit = 'cover';
            } else {
                avatarImg.src = '../../img/perf.png'; // Fallback para perf.png
            }
        }

        // Preenche o nome
        if (userNameEl) {
            userNameEl.textContent = userLogado.nome;
        }

        // Preenche a unidade e cargo
        if (userUnitEl) {
            userUnitEl.textContent = `Unidade ${userLogado.unidade} - ${userLogado.cargo}`;
        }
    }
});