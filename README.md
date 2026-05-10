# 💳 Payment Sandbox (Monorepo)

<p align="center">
  <img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" />
</p>

## 🚀 Overview

Sandbox de plateforme de paiement inspirée de solutions type Kkiapay, construite en **monorepo TurboRepo** avec NestJS + Next.js.

Objectif : simuler un système fintech complet, sécurisé et scalable, avec architecture professionnelle (backend confirmé / senior level).

---

## 🧱 Stack technique

- **Monorepo** : TurboRepo
- **Package manager** : pnpm
- **Backend** : NestJS (TypeScript)
- **Frontend** : Next.js (App Router)
- **DB** : MongoDB + Mongoose
- **Tests** : Jest + Supertest
- **CI/CD** : GitHub Actions
- **Logs** : Pino
- **Validation** : class-validator + Joi

---

## 📁 Structure

```
/apps
  /api   -> Backend NestJS
  /web   -> Frontend Next.js

/packages
  /shared -> types, DTOs, utils partagés
```

---

## ⚙️ Installation

```bash
pnpm install
```

---

## 🏃‍♂️ Lancer le projet

### Dev

```bash
pnpm dev
pnpm --filter api dev
pnpm --filter web dev
```

### Build

```bash
pnpm build
pnpm --filter api build
pnpm --filter web build
```

### Prod

```bash
pnpm prod
pnpm --filter api prod
pnpm --filter web prod
```

---

## 🧪 Tests

### Unit tests

```bash
pnpm test
pnpm --filter api test
pnpm --filter web test
```

### E2E tests

```bash
pnpm test:e2e
pnpm --filter api test:e2e
pnpm --filter web test:e2e
```

### Coverage

```bash
pnpm test:cov
pnpm --filter api test:cov
pnpm --filter web test:cov
```

---

## 🧠 Architecture

### Backend (NestJS)

Modules principaux :

- Auth (JWT, refresh tokens, guards)
- Users (CRUD + profile)
<!-- - Payments (core transaction system)
- Wallet (balance management)
- Ledger (historique financier immuable)
- API Keys (auth API marchand)
- Webhooks (HMAC + retry)
- Audit logs -->

---

## 🔐 Sécurité

- JWT access + refresh
- HMAC webhooks
<!-- - Rate limiting -->
- Validation DTO stricte
<!-- - Protection injection / XSS -->
<!-- - Idempotency keys -->

---

## 🧪 Tests

- Unit tests (services)
- Integration tests (controllers)
- E2E tests (auth, users, payments flow)

---

## 📦 API Prefix

Toutes les routes backend sont préfixées :

```
/api/v1
```

---

## 🚀 CI/CD

GitHub Actions :

- lint
- test
- build

---

## 📊 Objectif

Construire une plateforme fintech réaliste démontrant :

- maîtrise backend avancée NestJS
- architecture scalable
- clean code & SOLID
- tests automatisés
- gestion d’un système distribué

---

## 📜 License

MIT
