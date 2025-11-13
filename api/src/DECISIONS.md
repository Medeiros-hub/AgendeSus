# AgendeSus - Decisões Arquiteturais

## Arquitetura Geral

### Domain-Driven Design (DDD)
**DECISÃO:** Usar DDD com separação clara de camadas (domain, application, infra, interface).

**JUSTIFICATIVA:**
- O domínio de agendamento médico tem regras de negócio complexas (status de agendamento, confirmações, cancelamentos)
- DDD permite modelar essas regras explicitamente nas entidades e value objects
- Facilita testes unitários das regras de negócio isoladas da infraestrutura
- Melhora manutenibilidade a longo prazo

**ALTERNATIVAS CONSIDERADAS:**
- **Arquitetura em camadas simples (MVC):** Mais rápido inicialmente, mas mistura concerns e dificulta testes
- **Clean Architecture:** Similar ao DDD, mas mais verboso; DDD é mais pragmático para este domínio
- **Transaction Script:** Muito simples, não escala bem com complexidade de negócio

---

## Autenticação e Autorização

### JWT com RS256 e Cookies HTTP-only
**DECISÃO:** Tokens JWT assinados com RS256 (chaves assimétricas) armazenados em cookies HTTP-only.

**JUSTIFICATIVA:**
- **RS256:** Permite validação de tokens com chave pública em múltiplos serviços sem compartilhar secret
- **Cookies HTTP-only:** Protege contra ataques XSS (JavaScript não consegue acessar o token)
- **SameSite Lax:** Protege contra CSRF em navegadores modernos

**ALTERNATIVAS CONSIDERADAS:**
- **HS256:** Mais simples, mas requer secret compartilhado entre serviços
- **localStorage/sessionStorage:** Vulnerável a XSS
- **Authorization header:** Padrão REST, mas menos seguro que cookies HTTP-only

**RISCOS:**
- Tokens não podem ser revogados antes da expiração (considerar blacklist ou refresh tokens em produção)
- Cookies podem ter limitações em cenários mobile (considerar dual-mode: cookie + header)

---

## Persistência

### Prisma + Repository Pattern
**DECISÃO:** Usar Prisma como ORM com repositories implementando interfaces definidas no domínio.

**JUSTIFICATIVA:**
- Prisma oferece type-safety excelente com TypeScript
- Repository pattern mantém domínio independente da tecnologia de persistência
- Facilita testes com mock repositories

**ALTERNATIVAS CONSIDERADAS:**
- **TypeORM:** Mais maduro, mas menos type-safe e decorators mistura concerns
- **Prisma direto nos use cases:** Mais simples, mas acopla domínio à infra
- **Kysely/Knex:** Mais controle, mas menos produtivo

---

## Validação

### class-validator + ValidationPipe Global
**DECISÃO:** Validação declarativa com decorators nos DTOs e pipe global.

**JUSTIFICATIVA:**
- Validação centralizada e consistente em todos os endpoints
- Declarativa (fácil de ler e manter)
- Integração nativa com NestJS

**ALTERNATIVAS CONSIDERADAS:**
- **Joi/Yup:** Mais flexível, mas menos integrado com NestJS
- **Zod:** Moderno e type-safe, mas menos maduro no ecossistema Nest
- **Validação manual:** Muito verboso e propenso a erros

---

## Estrutura de Módulos

### Um módulo por bounded context
**DECISÃO:** Cada domínio (users, schedulings, available-times, etc.) é um módulo independente.

**JUSTIFICATIVA:**
- Baixo acoplamento entre domínios
- Facilita desenvolvimento em paralelo por times diferentes
- Permite extração para microserviços no futuro

**TRADE-OFFS:**
- Mais arquivos e diretórios (pode parecer over-engineering inicialmente)
- Requer disciplina para não criar dependências circulares

---

## Tratamento de Erros

### Exception Filters Global
**DECISÃO:** Filter global que captura todas exceptions e formata resposta padronizada.

**JUSTIFICATIVA:**
- Respostas de erro consistentes em toda API
- Centraliza logging de erros
- Separa domain exceptions de HTTP status codes

**ALTERNATIVAS CONSIDERADAS:**
- **Filters específicos por módulo:** Mais granular, mas menos consistente
- **Result pattern:** Explícito, mas verboso em TypeScript
- **Try/catch em cada controller:** Muito repetitivo

---

## Value Objects

### CPF e Email como Value Objects
**DECISÃO:** Encapsular validação e comportamento em value objects.

**JUSTIFICATIVA:**
- Validação acontece na criação (fail-fast)
- Impossível criar CPF/Email inválido
- Expressividade no código do domínio

**ALTERNATIVAS CONSIDERADAS:**
- **Validação apenas nos DTOs:** Domínio fica anêmico e pode receber dados inválidos
- **Biblioteca de validação externa:** Menos expressivo no domínio

---

## Considerações para Produção

### O que está faltando para produção:
1. **Refresh tokens:** Atual implementação só usa access tokens
2. **Rate limiting:** Prevenir abuso de APIs (especialmente /auth/login)
3. **Logging estruturado:** Winston/Pino com correlationId
4. **Observabilidade:** Métricas (Prometheus), tracing (OpenTelemetry)
5. **Health checks:** Endpoints /health para load balancers
6. **Database migrations:** Prisma Migrate configurado corretamente
7. **Testes:** Unitários (domain), integração (use cases), E2E (controllers)
8. **CI/CD:** Pipeline automatizado
9. **Documentação:** Swagger/OpenAPI
10. **Notificações:** SMS/Email para confirmações e lembretes

---

## Padrões Utilizados

- **Repository Pattern:** Abstração de persistência
- **Use Case Pattern:** Um use case por ação de negócio
- **DTO Pattern:** Separação entre entrada/saída e domínio
- **Dependency Injection:** Inversão de controle via NestJS
- **Strategy Pattern:** Implícito nos repositories (pode trocar implementação)

---

**Data:** 2025-01-02  
**Autor:** Sistema AgendeSus  
**Versão:** 1.0.0
