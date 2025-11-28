// js/common/logout.js
document.addEventListener('DOMContentLoaded', () => {

    // --- 1. INJEÇÃO DO MODAL HTML E ESTILOS ---
    const modalHtml = `
        <div id="global-alert-modal" class="modal-overlay hidden">
            <div class="modal-content confirmation-style">
                <div class="modal-icon info">
                     <i class="fas fa-info-circle icon" style="color: var(--primary-color); font-size: 48px;"></i>
                </div>
                <h3 class="modal-title" id="global-alert-title">Atenção</h3>
                <p class="modal-text" id="global-alert-text">Mensagem.</p>
                <div class="modal-actions">
                    <button id="global-alert-confirm" class="btn btn-modal btn-primary">OK</button>
                </div>
            </div>
        </div>

        <div id="global-confirm-modal" class="modal-overlay hidden">
            <div class="modal-content confirmation-style">
                <div class="modal-icon warning">
                     <i class="fas fa-exclamation-triangle icon" style="color: var(--warning-color); font-size: 48px;"></i>
                </div>
                <h3 class="modal-title" id="global-confirm-title">Confirmar Ação</h3>
                <p class="modal-text" id="global-confirm-text">Você tem certeza?</p>
                <div class="modal-actions">
                    <button id="global-confirm-cancel" class="btn btn-modal btn-secondary">Cancelar</button>
                    <button id="global-confirm-ok" class="btn btn-modal btn-confirm">Confirmar</button>
                </div>
            </div>
        </div>
    `;

    // Estilos Mínimos para o modal funcionar em Coordenador/Gerente (baseado nos estilos do Supervisor)
    const modalStyles = `
        <style>
            /* Estilos de Modal Globais (Injetados por logout.js) */
            .modal-overlay {
                display: flex;
                position: fixed;
                inset: 0;
                background-color: var(--modal-overlay-bg, rgba(0, 0, 0, 0.5));
                justify-content: center;
                align-items: center;
                z-index: 9999;
                opacity: 1;
                transition: opacity 0.3s ease;
            }
            .modal-overlay.hidden {
                opacity: 0;
                pointer-events: none;
            }
            .modal-content.confirmation-style {
                background-color: #fff;
                padding: 25px;
                border-radius: 8px;
                width: 90%;
                max-width: 350px;
                text-align: center;
                box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
                transform: scale(1);
                transition: transform 0.3s ease;
            }
            .modal-overlay.hidden .modal-content {
                transform: scale(0.95);
            }
            .modal-title {
                font-size: 1.25em;
                margin-bottom: 15px;
                color: var(--text-color-dark);
                font-weight: 600;
            }
            .modal-text {
                margin-bottom: 20px;
                color: var(--text-color-light);
                font-size: 0.95rem;
            }
            .modal-actions {
                display: flex;
                justify-content: space-between;
                gap: 10px;
            }
            .btn-modal {
                flex-grow: 1;
                padding: 10px 15px;
                border: none;
                border-radius: 6px;
                font-weight: 500;
                cursor: pointer;
                font-size: 0.95rem;
            }
            .btn-primary { 
                background-color: var(--primary-color);
                color: var(--white-color);
            }
            .btn-secondary {
                background-color: var(--secondary-color);
                border-color: var(--secondary-color);
                color: var(--white-color);
            }
            .btn-confirm { 
                background-color: var(--danger-color);
                color: var(--white-color);
            }
            .modal-icon { margin-bottom: 15px; }
        </style>
    `;

    document.body.insertAdjacentHTML('beforeend', modalStyles);
    document.body.insertAdjacentHTML('beforeend', modalHtml);

    // --- 2. FUNÇÕES GLOBAIS DE MODAL (Expostas no window) ---
    const alertModal = document.getElementById('global-alert-modal');
    const alertText = document.getElementById('global-alert-text');
    const alertTitle = document.getElementById('global-alert-title');
    const alertConfirmBtn = document.getElementById('global-alert-confirm');
    
    const confirmModal = document.getElementById('global-confirm-modal');
    const confirmText = document.getElementById('global-confirm-text');
    const confirmTitle = document.getElementById('global-confirm-title');
    const confirmOkBtn = document.getElementById('global-confirm-ok');
    const confirmCancelBtn = document.getElementById('global-confirm-cancel');

    // Alerta/Info (Substitui alert())
    window.globalAlert = function(message, title = "Atenção") {
        if (!alertModal) return;
        alertTitle.textContent = title;
        alertText.textContent = message;
        alertModal.classList.remove('hidden');
        alertConfirmBtn.onclick = () => alertModal.classList.add('hidden');
    };

    // Confirmação (Substitui confirm())
    window.globalConfirm = function(message, callback, okLabel = "Confirmar", cancelLabel = "Cancelar", title = "Confirmação") {
        if (!confirmModal) return;

        confirmTitle.textContent = title;
        confirmText.textContent = message;
        confirmOkBtn.textContent = okLabel;
        confirmCancelBtn.textContent = cancelLabel;

        confirmModal.classList.remove('hidden');

        confirmOkBtn.onclick = () => {
            confirmModal.classList.add('hidden');
            callback(true);
        };

        confirmCancelBtn.onclick = () => {
            confirmModal.classList.add('hidden');
            callback(false);
        };
    };

    // --- 3. LÓGICA DE LOGOUT (AGORA USA O NOVO MODAL) ---
    const logoutButton = document.getElementById('logout-button');
    
    if (logoutButton) {
        logoutButton.addEventListener('click', (e) => {
            e.preventDefault();
            
            // Usa o novo modal de confirmação
            window.globalConfirm('Tem certeza que deseja sair do sistema?', (result) => {
                if (result) {
                    
                    // Lógica de Logout (Mantida)
                    localStorage.removeItem('sigo_status_unidade_JardimAngela');
                    sessionStorage.removeItem('sigo_user_logado');
                    
                    console.log('Logout realizado.');
                    document.body.classList.add('page-fade-out');
                    
                    let loginPath = 'login.html'; 
                    const currentPath = window.location.pathname;

                    if (currentPath.includes('/telas/gerente/') || currentPath.includes('/telas/coordenador/')) {
                        loginPath = '../../login.html'; 
                    } else if (currentPath.includes('/telas/')) {
                        loginPath = '../login.html'; 
                    }
                    
                    setTimeout(() => {
                        window.location.href = loginPath;
                    }, 400); 
                }
            }, 'Sair', 'Cancelar', 'Confirmar Saída');
        });
    }
});