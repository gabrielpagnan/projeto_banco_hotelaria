# Sistema de Gerenciamento Hoteleiro

Este é um sistema de gerenciamento hoteleiro desenvolvido com React e Node.js, utilizando PostgreSQL como banco de dados.

## Funcionalidades

- Gerenciamento de Clientes (CRUD)
- Gerenciamento de Quartos (CRUD)
- Gerenciamento de Reservas (CRUD)
- Interface responsiva com Material-UI
- API RESTful com Express.js

## Pré-requisitos

- Node.js (versão 14 ou superior)
- PostgreSQL (versão 12 ou superior)
- NPM ou Yarn

## Configuração do Banco de Dados

1. Crie um banco de dados PostgreSQL chamado `hotel`
2. Execute os scripts SQL fornecidos no arquivo `database.sql`

## Instalação

1. Clone o repositório:
```bash
git clone [URL_DO_SEU_REPOSITORIO]
cd projeto_banco_hotelaria
```

2. Instale as dependências do backend:
```bash
cd backend
npm install
```

3. Instale as dependências do frontend:
```bash
cd ../projeto_final_banco
npm install
```

4. Configure as variáveis de ambiente:
   - Crie um arquivo `.env` na pasta `backend` com as seguintes configurações:
```env
PORT=3000
DB_USER=seu_usuario
DB_HOST=localhost
DB_NAME=hotel
DB_PASSWORD=sua_senha
DB_PORT=5432
```

## Executando o Projeto

1. Inicie o backend:
```bash
cd backend
npm run dev
```

2. Em outro terminal, inicie o frontend:
```bash
cd projeto_final_banco
npm run dev
```

3. Acesse o sistema em `http://localhost:5173`

## Estrutura do Projeto

```
projeto_banco_hotelaria/
├── backend/               # Servidor Node.js
│   ├── src/
│   │   └── index.js      # Arquivo principal do servidor
│   ├── package.json
│   └── .env              # Configurações do ambiente
│
└── projeto_final_banco/   # Frontend React
    ├── src/
    │   ├── components/   # Componentes React
    │   ├── pages/       # Páginas da aplicação
    │   └── App.jsx      # Componente principal
    └── package.json
```

## Tecnologias Utilizadas

- Frontend:
  - React
  - Material-UI
  - React Router
  - Axios
  - Vite

- Backend:
  - Node.js
  - Express
  - PostgreSQL
  - node-postgres
  - CORS
  - dotenv

## Contribuição

1. Faça o fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Faça commit das suas alterações (`git commit -m 'Add some AmazingFeature'`)
4. Faça push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## Licença

Este projeto está sob a licença MIT. Veja o arquivo `LICENSE` para mais detalhes. 