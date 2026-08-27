"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";

const navigationDirectionKey = "apexfit-student-navigation-direction";
const navigationTargetKey = "apexfit-student-navigation-target";

export type StudentNavigationDirection = "forward" | "backward";

export function rememberStudentNavigation(target: string, direction: StudentNavigationDirection) {
  sessionStorage.setItem(navigationDirectionKey, direction);
  sessionStorage.setItem(navigationTargetKey, target);
}

type StudentPageTransitionProps = {
  children: React.ReactNode;
};

/** Desliza somente o conteúdo ao alternar entre as abas do aluno, preservando o menu fixo. */
export function StudentPageTransition({ children }: StudentPageTransitionProps) {
  const pathname = usePathname();
  const previousPathname = useRef(pathname);
  const [transition, setTransition] = useState<{ key: string; direction: StudentNavigationDirection } | null>(null);

  useEffect(() => {
    if (previousPathname.current === pathname) return;

    const target = sessionStorage.getItem(navigationTargetKey);
    const storedDirection = sessionStorage.getItem(navigationDirectionKey);
    const direction: StudentNavigationDirection = target === pathname && storedDirection === "backward" ? "backward" : "forward";

    sessionStorage.removeItem(navigationTargetKey);
    sessionStorage.removeItem(navigationDirectionKey);
    previousPathname.current = pathname;
    setTransition({ key: pathname, direction });
  }, [pathname]);

  return (
    <div key={transition?.key ?? "initial"} className={transition ? `student-screen-slide-${transition.direction}` : undefined}>
      {children}
    </div>
  );
}
