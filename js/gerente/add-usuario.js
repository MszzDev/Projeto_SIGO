// js/gerente/add-usuario.js
document.addEventListener('DOMContentLoaded', () => {
    
    const form = document.getElementById('add-user-form');
    if (!form) return;

    form.addEventListener('submit', (e) => {
        e.preventDefault(); 
        
        try {
            const formData = new FormData(form);
            const novoUsuario = {};
            formData.forEach((value, key) => {
                novoUsuario[key] = value;
            });
            
            // Adiciona um ID automático
            novoUsuario.id = Date.now();
            
            const colaboradoresSalvos = localStorage.getItem('sigo_colaboradores');
            const listaColaboradores = colaboradoresSalvos ? JSON.parse(colaboradoresSalvos) : [];
            
            listaColaboradores.unshift(novoUsuario);
            
            localStorage.setItem('sigo_colaboradores', JSON.stringify(listaColaboradores));
            
            alert(`Usuário [${novoUsuario.cargo}] adicionado com sucesso!`);
            
            window.location.href = 'colaboradores.html';

        } catch (error) {
            console.error('Erro ao salvar usuário:', error);
            alert('Houve um erro ao salvar o usuário.');
        }
    });
});