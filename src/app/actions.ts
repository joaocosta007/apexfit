"use server";

import bcrypt from "bcryptjs";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { PlanType, Role } from "@prisma/client";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/session";
import { diasDaSemana } from "@/lib/utils";

const studentSchema = z.object({
  name: z.string().min(3, "Informe o nome completo."),
  email: z.string().email("Informe um e-mail válido."),
  password: z.string().min(6, "A senha deve ter pelo menos 6 caracteres.")
});

const trainerSchema = z.object({
  name: z.string().min(3, "Informe o nome completo."),
  email: z.string().email("Informe um e-mail válido."),
  password: z.string().min(6, "A senha deve ter pelo menos 6 caracteres.")
});

const exerciseSchema = z.object({
  name: z.string().min(2, "Informe o nome do exercício."),
  sets: z.coerce.number().int().min(1).max(20),
  reps: z.coerce.number().int().min(1).max(999),
  loadKg: z.coerce.number().min(0).max(1000),
  restTime: z.string().min(1, "Informe o descanso.")
});

function campoTexto(formData: FormData, campo: string) {
  const valor = formData.get(campo);
  return typeof valor === "string" ? valor.trim() : "";
}

function diasSelecionados(formData: FormData) {
  const indices = formData
    .getAll("dias")
    .map((dia) => Number(dia))
    .filter((dia) => Number.isInteger(dia) && dia >= 0 && dia <= 6);

  return Array.from(new Set(indices)).map((indice) => ({
    indice,
    letra: diasDaSemana[indice]?.label ?? "S",
    nome: diasDaSemana[indice]?.nome ?? "Segunda"
  }));
}

async function garantirAlunoDoProfessor(studentId: string, trainerId: string) {
  const relation = await prisma.studentTrainer.findUnique({
    where: {
      studentId_trainerId: {
        studentId,
        trainerId
      }
    }
  });

  if (!relation) {
    throw new Error("Aluno não vinculado a este professor.");
  }
}

export async function adicionarAlunoAction(formData: FormData) {
  const session = await requireRole(Role.TRAINER);

  const parsed = studentSchema.parse({
    name: campoTexto(formData, "name"),
    email: campoTexto(formData, "email").toLowerCase(),
    password: campoTexto(formData, "password")
  });

  const existingUser = await prisma.user.findUnique({
    where: { email: parsed.email }
  });

  if (existingUser && existingUser.role !== Role.STUDENT) {
    throw new Error("Este e-mail já pertence a um gerente ou professor.");
  }

  const passwordHash = await bcrypt.hash(parsed.password, 10);
  const student =
    existingUser ??
    (await prisma.user.create({
      data: {
        name: parsed.name,
        email: parsed.email,
        passwordHash,
        role: Role.STUDENT
      }
    }));

  if (existingUser) {
    await prisma.user.update({
      where: { id: existingUser.id },
      data: {
        name: parsed.name,
        passwordHash
      }
    });
  }

  await prisma.studentTrainer.createMany({
    data: [{ studentId: student.id, trainerId: session.user.id }],
    skipDuplicates: true
  });

  revalidatePath("/trainer");
  redirect(`/trainer/workouts/${student.id}`);
}

export async function adicionarProfessorAction(formData: FormData) {
  await requireRole(Role.MANAGER);

  const parsed = trainerSchema.parse({
    name: campoTexto(formData, "name"),
    email: campoTexto(formData, "email").toLowerCase(),
    password: campoTexto(formData, "password")
  });

  const existingUser = await prisma.user.findUnique({
    where: { email: parsed.email }
  });

  if (existingUser && existingUser.role !== Role.TRAINER) {
    throw new Error("Este e-mail já pertence a um gerente ou aluno.");
  }

  const passwordHash = await bcrypt.hash(parsed.password, 10);

  if (existingUser) {
    await prisma.user.update({
      where: { id: existingUser.id },
      data: {
        name: parsed.name,
        passwordHash,
        role: Role.TRAINER
      }
    });
  } else {
    await prisma.user.create({
      data: {
        name: parsed.name,
        email: parsed.email,
        passwordHash,
        role: Role.TRAINER
      }
    });
  }

  revalidatePath("/manager");
  redirect("/manager");
}

const planTypeValues: Record<string, PlanType> = {
  NORMAL: PlanType.NORMAL,
  LOW_VOLUME: PlanType.LOW_VOLUME,
  STRENGTH: PlanType.STRENGTH
};

export async function salvarPlanoTreinoAction(studentId: string, formData: FormData) {
  const session = await requireRole(Role.TRAINER);
  await garantirAlunoDoProfessor(studentId, session.user.id);

  const planName = campoTexto(formData, "planName") || "Plano de Treino";
  const trainingDays = diasSelecionados(formData);
  const planType = planTypeValues[campoTexto(formData, "planType")] ?? PlanType.NORMAL;

  const existingPlan = await prisma.workoutPlan.findFirst({
    where: {
      studentId,
      trainerId: session.user.id,
      isActive: true
    },
    include: {
      splits: true
    }
  });

  if (existingPlan) {
    await prisma.workoutPlan.update({
      where: { id: existingPlan.id },
      data: {
        planName,
        planType,
        trainingDays
      }
    });
  } else {
    await prisma.workoutPlan.create({
      data: {
        studentId,
        trainerId: session.user.id,
        planName,
        planType,
        trainingDays,
        splits: {
          create: ["Treino A", "Treino B", "Treino C"].map((splitName, sortOrder) => ({
            splitName,
            sortOrder
          }))
        }
      }
    });
  }

  revalidatePath("/trainer");
  revalidatePath(`/trainer/workouts/${studentId}`);
}

export async function adicionarDivisaoAction(planId: string, studentId: string) {
  const session = await requireRole(Role.TRAINER);

  const plan = await prisma.workoutPlan.findFirst({
    where: {
      id: planId,
      trainerId: session.user.id,
      studentId
    },
    include: {
      splits: {
        orderBy: { sortOrder: "asc" }
      }
    }
  });

  if (!plan) {
    throw new Error("Plano de treino não encontrado.");
  }

  const nextIndex = plan.splits.length;
  const nextLetter = String.fromCharCode(65 + nextIndex);

  await prisma.workoutSplit.create({
    data: {
      planId,
      splitName: `Treino ${nextLetter}`,
      sortOrder: nextIndex
    }
  });

  revalidatePath(`/trainer/workouts/${studentId}`);
}

export async function removerDivisaoAction(splitId: string, studentId: string) {
  const session = await requireRole(Role.TRAINER);

  const split = await prisma.workoutSplit.findFirst({
    where: {
      id: splitId,
      plan: {
        studentId,
        trainerId: session.user.id
      }
    }
  });

  if (!split) {
    throw new Error("Divisão não encontrada.");
  }

  if (split.sortOrder < 3) {
    throw new Error("Não é possível remover as divisões A, B e C.");
  }

  await prisma.workoutSplit.delete({
    where: { id: splitId }
  });

  revalidatePath(`/trainer/workouts/${studentId}`);
}

export async function adicionarExercicioAction(splitId: string, studentId: string, formData: FormData) {
  const session = await requireRole(Role.TRAINER);

  const split = await prisma.workoutSplit.findFirst({
    where: {
      id: splitId,
      plan: {
        studentId,
        trainerId: session.user.id
      }
    }
  });

  if (!split) {
    throw new Error("Divisão de treino não encontrada.");
  }

  const parsed = exerciseSchema.parse({
    name: campoTexto(formData, "name"),
    sets: campoTexto(formData, "sets"),
    reps: campoTexto(formData, "reps"),
    loadKg: campoTexto(formData, "loadKg"),
    restTime: campoTexto(formData, "restTime")
  });

  await prisma.exercise.create({
    data: {
      splitId,
      name: parsed.name,
      sets: parsed.sets,
      reps: parsed.reps,
      loadKg: parsed.loadKg,
      restTime: parsed.restTime
    }
  });

  revalidatePath(`/trainer/workouts/${studentId}`);
}

export async function removerExercicioAction(exerciseId: string, studentId: string) {
  const session = await requireRole(Role.TRAINER);

  const exercise = await prisma.exercise.findFirst({
    where: {
      id: exerciseId,
      split: {
        plan: {
          studentId,
          trainerId: session.user.id
        }
      }
    }
  });

  if (!exercise) {
    throw new Error("Exercício não encontrado.");
  }

  await prisma.exercise.delete({
    where: { id: exerciseId }
  });

  revalidatePath(`/trainer/workouts/${studentId}`);
}

export async function registrarTreinoAction(exerciseId: string, formData: FormData) {
  const session = await requireRole(Role.STUDENT);
  const completedLoadKg = z.coerce.number().min(0).max(1000).parse(campoTexto(formData, "completedLoadKg"));

  const exercise = await prisma.exercise.findFirst({
    where: {
      id: exerciseId,
      split: {
        plan: {
          studentId: session.user.id,
          isActive: true
        }
      }
    }
  });

  if (!exercise) {
    throw new Error("Exercício não encontrado para este aluno.");
  }

  await prisma.workoutLog.create({
    data: {
      studentId: session.user.id,
      exerciseId,
      completedLoadKg,
      completed: true
    }
  });

  revalidatePath("/student/workouts/today");
}