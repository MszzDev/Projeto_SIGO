// js/supervisor/sup_sobremim-loader.js
document.addEventListener('DOMContentLoaded', () => {
    const userLogado = JSON.parse(sessionStorage.getItem('sigo_user_logado'));
    const avatarImg = document.getElementById('user-avatar');

    if (avatarImg && userLogado) {
        if (userLogado.foto_url) {
            avatarImg.src = userLogado.foto_url;
        } else if (userLogado.nome) {
            const iniciais = userLogado.nome.substring(0, 2).toUpperCase();
            avatarImg.src = `https://via.placeholder.com/40/003063/ffffff?text=${iniciais}`;
        }
    }
});