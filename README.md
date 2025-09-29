# Budget Tracker App

Uma app para controle de orçamento pessoal.

## Estrutura do Projeto

```
budget-tracker-app/
├── index.html              # HTML principal
├── js/                     # Arquivos JavaScript
│   ├── components/         # Componentes da interface
│   ├── services/           # Serviços e chamadas de API
│   ├── handlers/           # Handlers de eventos
│   └── utils/              # Funções utilitárias
└── styles.css              # Estilos da aplicação
```

## Dependências

Uma conexão com a internet é necessária pois a app utiliza links CDN para algumas bibliotecas externas:
- Bootstrap 5.3.0 (CSS & JS)
- Bootstrap Icons 1.11.1
- Chart.js

Além disso, a aplicação depende da [Budget Tracker API](https://github.com/pedmrs/budget-tracker-api) que deve estar em execução em `http://localhost:5000`. A app faz uso dos seguintes endpoints:
- `GET /transactions` - Retorna a lista completa de transações
- `GET /transactions/:id` - Retorna os detalhes de uma transação específica
- `POST /transactions` - Registra uma nova transação
- `PUT /transactions/:id` - Atualiza os dados de uma transação existente
- `DELETE /transactions/:id` - Remove uma transação do sistema
- `GET /transactions/summary` - Retorna um resumo consolidado das transações, incluindo totais por categoria e balanço geral

## Como executar

1. Certifique-se de que a [Budget Tracker API](https://github.com/pedmrs/budget-tracker-api) está rodando em `http://localhost:5000`
2. Abra o arquivo `index.html` em um navegador web
3. A app irá carregar e renderizar as transações existentes de acordo com o filtro selecionado
