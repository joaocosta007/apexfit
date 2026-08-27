"use client";

import { Dumbbell, Minus, Plus } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger
} from "@/components/ui/drawer";

export function PhaseOneDemo() {
  return (
    <main className="mx-auto min-h-screen w-full max-w-lg bg-apex-background px-5 py-8">
      <div className="mb-7">
        <span className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-apex-navy text-white shadow-card">
          <Dumbbell className="h-6 w-6" aria-hidden="true" />
        </span>
        <p className="text-sm font-bold text-apex-blue">ApexFit Design System</p>
        <h1 className="mt-1 text-3xl font-black tracking-tight text-apex-ink">Componentes mobile</h1>
        <p className="mt-2 text-sm leading-6 text-apex-muted">Validação interna da fundamentação visual. Esta página não aparece em produção.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Ajuste rápido de carga</CardTitle>
          <CardDescription>Abra o painel inferior para conferir área de toque, hierarquia e fechamento.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <Drawer>
            <DrawerTrigger asChild>
              <Button className="w-full">Abrir painel inferior</Button>
            </DrawerTrigger>
            <DrawerContent>
              <DrawerHeader>
                <DrawerTitle>Ajustar carga</DrawerTitle>
                <DrawerDescription>Supino reto com barra · Série 2 de 4</DrawerDescription>
              </DrawerHeader>

              <div className="overflow-y-auto px-6 pb-6">
                <div className="soft-surface flex items-center justify-between p-4">
                  <Button variant="outline" size="icon" aria-label="Diminuir carga">
                    <Minus className="h-5 w-5" />
                  </Button>
                  <div className="text-center">
                    <strong className="block text-4xl font-black tracking-tight text-apex-ink">72,5</strong>
                    <span className="text-sm font-semibold text-apex-muted">quilogramas</span>
                  </div>
                  <Button variant="outline" size="icon" aria-label="Aumentar carga">
                    <Plus className="h-5 w-5" />
                  </Button>
                </div>
              </div>

              <DrawerFooter>
                <DrawerClose asChild>
                  <Button
                    onClick={() => toast.success("Carga atualizada", { description: "72,5 kg registrados na série atual." })}
                  >
                    Salvar carga
                  </Button>
                </DrawerClose>
                <DrawerClose asChild>
                  <Button variant="ghost">Cancelar</Button>
                </DrawerClose>
              </DrawerFooter>
            </DrawerContent>
          </Drawer>

          <Button
            variant="outline"
            className="w-full"
            onClick={() => toast.success("Treino salvo", { description: "Suas alterações foram registradas com sucesso." })}
          >
            Testar notificação
          </Button>
        </CardContent>
      </Card>
    </main>
  );
}
