import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const db = await prisma.$queryRaw<{ current_database: string }[]>`SELECT current_database()`;
  const schema = await prisma.$queryRaw<{ current_schema: string }[]>`SELECT current_schema()`;
  const total = await prisma.$queryRaw<{ count: bigint }[]>`SELECT COUNT(*) AS count FROM public."users"`;
  const local = await prisma.$queryRaw<{ count: bigint }[]>`SELECT COUNT(*) AS count FROM public."users" WHERE email LIKE '%@apexfit.local'`;

  console.log("=== Diagnóstico de Conexão — Homologação ===");
  console.log(`Banco atual:       ${db[0]?.current_database ?? "desconhecido"}`);
  console.log(`Schema atual:      ${schema[0]?.current_schema ?? "desconhecido"}`);
  console.log(`Total users:       ${total[0]?.count ?? 0}`);
  console.log(`Users @apexfit.local: ${local[0]?.count ?? 0}`);
}

main()
  .catch((error) => {
    console.error("Erro ao diagnosticar:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
