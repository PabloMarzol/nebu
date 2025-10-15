import { defineConfig } from "drizzle-kit";

export default defineConfig({
  out: "./migrations-otc",
  schema: "./shared/otc-schema.ts",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
});