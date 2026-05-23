import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Não autenticado" }, { status: 401 });
  }

  const subscription = await request.json() as { endpoint: string };

  await prisma.pushSubscription.upsert({
    where: {
      userId_endpoint: {
        userId: session.user.id,
        endpoint: subscription.endpoint
      }
    },
    create: {
      userId:       session.user.id,
      endpoint:     subscription.endpoint,
      subscription: subscription
    },
    update: {
      subscription: subscription
    }
  });

  return NextResponse.json({ ok: true });
}

export async function DELETE(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Não autenticado" }, { status: 401 });
  }

  const { endpoint } = await request.json() as { endpoint: string };

  await prisma.pushSubscription.deleteMany({
    where: { userId: session.user.id, endpoint }
  });

  return NextResponse.json({ ok: true });
}
