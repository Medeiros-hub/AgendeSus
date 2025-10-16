# Agende SUS API

Sistema de agendamento para unidades básicas de saúde (UBS) desenvolvido com NestJS, seguindo os princípios de Domain Driven Design (DDD), SOLID e arquitetura RESTful.

## 🏗️ Arquitetura

O projeto segue os princípios do DDD com separação clara de responsabilidades:

### Estrutura de Pastas

```
src/
├── modules/
│   ├── auth/                    # Módulo de autenticação
│   │   ├── guards/             # Guards de autenticação e autorização
│   │   ├── strategies/         # Estratégias Passport (Local, JWT)
│   │   ├── dtos/              # DTOs específicos de auth
│   │   ├── auth.service.ts    # Lógica de autenticação
│   │   ├── auth.controller.ts # Controller de auth
│   │   └── auth.module.ts     # Módulo de auth
│   │
│   └── user/                   # Módulo de usuários
│       ├── domain/            # Camada de domínio
│       │   ├── entities/      # Entidades de domínio
│       │   └── repositories/  # Interfaces de repositórios
│       ├── application/       # Camada de aplicação
│       │   ├── use-cases/     # Casos de uso
│       │   └── dtos/          # DTOs de aplicação
│       ├── infrastructure/    # Camada de infraestrutura
│       │   └── repositories/  # Implementações de repositórios
│       ├── presentation/      # Camada de apresentação
│       │   └── controllers/   # Controllers REST
│       └── user.module.ts     # Módulo de usuários
│
├── shared/                    # Recursos compartilhados
│   ├── interfaces/           # Interfaces genéricas
│   ├── dtos/                # DTOs compartilhados
│   ├── guards/              # Guards compartilhados
│   └── decorators/          # Decorators customizados
│
├── core/                     # Núcleo da aplicação
│   └── infra/               # Infraestrutura
│       ├── config/          # Configurações
│       └── database/        # Configurações de banco
│
├── config/                  # Configurações específicas
│   └── docs/               # Configuração do Swagger
│
├── app.module.ts           # Módulo principal
└── main.ts                # Arquivo de inicialização
```

## 🚀 Tecnologias

- **NestJS** - Framework Node.js
- **Prisma** - ORM para banco de dados
- **PostgreSQL** - Banco de dados
- **JWT** - Autenticação
- **Passport** - Estratégias de autenticação
- **Swagger** - Documentação da API
- **bcryptjs** - Hash de senhas
- **class-validator** - Validação de DTOs

## 📦 Instalação

1. Clone o repositório:
```bash
git clone <repo-url>
cd api
```

2. Instale as dependências:
```bash
pnpm install
```

3. Configure o banco de dados:
```bash
# Copie o arquivo de exemplo
cp .env.example .env

# Edite o .env com suas configurações
# DATABASE_URL="postgresql://username:password@localhost:5432/agendesus?schema=public"
# JWT_SECRET="your-super-secret-jwt-key-here"
```

4. Execute as migrações do banco:
```bash
npx prisma migrate dev
```

5. Gere o cliente Prisma:
```bash
npx prisma generate
```

6. Inicie a aplicação:
```bash
# Desenvolvimento
pnpm run start:dev

# Produção
pnpm run build
pnpm run start:prod
```

## 📚 Documentação da API

A documentação completa da API está disponível em: `http://localhost:3000/api/docs`

## 🔐 Autenticação

O sistema utiliza JWT para autenticação. Endpoints disponíveis:

### Registro
```http
POST /auth/register
Content-Type: application/json

{
  "cpf": "12345678901",
  "fullName": "João da Silva",
  "birthDate": "1990-01-01",
  "phone": "11999999999",
  "email": "joao@email.com",
  "password": "senha123"
}
```

### Login
```http
POST /auth/login
Content-Type: application/json

{
  "identifier": "12345678901", // CPF ou email
  "password": "senha123"
}
```

### Resposta do Login
```json
{
  "success": true,
  "message": "Login realizado com sucesso",
  "data": {
    "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": "uuid",
      "cpf": "12345678901",
      "fullName": "João da Silva",
      "email": "joao@email.com",
      "type": "CITIZEN"
    }
  }
}
```

## 👥 Tipos de Usuário

- **CITIZEN** - Cidadão comum (pode agendar consultas)
- **RECEPTIONIST** - Recepcionista (pode gerenciar agendamentos)
- **ADMIN** - Administrador (acesso total)

## 🏥 Endpoints de Usuários

### Listar usuários (Admin/Recepcionista)
```http
GET /users
Authorization: Bearer <token>
```

### Buscar usuário por ID
```http
GET /users/:id
Authorization: Bearer <token>
```

### Atualizar usuário
```http
PUT /users/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "fullName": "João da Silva Santos",
  "email": "novo@email.com",
  "phone": "11888888888"
}
```

## 🔒 Autorização

O sistema implementa controle de acesso baseado em roles:

- Endpoints públicos: registro e login
- Endpoints autenticados: perfil do usuário, atualização
- Endpoints administrativos: listagem de todos os usuários

## 🧪 Testes

```bash
# Testes unitários
pnpm run test

# Testes e2e
pnpm run test:e2e

# Coverage
pnpm run test:cov
```

## 🐳 Docker

```bash
# Subir os serviços
docker-compose up -d

# Logs
docker-compose logs -f api
```

## 📋 Princípios Implementados

### DDD (Domain Driven Design)
- **Entities**: Lógica de negócio encapsulada
- **Repositories**: Abstração de acesso a dados
- **Use Cases**: Casos de uso bem definidos
- **Domain Services**: Serviços de domínio

### SOLID
- **S**ingle Responsibility: Cada classe tem uma responsabilidade
- **O**pen/Closed: Extensível sem modificação
- **L**iskov Substitution: Interfaces bem definidas
- **I**nterface Segregation: Interfaces específicas
- **D**ependency Inversion: Dependência de abstrações

### RESTful
- Recursos bem definidos
- HTTP methods apropriados
- Status codes corretos
- Estrutura de resposta padronizada

## 🤝 Contribuição

1. Faça um fork do projeto
2. Crie uma branch para sua feature
3. Commit suas mudanças
4. Push para a branch
5. Abra um Pull Request

## 📝 License

Este projeto está sob a licença MIT.
