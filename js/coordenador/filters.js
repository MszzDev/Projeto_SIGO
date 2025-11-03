document.addEventListener('DOMContentLoaded', () => {
    // Encontra todos os containers de filtro
    const filterContainers = document.querySelectorAll('.unit-filters');

    filterContainers.forEach(container => {
        // Encontra todos os botões DENTRO desse container
        const filterButtons = container.querySelectorAll('.filter-button');

        filterButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                // Impede o link de pular a página
                e.preventDefault();

                // 1. Remove a classe 'active' de TODOS os botões
                filterButtons.forEach(btn => {
                    btn.classList.remove('active');
                });

                // 2. Adiciona a classe 'active' apenas no botão clicado
                button.classList.add('active');
                
                // 3. (Futuro) Aqui você pode adicionar a lógica
                //    para filtrar o conteúdo da tabela com base no botão clicado.
            });
        });
    });
});