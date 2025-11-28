// Conteúdo de: mszzdev/projeto_sigo/Projeto_SIGO-fa617869cd959624b8e42aca41f8c4b99da94888/js/common/accessibility.js
document.addEventListener('DOMContentLoaded', () => {
    
    const footer = document.querySelector('.sidebar-footer');
    const toggleBtn = document.getElementById('acc-toggle-button');
    const menu = footer ? footer.querySelector('.accessibility-menu') : null;
    const body = document.body;

    if (!footer || !toggleBtn || !menu) {
        return; 
    }

    // --- Configuração e Estado Inicial ---
    const STORAGE_KEY = 'sigo_accessibility_settings';
    const TOGGLE_ACTIONS = ['contrast', 'read', 'spacing', 'cursor', 'libras'];

    let currentSettings = JSON.parse(localStorage.getItem(STORAGE_KEY)) || {
        'contrast': false,
        'read': false,
        'spacing': false,
        'cursor': false,
        'libras': false,
        'font': 0, // -1 (small), 0 (normal), 1 (large)
    };

    function saveSettings() {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(currentSettings));
        applySettings();
    }

    function applySettings() {
        // 1. Aplica classes de toggle no body
        if (currentSettings.contrast) { body.classList.add('high-contrast'); } else { body.classList.remove('high-contrast'); }
        if (currentSettings.cursor) { body.classList.add('large-cursor'); } else { body.classList.remove('large-cursor'); }
        if (currentSettings.spacing) { body.classList.add('text-spacing'); } else { body.classList.remove('text-spacing'); }
        // Nota: 'read' e 'libras' são apenas visuais por enquanto

        // 2. Aplica classes de font size no body
        if (currentSettings.font === 1) { 
            body.classList.add('large-font'); 
        } else { 
            body.classList.remove('large-font');
        }

        // 3. Atualiza o estado visual dos botões no menu
        menu.querySelectorAll('.acc-option-btn').forEach(btn => {
            const action = btn.getAttribute('data-action');
            
            if (TOGGLE_ACTIONS.includes(action) && currentSettings[action]) {
                btn.classList.add('active');
            } else if (TOGGLE_ACTIONS.includes(action) && !currentSettings[action]) {
                btn.classList.remove('active');
            }
            
            // Tratamento especial para ícones de fonte (feedback visual)
            if (action === 'font-plus') {
                 if (currentSettings.font === 1) { btn.classList.add('active'); } else { btn.classList.remove('active'); }
            }
        });
    }

    // --- Lógica de Ação ---
    function handleAction(event) {
        const btn = event.currentTarget;
        const action = btn.getAttribute('data-action');
        
        if (TOGGLE_ACTIONS.includes(action)) {
            currentSettings[action] = !currentSettings[action];

            if (action === 'read' && currentSettings.read) {
                 // REQUISITO: Clareza na Leitura
                alert("Modo 'Leitor em Voz Alta' ATIVADO.\nClique no texto desejado para que ele seja lido.");
            } else if (action === 'read' && !currentSettings.read) {
                 alert("Modo 'Leitor em Voz Alta' DESATIVADO.");
            }
            
        } else if (action === 'font-plus') {
            currentSettings.font = 1; // Aumenta para tamanho grande
        } else if (action === 'font-minus') {
             currentSettings.font = 0; // Volta para tamanho normal (poderia ser -1 para diminuir)
        } else if (action === 'reset') {
             // REQUISITO: Botão Resetar
            currentSettings = {
                'contrast': false,
                'read': false,
                'spacing': false,
                'cursor': false,
                'libras': false,
                'font': 0,
            };
            alert("Todas as configurações de acessibilidade foram resetadas.");
        }
        
        saveSettings();
    }

    // --- Inicialização de Eventos ---

    // 1. Abrir/Fechar o menu
    toggleBtn.addEventListener('click', (e) => {
        e.stopPropagation(); 
        footer.classList.toggle('active');
    });

    // 2. Fechar o menu ao clicar fora
    document.addEventListener('click', (e) => {
        if (!menu.contains(e.target) && !toggleBtn.contains(e.target) && footer.classList.contains('active')) {
            footer.classList.remove('active');
        }
    });

    // 3. Atribuir o handler de ação a todos os botões
    menu.querySelectorAll('.acc-option-btn').forEach(btn => {
        btn.addEventListener('click', handleAction);
    });

    // Aplica as configurações salvas no carregamento da página
    applySettings();
});