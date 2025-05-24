# 💰 Fin Wallet

Uma aplicação de carteira financeira desenvolvida com **Next.js** e **TypeScript**, onde usuários podem realizar operações como **depósito**, **transferência** e **reversão de transações**. O projeto foi desenvolvido como parte de um desafio técnico, focando em boas práticas, arquitetura escalável e segurança.

### 💻 Demonstração



https://github.com/user-attachments/assets/c85efde6-8e71-4bf4-b3d8-eccff5359f22





## 🚀 Tecnologias utilizadas

- [Next.js](https://nextjs.org/) — Front-end e API (Fullstack)
- [TypeScript](https://www.typescriptlang.org/) — Tipagem estática
- [MongoDB](https://www.mongodb.com/) — Banco de dados NoSQL
- [Zod](https://zod.dev/) — Validação de dados
- [NextAuth](https://next-auth.js.org/) — Autenticação
- [Docker](https://www.docker.com/) — Ambiente containerizado
- [Jest](https://jestjs.io/) — Testes unitários e de integração

## 🎯 Funcionalidades

### 🔑 Cadastro e Autenticação

- Cadastro e login de usuários utilizando **NextAuth** para autenticação com MongoDB
- Validação dos dados no backend com mensagens de erro apropriadas
- Autenticação via sessão segura com NextAuth
- Rotas protegidas para operações financeiras

### 💸 Operações Financeiras

- **Depósito:** Permite adicionar saldo à conta. Se o saldo estiver negativo, o valor depositado soma ao saldo atual.
- **Transferência:** Transferência de saldo entre usuários, com verificação de saldo suficiente antes da operação.
- **Reversão:** Permite desfazer uma transação (depósito ou transferência) mediante solicitação ou inconsistência.

## 🗂️ Arquitetura

- **Next.js App Router + Server Actions**
- Camada de acesso a dados implementada com MongoDB

## 🔐 Segurança

- Autenticação robusta utilizando **NextAuth** com sessões seguras
- Hash de senhas com **bcrypt** (caso necessário para cadastro local)
- Tokens e sessões protegidos contra ataques comuns
- Validações rigorosas no backend com **Zod**
- Proteção de rotas e operações sensíveis

## 🧠 Padrões e Boas Práticas

- **SOLID**
- **DRY (Don't Repeat Yourself)**
- Validações centralizadas
- Tratamento de erros customizado
- Logs de operações críticas
- Código limpo e modularizado

### 🔐 Configuração do ambiente

Crie um arquivo `.env` na raiz do projeto com as seguintes variáveis:

```env
NODE_ENV=development
MONGO_DB_URI=your_mongodb_uri
BASE_URL=http://localhost:3000
NEXTAUTH_SECRET=your_nextauth_secret
```


## 🐳 Docker

O projeto é totalmente containerizado.

### ⚙️ Como rodar com Docker

```bash
git clone https://github.com/kleber-a/fin-wallet.git
```

```bash
docker build -t fin-wallet .
```

```bash
docker-compose up
```

### Alternativa sem Docker

```bash
git clone https://github.com/kleber-a/fin-wallet.git
```

```bash
npm install
```

3. Inicie o projeto

```bash
npm run dev
```

### 🧪 Testes
![image](https://github.com/user-attachments/assets/1287fbca-3b20-4115-8bca-d1f909b3607e)


### 🗄️ Estrutura do Banco de Dados (MongoDB)
O banco de dados utilizado é o MongoDB, organizado em coleções (collections) que armazenam os documentos relacionados aos usuários e às transações.

#### 📦 Collections e Estruturas

| Campo       | Tipo      | Descrição                             |
| ----------- | --------- | ----------------------------------- |
| **users**   |           |                                     |
| _id         | ObjectId  | ID único do MongoDB                  |
| name        | String    | Nome do usuário                     |
| email       | String    | E-mail (único)                     |
| password    | String    | Hash da senha (se aplicável)        |
| wallet     | Number    | Saldo atual da conta                 |
| createdAt   | Date      | Data de criação                     |
| updatedAt   | Date      | Última atualização                  |

| Campo     | Tipo      | Descrição                                |
| --------- | --------- | -------------------------------------- |
| **transactions** |       |                                          |
| _id       | ObjectId  | ID único da transação                    |
| type      | String    | Tipo da transação (deposit, transfer, reverse) |
| amount    | Number    | Valor da transação                       |
| from      | String    | Email do usuário que enviou (null no depósito) |
| to        | String    | Email do usuário que recebeu             |
| status    | String    | Concluída, Falhou ou Revertida          |
| createdAt | Date      | Data de criação                         |


### 📑 Documentação API

| Método | Endpoint             | Descrição                        |
| ------ | -------------------- | -------------------------------- |
| POST   | `/api/register`      | Cadastro de usuário              |
| POST   | `/api/auth/login`    | Login (gerenciado pelo NextAuth) |
| POST   | `/api/deposit`       | Realizar depósito                |
| POST   | `/api/transfer`      | Realizar transferência           |
| POST   | `/api/reverse`       | Reverter uma operação            |
| GET    | `/api/transactions`  | Listar histórico de transações   |
| GET    | `/api/user`          | Listar usuário autenticado e todos usuários   |
| PUT    | `/api/user`          | Alterar o nome do usuário  |
| DELETE  | `/api/user`          | Deleta usuário   |


### 🔥 Roadmap de Melhorias

 Testes E2E com Cypress


### 🤝 Contribuição
Sinta-se à vontade para abrir uma issue ou fazer um pull request.

### 📝 Licença
Este projeto está sob a licença MIT.

