import "dotenv/config";
import { defineConfig } from "prisma/config";

// `prisma generate` doesn't need a live database connection, so this falls
// back to a placeholder instead of throwing when DATABASE_URL isn't set yet
// (e.g. a fresh Vercel project before env vars are configured). Commands
// that do need a real connection (migrate, db push) will fail with a clear
// connection error instead, which is the right failure mode for those.
export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    // CLI commands (migrate, db pull, generate) usam a conexão direta —
    // a "Transaction pooler" (DATABASE_URL, usada em runtime pelo app)
    // trava nesses comandos (limitação conhecida do PgBouncer em modo
    // transação).
    url:
      process.env.DIRECT_DATABASE_URL ??
      process.env.DATABASE_URL ??
      "postgresql://placeholder:placeholder@localhost:5432/placeholder",
  },
});
