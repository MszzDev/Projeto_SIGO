document.addEventListener("DOMContentLoaded", () => {
    
    // Duração da animação
    const animationDuration = 400; 

    // Pega todos os links da página
    const links = document.querySelectorAll('a');

    links.forEach(link => {
        const href = link.getAttribute('href');

        // Ignora links que não são de navegação interna
        if (!href || href.startsWith('#') || href.startsWith('mailto:') || href.startsWith('http') || href.startsWith('tel:') || link.target === '_blank') {
            return;
        }

        // Adiciona o movimento de clique
        link.addEventListener('click', (event) => {
            // 1. Impede o navegador de navegar imediatamente
            event.preventDefault(); 
            
            // 2. Adiciona a classe que ativa o 'fade-out' no CSS
            document.body.classList.add('page-fade-out');

            // 3. Espera a animação de fade-out terminar
            setTimeout(() => {
                // 4. Navega para a nova página
                window.location.href = href;
            }, animationDuration);
        });
    });
});