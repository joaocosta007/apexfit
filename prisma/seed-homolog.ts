import { PrismaClient, Role } from "@prisma/client";
import { hash } from "bcryptjs";
import { randomBytes } from "node:crypto";

const prisma = new PrismaClient();

function parseArgs(): { confirm: boolean; rotatePasswords: boolean } {
  const args = process.argv.slice(2);
  return {
    confirm: args.includes("--confirm"),
    rotatePasswords: args.includes("--rotate-passwords"),
  };
}

function validateEnvironment(): void {
  if (process.env.NODE_ENV === "production") {
    console.error(
      "❌ NODE_ENV=production detectado. Seed de homologação recusado em produção."
    );
    process.exit(1);
  }
  if (process.env.APP_ENV !== "homologation") {
    console.error(
      "❌ APP_ENV=homologation não detectado. Defina APP_ENV=homologation para rodar este seed."
    );
    process.exit(1);
  }
  if (process.env.HOMOLOGATION_SEED !== "true") {
    console.error(
      "❌ HOMOLOGATION_SEED=true não detectado. Defina HOMOLOGATION_SEED=true para rodar este seed."
    );
    process.exit(1);
  }
}

function generatePassword(): string {
  const bytes = randomBytes(16);
  const base64 = bytes.toString("base64url");
  return "Hm-" + base64.slice(0, 21);
}

async function hashPassword(password: string): Promise<string> {
  return hash(password, 10);
}

function printCredential(label: string, email: string, password: string): void {
  console.log(`  [HOMOLOG] ${label}`);
  console.log(`    E-mail:  ${email}`);
  console.log(`    Senha:   ${password}`);
}

async function upsertUser(params: {
  name: string;
  email: string;
  role: Role;
  rotatePassword: boolean;
}): Promise<{ id: string; passwordPrinted: boolean }> {
  const existing = await prisma.user.findUnique({
    where: { email: params.email },
    select: { id: true, passwordHash: true },
  });

  if (existing && !params.rotatePassword) {
    await prisma.user.update({
      where: { id: existing.id },
      data: { name: params.name, role: params.role },
    });
    return { id: existing.id, passwordPrinted: false };
  }

  const password = generatePassword();
  const passwordHash = await hashPassword(password);

  if (existing) {
    await prisma.user.update({
      where: { id: existing.id },
      data: {
        name: params.name,
        role: params.role,
        passwordHash,
      },
    });
    printCredential(params.role, params.email, password);
    return { id: existing.id, passwordPrinted: true };
  }

  const created = await prisma.user.create({
    data: {
      name: params.name,
      email: params.email,
      role: params.role,
      passwordHash,
    },
  });
  printCredential(params.role, params.email, password);
  return { id: created.id, passwordPrinted: true };
}

async function ensureVinculo(
  studentId: string,
  trainerId: string
): Promise<void> {
  const existing = await prisma.studentTrainer.findFirst({
    where: { studentId, trainerId },
  });
  if (!existing) {
    await prisma.studentTrainer.create({
      data: { studentId, trainerId },
    });
  }
}

async function ensurePlano(params: {
  studentId: string;
  trainerId: string;
  planName: string;
  trainingDays: unknown[];
  splits: Array<{
    splitName: string;
    sortOrder: number;
    exercises: Array<{
      name: string;
      sets: number;
      reps: number;
      loadKg: number;
      restTime: string;
    }>;
  }>;
}): Promise<void> {
  const existing = await prisma.workoutPlan.findFirst({
    where: {
      studentId: params.studentId,
      planName: params.planName,
    },
    select: { id: true },
  });

  if (existing) {
    await prisma.workoutPlan.update({
      where: { id: existing.id },
      data: { trainingDays: params.trainingDays as never },
    });
    return;
  }

  await prisma.workoutPlan.create({
    data: {
      studentId: params.studentId,
      trainerId: params.trainerId,
      planName: params.planName,
      trainingDays: params.trainingDays as never,
      splits: {
        create: params.splits.map((split) => ({
          splitName: split.splitName,
          sortOrder: split.sortOrder,
          exercises: { create: split.exercises },
        })),
      },
    },
  });
}

async function main() {
  const args = parseArgs();

  if (!args.confirm) {
    console.log("Uso: npm run db:seed:homolog -- --confirm");
    console.log("Opções:");
    console.log("  --confirm             Confirma execução do seed");
    console.log("  --rotate-passwords    Regenera todas as senhas (exige --confirm)");
    process.exit(0);
  }

  validateEnvironment();

  const rotatePasswords = args.rotatePasswords;
  console.log("🔒 Seed de homologação — ApexFit");
  console.log(`   Ambiente: APP_ENV=${process.env.APP_ENV}`);
  console.log(`   Modo: ${rotatePasswords ? "criação + rotação de senhas" : "criação/preservação"}`);
  console.log();

  const gerente = await upsertUser({
    name: "Helena Sousa",
    email: "gerente.h@apexfit.local",
    role: Role.MANAGER,
    rotatePassword: rotatePasswords,
  });

  const treinador = await upsertUser({
    name: "Marcos Oliveira",
    email: "treinador.h@apexfit.local",
    role: Role.TRAINER,
    rotatePassword: rotatePasswords,
  });

  const aluno1 = await upsertUser({
    name: "Lucas Ferreira",
    email: "aluno.h1@apexfit.local",
    role: Role.STUDENT,
    rotatePassword: rotatePasswords,
  });

  const aluno2 = await upsertUser({
    name: "Juliana Costa",
    email: "aluno.h2@apexfit.local",
    role: Role.STUDENT,
    rotatePassword: rotatePasswords,
  });

  await ensureVinculo(aluno1.id, treinador.id);
  await ensureVinculo(aluno2.id, treinador.id);

  await ensurePlano({
    studentId: aluno1.id,
    trainerId: treinador.id,
    planName: "Plano Básico A",
    trainingDays: [
      { indice: 0, letra: "S", nome: "Segunda" },
      { indice: 2, letra: "Q", nome: "Quarta" },
      { indice: 4, letra: "S", nome: "Sexta" },
    ],
    splits: [
      {
        splitName: "Treino A",
        sortOrder: 0,
        exercises: [
          { name: "Agachamento Livre", sets: 3, reps: 10, loadKg: 40, restTime: "90s" },
          { name: "Supino Reto", sets: 3, reps: 10, loadKg: 30, restTime: "75s" },
          { name: "Remada Curvada", sets: 3, reps: 10, loadKg: 25, restTime: "75s" },
        ],
      },
    ],
  });

  console.log();
  console.log("✅ Seed de homologação concluído.");
  console.log();
  console.log("Credenciais (apenas neste terminal):");
  console.log(`  Gerente:    gerente.h@apexfit.local`);
  console.log(`  Treinador:  treinador.h@apexfit.local`);
  console.log(`  Aluno 1:    aluno.h1@apexfit.local`);
  console.log(`  Aluno 2:    aluno.h2@apexfit.local`);
  if (rotatePasswords) {
    console.log();
    console.log("⚠️  Todas as senhas foram regeneradas. As senhas anteriores deixaram de funcionar.");
  }
}

main()
  .catch((error) => {
    console.error("❌ Erro ao executar seed de homologação:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
