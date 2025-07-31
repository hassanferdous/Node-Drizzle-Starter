# Project Setup & Usage Guide

## 1. Clone the Repository

```bash
git clone <repository-url>
cd express-api-v1
```

## 2. Install Dependencies

```bash
pnpm install
```

## Project structure

├── .dockerignore
├── .env
├── .env.development
├── .env.example
├── .gitignore
├── .prettierrc
├── Dockerfile
├── README.md
├── compose.yaml
├── drizzle
│   ├── 0000_smart_molten_man.sql
├── drizzle.config.ts
├── package-lock.json
├── package.json
├── pnpm-lock.yaml
├── src
│   ├── .DS_Store
│   ├── app.ts
│   ├── config
│   │   ├── .DS_Store
│   │   ├── config.development.json
│   │   ├── db.ts
│   │   ├── env.ts
│   │   └── index.ts
│   ├── db
│   │   ├── common.ts
│   │   └── schema.ts
│   ├── domains
│   │   └── v1
│   │   ├── auth
│   │   │   ├── api.ts
│   │   │   ├── docs.ts
│   │   │   ├── index.ts
│   │   │   ├── passport
│   │   │   │   ├── index.ts
│   │   │   │   ├── strategy.google.ts
│   │   │   │   └── strategy.local.ts
│   │   │   ├── service.ts
│   │   │   └── validation.ts
│   │   └── user
│   │   ├── api.ts
│   │   ├── index.ts
│   │   ├── service.ts
│   │   └── validation.ts
│   ├── index.d.ts
│   ├── lib
│   │   ├── common-zod-schema.ts
│   │   ├── rate-limit.ts
│   │   └── redis.ts
│   ├── middlewares
│   │   ├── auth.middleware.ts
│   │   ├── authorize.middleware.ts
│   │   ├── csrf.middleware.ts
│   │   ├── error.middleware.ts
│   │   ├── safe-parse.middleware.ts
│   │   └── validate.middleware.ts
│   ├── routes
│   │   ├── index.ts
│   │   └── view-routes.ts
│   ├── scripts
│   │   └── generate-api.js
│   ├── seed.ts
│   ├── server.ts
│   ├── swagger
│   │   ├── component.schema.ts
│   │   └── index.ts
│   ├── utils
│   │   ├── cookie.ts
│   │   ├── error.ts
│   │   ├── formatZodError.ts
│   │   ├── getCachedOrLoad.ts
│   │   ├── jwt.ts
│   │   ├── password-hash.ts
│   │   └── response.ts
│   └── views
│   ├── index.ejs
│   ├── login-success.ejs
│   └── login.ejs
├── structure.txt
└── tsconfig.json
