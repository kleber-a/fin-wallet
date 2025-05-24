# 💰 Fin Wallet

Uma aplicação de carteira financeira desenvolvida com **Next.js** e **TypeScript**, onde usuários podem realizar operações como **depósito**, **transferência** e **reversão de transações**. O projeto foi desenvolvido como parte de um desafio técnico, focando em boas práticas, arquitetura escalável e segurança.

## 🚀 Tecnologias utilizadas

- [Next.js](https://nextjs.org/) — Front-end e API (Fullstack)
- [TypeScript](https://www.typescriptlang.org/) — Tipagem estática
- [MongoDB](https://www.mongodb.com/) — Banco de dados NoSQL
- [Zod](https://zod.dev/) — Validação de dados
- [NextAuth](https://next-auth.js.org/) — Autenticação
- [Docker](https://www.docker.com/) — Ambiente containerizado (Diferencial)
- [Jest](https://jestjs.io/) — Testes unitários e de integração (Diferencial)

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
- Separação por camadas:
  - `app/` → Rotas e componentes visuais
  - `lib/` → Funções auxiliares e regras de negócio
  - `services/` → Lógica de negócios (ex.: transações, reversões)
  - `data/` → Camada responsável por consultas e manipulação no banco
  - `tests/` → Testes unitários e integração

## 🔐 Segurança

- Autenticação robusta utilizando **NextAuth** com sessões seguras
- Hash de senhas com **bcrypt** (caso necessário para cadastro local)
- Tokens e sessões protegidos contra ataques comuns
- Validações rigorosas no backend com **Zod**
- Proteção de rotas e operações sensíveis
- Prevenção de:
  - Injeção de comandos no banco (Mongo Injection)
  - Mass Assignment
  - Manipulação de saldo indevida

## 🧠 Padrões e Boas Práticas

- **SOLID**
- **DRY (Don't Repeat Yourself)**
- Validações centralizadas
- Tratamento de erros customizado
- Logs de operações críticas
- Código limpo e modularizado

## 🐳 Docker

O projeto é totalmente containerizado.

### ⚙️ Como rodar com Docker

```bash
docker-compose up --build
```
### Alternativa sem Docker

1. Instale dependências:

```bash
npm install
```

2. Configure variáveis de ambiente:
Crie um arquivo .env

3. Inicie o projeto

```bash
npm run dev
```
### 🔧 Scripts Disponíveis

- dev — Rodar aplicação em desenvolvimento
- build — Build para produção
- start — Rodar em produção

### 🧪 Testes
![image](https://github.com/user-attachments/assets/1287fbca-3b20-4115-8bca-d1f909b3607e)


### 📑 Documentação API

| Método | Endpoint             | Descrição                        |
| ------ | -------------------- | -------------------------------- |
| POST   | `/api/auth/register` | Cadastro de usuário              |
| POST   | `/api/auth/login`    | Login (gerenciado pelo NextAuth) |
| POST   | `/api/deposit`       | Realizar depósito                |
| POST   | `/api/transfer`      | Realizar transferência           |
| POST   | `/api/reverse`       | Reverter uma operação            |
| GET    | `/api/transactions`  | Listar histórico de transações   |


### 🔥 Roadmap de Melhorias

 Testes E2E com Cypress


### 🤝 Contribuição
Sinta-se à vontade para abrir uma issue ou fazer um pull request.

### 📝 Licença
Este projeto está sob a licença MIT.

### 💻 Demonstração
