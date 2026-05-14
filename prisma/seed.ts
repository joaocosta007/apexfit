import { PrismaClient, Role } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

const senhaPadrao = "123456";

const diasDaSemana = [
  { indice: 0, letra: "S", nome: "Segunda" },
  { indice: 1, letra: "T", nome: "Terça" },
  { indice: 2, letra: "Q", nome: "Quarta" },
  { indice: 3, letra: "Q", nome: "Quinta" },
  { indice: 4, letra: "S", nome: "Sexta" },
  { indice: 5, letra: "S", nome: "Sábado" },
  { indice: 6, letra: "D", nome: "Domingo" }
] as const;

function diasPorIndice(indices: number[]) {
  return indices.map((indice) => diasDaSemana[indice]);
}

async function criarUsuario(name: string, email: string, role: Role) {
  const passwordHash = await bcrypt.hash(senhaPadrao, 10);

  return prisma.user.upsert({
    where: { email },
    update: { name, role, passwordHash },
    create: { name, email, role, passwordHash }
  });
}

async function criarPlanoCompleto(params: {
  studentId: string;
  trainerId: string;
  planName: string;
  trainingDays: ReturnType<typeof diasPorIndice>;
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
}) {
  await prisma.workoutPlan.deleteMany({
    where: {
      studentId: params.studentId,
      trainerId: params.trainerId,
      planName: params.planName
    }
  });

  return prisma.workoutPlan.create({
    data: {
      studentId: params.studentId,
      trainerId: params.trainerId,
      planName: params.planName,
      trainingDays: params.trainingDays,
      splits: {
        create: params.splits.map((split) => ({
          splitName: split.splitName,
          sortOrder: split.sortOrder,
          exercises: {
            create: split.exercises
          }
        }))
      }
    },
    include: {
      splits: {
        include: {
          exercises: true
        }
      }
    }
  });
}

async function main() {
  console.log("🌱 Iniciando seed do ApexFit...");

  const gerente = await criarUsuario("Camila Nogueira", "gerente@apexfit.com", Role.MANAGER);
  const professorBruno = await criarUsuario("Bruno Martins", "professor.bruno@apexfit.com", Role.TRAINER);
  const professoraLarissa = await criarUsuario("Larissa Costa", "professora.larissa@apexfit.com", Role.TRAINER);
  const alunaAna = await criarUsuario("Ana Paula Ribeiro", "aluna.ana@apexfit.com", Role.STUDENT);
  const alunoRafael = await criarUsuario("Rafael Souza", "aluno.rafael@apexfit.com", Role.STUDENT);
  const alunaMarina = await criarUsuario("Marina Almeida", "aluna.marina@apexfit.com", Role.STUDENT);

  await prisma.studentTrainer.createMany({
    data: [
      { studentId: alunaAna.id, trainerId: professorBruno.id },
      { studentId: alunoRafael.id, trainerId: professorBruno.id },
      { studentId: alunaMarina.id, trainerId: professoraLarissa.id }
    ],
    skipDuplicates: true
  });

  const planoAna = await criarPlanoCompleto({
    studentId: alunaAna.id,
    trainerId: professorBruno.id,
    planName: "Hipertrofia Feminina",
    trainingDays: diasPorIndice([0, 1, 2, 3, 4]),
    splits: [
      {
        splitName: "Treino A",
        sortOrder: 0,
        exercises: [
          { name: "Agachamento Livre", sets: 4, reps: 10, loadKg: 45, restTime: "90s" },
          { name: "Leg Press 45°", sets: 4, reps: 12, loadKg: 120, restTime: "90s" },
          { name: "Cadeira Extensora", sets: 3, reps: 12, loadKg: 35, restTime: "60s" }
        ]
      },
      {
        splitName: "Treino B",
        sortOrder: 1,
        exercises: [
          { name: "Supino Reto com Halteres", sets: 4, reps: 10, loadKg: 14, restTime: "75s" },
          { name: "Remada Baixa", sets: 4, reps: 12, loadKg: 35, restTime: "75s" },
          { name: "Desenvolvimento Máquina", sets: 3, reps: 10, loadKg: 22, restTime: "60s" }
        ]
      },
      {
        splitName: "Treino C",
        sortOrder: 2,
        exercises: [
          { name: "Stiff com Barra", sets: 4, reps: 10, loadKg: 40, restTime: "90s" },
          { name: "Mesa Flexora", sets: 4, reps: 12, loadKg: 30, restTime: "60s" },
          { name: "Elevação Pélvica", sets: 4, reps: 10, loadKg: 70, restTime: "90s" }
        ]
      }
    ]
  });

  await criarPlanoCompleto({
    studentId: alunoRafael.id,
    trainerId: professorBruno.id,
    planName: "Força e Condicionamento",
    trainingDays: diasPorIndice([0, 2, 4]),
    splits: [
      {
        splitName: "Treino A",
        sortOrder: 0,
        exercises: [
          { name: "Levantamento Terra", sets: 5, reps: 5, loadKg: 100, restTime: "120s" },
          { name: "Barra Fixa", sets: 4, reps: 8, loadKg: 0, restTime: "90s" },
          { name: "Prancha", sets: 3, reps: 45, loadKg: 0, restTime: "45s" }
        ]
      },
      {
        splitName: "Treino B",
        sortOrder: 1,
        exercises: [
          { name: "Supino Reto", sets: 5, reps: 5, loadKg: 80, restTime: "120s" },
          { name: "Remada Curvada", sets: 4, reps: 8, loadKg: 60, restTime: "90s" },
          { name: "Afundo com Halteres", sets: 3, reps: 10, loadKg: 20, restTime: "75s" }
        ]
      }
    ]
  });

  await criarPlanoCompleto({
    studentId: alunaMarina.id,
    trainerId: professoraLarissa.id,
    planName: "Recomposição Corporal",
    trainingDays: diasPorIndice([1, 3, 5, 6]),
    splits: [
      {
        splitName: "Treino A",
        sortOrder: 0,
        exercises: [
          { name: "Puxada Frente", sets: 4, reps: 12, loadKg: 32, restTime: "60s" },
          { name: "Remada Unilateral", sets: 3, reps: 12, loadKg: 16, restTime: "60s" },
          { name: "Rosca Alternada", sets: 3, reps: 12, loadKg: 8, restTime: "45s" }
        ]
      }
    ]
  });

  const primeiroExercicioAna = planoAna.splits[0]?.exercises[0];
  const segundoExercicioAna = planoAna.splits[0]?.exercises[1];

  if (primeiroExercicioAna && segundoExercicioAna) {
    await prisma.workoutLog.createMany({
      data: [
        {
          studentId: alunaAna.id,
          exerciseId: primeiroExercicioAna.id,
          completedLoadKg: 40,
          date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 14)
        },
        {
          studentId: alunaAna.id,
          exerciseId: primeiroExercicioAna.id,
          completedLoadKg: 42.5,
          date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7)
        },
        {
          studentId: alunaAna.id,
          exerciseId: segundoExercicioAna.id,
          completedLoadKg: 115,
          date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7)
        }
      ]
    });
  }

  console.log(`✅ Seed concluído. Gerente criado: ${gerente.email}`);
}

main()
  .catch((error) => {
    console.error("❌ Erro ao executar seed:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });