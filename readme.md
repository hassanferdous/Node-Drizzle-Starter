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

## 3. Database Migration

Run the following command to apply Prisma migrations to your PostgreSQL database:

```bash
npx prisma migrate deploy
```

or, for development:

```bash
npx prisma migrate dev
```

## 4. Generate API (Prisma Model)

To create a new model, edit your `prisma/schema.prisma` file and add your model definition. Then generate the Prisma client:

```bash
npx prisma generate
```

## 5. Seed Data

To seed your database with initial data, run:

```bash
npx prisma db seed
```

_(Ensure you have a `prisma/seed.ts` or `prisma/seed.js` file set up for seeding.)_

## 6. Generate a New Entity Base

You can quickly scaffold a new entity base using the custom script. Run:

```bash
pnpm run generate:api <entityName>
```

Replace `<entityName>` with your desired entity name (e.g., `User`, `Product`). This will generate the necessary boilerplate files for the new entity.

## 7. Running the Project

Start the development server:

```bash
pnpm run dev
```

or

```bash
pnpm start
```

The API will be available at `http://localhost:3000` by default.

---

**Note:**

-  Ensure your PostgreSQL database connection URL is set in your `.env` file as `DATABASE_URL`.
-  For more commands, refer to the [Prisma CLI documentation](https://www.prisma.io/docs/reference/api-reference/command-reference).
-  This project uses Express.js v5.
