# 💳 Payment Sandbox API (NestJS)

Backend principal de la plateforme de paiement sandbox (inspirée de Kkiapay).

Architecture **modulaire NestJS + MongoDB + Mongoose**, pensée pour production.

---

## 🚀 API Base URL

```
/api/v1
```

---

## 🧱 Architecture

```
src/
 ├── common/        # filters, interceptors, swagger, dto globaux
 ├── config/        # config + env validation
 ├── database/      # connexion MongoDB
 ├── modules/
 │    ├── auth
 <!-- │    ├── users
 │    ├── payments
 │    ├── wallets
 │    ├── ledger
 │    ├── webhooks
 │    ├── audit -->
 │    └── health
```

---

## ⚙️ Installation

```bash
pnpm install
```

---

## 🏃‍♂️ Run API

### Dev

```bash
pnpm start:dev
```

### Build

```bash
pnpm build
```

### Prod

```bash
pnpm start:prod
```

---

## 🧪 Tests

### Unit tests

```bash
pnpm test
```

### E2E tests

```bash
pnpm test:e2e
```

### Coverage

```bash
pnpm test:cov
```

---

## 📦 Modules principaux

### 🔐 Auth

- register / login
- JWT (access token)
- guards + strategies

### 👤 Users

- GET /users/me
- PATCH /users/me
- PATCH /users/me/deactivate

### 💳 Payments (CORE)

- create payment session
- simulate payment gateway
- idempotency keys

### 💰 Wallet

- balance management
- debit / credit

### 📒 Ledger

- immutable financial history

### 🔔 Webhooks

- event dispatch
- HMAC signature
- retry mechanism

### 📜 Audit logs

- tracking sensitive actions

---

## 🔐 Security

- JWT auth
- bcrypt password hashing
- validation pipes strict
- rate limiting
- HMAC webhook signature
- idempotency protection

---

## 🧪 Testing Strategy

### Unit

- services logic
- mappers
- utils

### Integration

- controllers + DB mock

### E2E

- auth flow
- users lifecycle
- payments flow (future)

---

## 🧾 API Response Format

All responses follow:

```json
{
  "success": true,
  "message": "success",
  "data": {},
  "error": null,
  "meta": {}
}
```

---

## 🧪 E2E Examples Covered

- /auth/register
- /auth/login
- /users/me
- /users/me/update
- /users/me/deactivate

---

## 🧠 Design Principles

- Clean Architecture
- SOLID principles
- Modular design
- Separation of concerns
- DTO-driven validation

---

## 📌 Notes

- All routes are prefixed with `/api/v1`
- MongoDB used via Mongoose
- Designed for scalability (payments system simulation)

---

## 📜 License

MIT
