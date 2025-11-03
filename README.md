# Sistema SIGO (Sistema Integrado de Gerenciamento Operacional) 

## Descrição

O Sistema Integrado de Gerenciamento Operacional (SIGO) é uma aplicação web desenvolvida para gerenciar unidades operacionais, colaboradores, solicitações e preleções. Esta versão foi refatorada para utilizar HTML, CSS puro e JavaScript básico para funcionalidades de login e interações simples, removendo dependências externas como Tailwind CSS. O sistema agora possui interfaces distintas para Coordenadores e Supervisores, acessadas através de um login unificado.

## Tecnologias

* **Frontend:** HTML5, CSS3 (Puro), JavaScript (ES6)
* **Ícones:** Font Awesome (via CDN nos arquivos HTML que necessitam)
* **Fontes:** Google Fonts (Roboto - via CSS)

## Estrutura do Projeto

SIGO_Projeto/
├── index.html              # Redireciona para login.html
├── login.html              # Tela de login UNIFICADA
├── css/
│   ├── common/             # Estilos comuns a todas as interfaces
│   │   ├── global.css      # Estilos globais, layout base, variáveis
│   │   └── login.css       # CSS unificado para login
│   ├── coordenador/        # Estilos específicos do Coordenador
│   │   ├── dashboard.css
│   │   ├── units.css
│   │   ├── unit-detail.css
│   │   ├── prelecoes.css
│   │   ├── solicitacoes.css
│   │   ├── solicitacoes-pendentes.css
│   │   ├── aprovar-solicitacao.css
│   │   └── profile.css
│   └── supervisor/         # Estilos específicos do Supervisor
│       ├── sup_dashboard.css
│       ├── sup_colaboradores.css
│       ├── sup_perfil.css   # Estilos unificados para telas de perfil
│       ├── sup_solicitar.css
│       ├── sup_relatar.css
│       ├── sup_hist.css     # Estilos unificados para telas de histórico
│       └── sup_sobremim.css
├── js/
│   ├── login.js            # Lógica de login e redirecionamento
│   └── supervisor/         # JS específico do Supervisor
│       ├── sup_solicitar.js # Lógica do formulário e modal de solicitação
│       ├── sup_relatar.js   # Lógica do formulário e modal de preleção
│       └── sup_sobremim.js  # Lógica do modal de logout
├── telas/
│   ├── coordenador/        # Telas HTML do Coordenador
│   │   ├── dashboard.html
│   │   ├── units.html
│   │   ├── unit-detail.html
│   │   ├── prelecoes.html
│   │   ├── solicitacoes.html
│   │   ├── solicitacoes-pendentes.html
│   │   ├── aprovar-solicitacao.html
│   │   └── profile.html
│   └── supervisor/         # Telas HTML do Supervisor
│       ├── sup_dashboard.html
│       ├── sup_colaboradores.html
│       ├── sup_perfil_supervisor.html # Perfil do supervisor logado
│       ├── sup_perfilcolaborador.html # Perfil de um colaborador
│       ├── sup_solicitar.html
│       ├── sup_relatar.html
│       ├── sup_hist_solicitar.html
│       ├── sup_hist_relatar.html
│       └── sup_sobremim.html      # Acesso ao perfil/logout
├── img/                    # Todas as imagens (logos, ícones, etc.)
│   ├── logo_sigo.png
│   ├── princ_icone.png
│   ├── seg_icone.png
│   └── segunda_icone.png
└── README.md               # Este arquivo


## Funcionalidades Implementadas (v2.0)

* **Login Unificado:** Uma única tela de login (`login.html`) que redireciona para dashboards diferentes com base nas credenciais.
* **Perfis de Usuário:**
    * **Coordenador:** Interface com layout de sidebar, visualização ampla de unidades, colaboradores, solicitações e preleções.
    * **Supervisor:** Interface otimizada para mobile com navegação inferior fixa, focada nas ações diárias (solicitar, relatar preleção, visualizar colaboradores da unidade, histórico).
* **Navegação Específica:** Cada perfil possui sua própria estrutura de navegação (Sidebar para Coordenador, Footer Nav para Supervisor).
* **Funcionalidades Coordenador:**
    * Dashboard com estatísticas gerais.
    * Visualização de todas as unidades.
    * Detalhes da unidade com lista de colaboradores por turno (abas JS).
    * Listagem e filtragem de solicitações e preleções.
    * Visualização de solicitações pendentes.
    * Tela de análise/aprovação de solicitações.
    * Visualização de perfil próprio e de outros usuários.
    * Botão de Logout no header.
* **Funcionalidades Supervisor:**
    * Dashboard mobile-first com acesso rápido às ações.
    * Visualização de colaboradores da sua unidade com busca.
    * Formulário para solicitar mais colaboradores (com modal de confirmação JS).
    * Formulário para relatar preleções realizadas (com seleção de funções e modal de confirmação JS).
    * Visualização do histórico de solicitações e preleções (com abas e filtros de data/busca).
    * Visualização do próprio perfil e dos colaboradores.
    * Tela intermediária de perfil com botão de Logout (com modal de confirmação JS).
* **Layout Responsivo:** Ambas as interfaces são projetadas para funcionar em diferentes tamanhos de tela, com foco principal no desktop para Coordenador e mobile para Supervisor.
* **CSS Puro:** Toda a estilização é feita com CSS puro, utilizando variáveis CSS para consistência.
* **JavaScript Básico:** Usado para a lógica de login/redirecionamento e para a interatividade dos modais de confirmação e mensagens (toasts) na interface do Supervisor.

## Como Usar

1.  Clone ou baixe o repositório.
2.  Abra o arquivo `index.html` na raiz do projeto (`SIGO_Projeto/`) em um navegador web moderno.
3.  Você será redirecionado automaticamente para `login.html`.
4.  Use as seguintes credenciais para testar os perfis:
    * **Coordenador:** ID `C123`, Senha `123`
    * **Supervisor:** ID `S123`, Senha `123`
5.  Qualquer outra combinação exibirá uma mensagem de erro.
6.  Navegue pelas funcionalidades usando a sidebar (Coordenador) ou o menu inferior (Supervisor).

## Compatibilidade

O sistema é compatível com navegadores modernos que suportam HTML5, CSS3 (incluindo Flexbox, Grid, Variáveis CSS, Sticky Positioning) e JavaScript ES6.

* Chrome 60+
* Firefox 55+
* Safari 12+
* Edge 79+

## Limitações

* **Dados Estáticos:** A aplicação não possui backend; todos os dados são fixos no HTML.
* **Autenticação Simples:** O login é apenas visual e baseado em valores fixos no JavaScript, sem segurança real.
* **Interatividade Limitada:** A maior parte da interatividade se resume a navegação entre páginas, efeitos `:hover`, e os modais/toasts implementados com JS na seção do Supervisor. A funcionalidade das abas (Coordenador/Supervisor) é simulada ou feita com JS básico.
* **Sem Persistência:** Nenhuma informação (novas solicitações, preleções, edições de perfil) é salva.

## Melhorias Futuras

* Implementação de um backend para gerenciar dados dinamicamente em um banco de dados.
* Sistema de autenticação seguro com gerenciamento de usuários e permissões.
* Uso de um framework frontend (React, Vue, Angular) ou sistema de templates (Jinja2, EJS) para componentização e reuso de código (header, footer, etc.).
* Implementação completa das funcionalidades de CRUD (Criar, Ler, Atualizar, Deletar) para unidades, colaboradores, solicitações e preleções.
* Adição de funcionalidades de notificação.
* Melhorias na acessibilidade.

---