// js/splash.js
document.addEventListener('DOMContentLoaded', () => {

    // Define o destino do redirecionamento
    const targetURL = 'login.html';
    
    // Define o tempo em milissegundos (5 segundos)
    const delay = 5000;

    let redirected = false; // Trava para evitar cliques duplos

    // Função para redirecionar
    function redirectToLogin() {
        if (redirected) return; // Se já foi, não faz de novo
        
        redirected = true;
        
        // Adiciona uma classe de fade-out para suavizar a saída
        document.body.style.transition = "opacity 0.5s ease-out";
        document.body.style.opacity = 0;
        
        // Espera a animação de saída terminar antes de mudar de página
        setTimeout(() => {
            window.location.href = targetURL;
        }, 500);
    }

    // 1. Inicia o timer de 5 segundos
    const timer = setTimeout(redirectToLogin, delay);

    // 2. Adiciona o clique em qualquer lugar da tela
    document.body.addEventListener('click', () => {
        // Se clicar, cancela o timer
        clearTimeout(timer);
        // E redireciona imediatamente
        redirectToLogin();
    });

});