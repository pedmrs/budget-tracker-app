# Budget Tracker App

Uma app para controle de orçamento pessoal.

## Estrutura do Projeto

```
budget-tracker-app/
├── src/
│   ├── components/          # Componentes de UI. Lógica de renderização e interações do usuário
│   ├── services/            # Chamadas de API e regras de negócio. Como se comunicar com a API e o que fazer com os dados
│   ├── handlers/            # Handlers de eventos. Processsar eventos do usuário e envios de formulários
│   ├── utils/               # Funções utilitárias
│   ├── styles/              # Arquivos CSS
│   ├── app.js               # Entrypoint da aplicação
└── index.html               # HTML principal
```

## Dependências

A app utiliza links CDN para algumas bibliotecas externas:
- Bootstrap 5.3.0 (CSS & JS)
- Bootstrap Icons 1.11.1
- Chart.js

Uma conexão com a internet é necessária.

## API

O aplicativo espera uma API rodando em `http://localhost:5000` com os seguintes endpoints:

- `GET /transactions` - Buscar todas as transações
- `GET /transactions/summary` - Buscar resumo das transações
- `GET /transactions/:id` - Buscar transação por ID
- `POST /transactions` - Criar nova transação
- `PUT /transactions/:id` - Atualizar transação
- `DELETE /transactions/:id` - Deletar transação

## Como executar

1. Certifique-se de que sua API backend está rodando em `http://localhost:5000`
2. Abra o arquivo `index.html` em um navegador web
3. A app irá carregar e renderizar as transações
