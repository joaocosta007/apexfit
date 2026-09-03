import { readFileSync, existsSync } from "node:fs";
import { resolve } from "node:path";

const HOMOLOGATION_PROJECT_REF = "jmqfvucyjjcjfvmckcyb";
const EXPECTED_USERNAME = `postgres.${HOMOLOGATION_PROJECT_REF}`;
const EXPECTED_HOST = "aws-0-us-west-2.pooler.supabase.com";
const EXPECTED_PORT = "5432";
const EXPECTED_DATABASE = "/postgres";

const ALLOWLIST = new Set([
  "DATABASE_URL",
  "APP_ENV",
  "HOMOLOGATION_SEED",
  "NODE_ENV",
]);

const file = resolve(process.cwd(), ".env.homolog");

if (!existsSync(file)) {
  console.error("❌ Arquivo .env.homolog não encontrado na raiz do projeto.");
  console.error(
    "   Crie o arquivo com DATABASE_URL, APP_ENV=homologation e HOMOLOGATION_SEED=true."
  );
  process.exit(1);
}

const content = readFileSync(file, "utf8");

for (const rawLine of content.split(/\r?\n/)) {
  const line = rawLine.trim();

  if (!line || line.startsWith("#")) {
    continue;
  }

  const separator = line.indexOf("=");

  if (separator === -1) {
    continue;
  }

  const key = line.slice(0, separator).trim();
  let value = line.slice(separator + 1).trim();

  if (
    (value.startsWith('"') && value.endsWith('"')) ||
    (value.startsWith("'") && value.endsWith("'"))
  ) {
    value = value.slice(1, -1);
  }

  if (ALLOWLIST.has(key)) {
    process.env[key] = value;
  }
}

if (!process.env.DATABASE_URL) {
  console.error("❌ .env.homolog não contém DATABASE_URL.");
  process.exit(1);
}

if (process.env.APP_ENV !== "homologation") {
  console.error("❌ .env.homolog não contém APP_ENV=homologation.");
  process.exit(1);
}

if (process.env.HOMOLOGATION_SEED !== "true") {
  console.error("❌ .env.homolog não contém HOMOLOGATION_SEED=true.");
  process.exit(1);
}

if (process.env.NODE_ENV === "production") {
  console.error("❌ .env.homolog contém NODE_ENV=production. Recusado.");
  process.exit(1);
}

let databaseUrl;

try {
  databaseUrl = new URL(process.env.DATABASE_URL);
} catch {
  console.error("❌ DATABASE_URL em .env.homolog não é uma URL PostgreSQL válida.");
  process.exit(1);
}

if (!["postgres:", "postgresql:"].includes(databaseUrl.protocol)) {
  console.error("❌ DATABASE_URL deve usar o protocolo PostgreSQL.");
  process.exit(1);
}

if (databaseUrl.username !== EXPECTED_USERNAME) {
  console.error("❌ DATABASE_URL não pertence ao projeto de homologação autorizado.");
  process.exit(1);
}

if (
  databaseUrl.hostname !== EXPECTED_HOST ||
  databaseUrl.port !== EXPECTED_PORT ||
  databaseUrl.pathname !== EXPECTED_DATABASE
) {
  console.error(
    "❌ DATABASE_URL não corresponde ao Session Pooler autorizado para homologação."
  );
  process.exit(1);
}
