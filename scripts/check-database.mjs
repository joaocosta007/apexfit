import { PrismaClient } from "@prisma/client";

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL não está configurada. O deploy foi bloqueado antes da publicação.");
}

const prisma = new PrismaClient();
const timeout = new Promise((_, reject) => {
  setTimeout(() => reject(new Error("Tempo limite excedido ao conectar ao banco.")), 12_000);
});

try {
  await Promise.race([prisma.$queryRaw`SELECT 1`, timeout]);
  console.log("Conexão com o banco validada.");
} catch (error) {
  const detail = error instanceof Error ? error.message : "erro desconhecido";
  throw new Error(`Banco indisponível. O deploy foi bloqueado antes da publicação: ${detail}`);
} finally {
  await prisma.$disconnect();
}
