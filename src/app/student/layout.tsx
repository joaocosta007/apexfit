import { StudentBottomNavRota } from "@/components/student-bottom-nav";

/**
 * Layout das telas do aluno. A barra inferior mora aqui (e não em cada página)
 * para continuar montada entre as abas: assim a lente desliza de verdade e a
 * troca de tela não "pisca" a barra.
 */
export default function StudentLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <StudentBottomNavRota />
    </>
  );
}
