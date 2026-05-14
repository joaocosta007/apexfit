import Image from "next/image";
import { cn } from "@/lib/utils";
import unaspLogo from "../../unasp-logo.png";

type UnaspLogoProps = {
  className?: string;
  priority?: boolean;
};

export function UnaspLogo({ className, priority = false }: UnaspLogoProps) {
  return (
    <Image
      src={unaspLogo}
      alt="Logo UNASP"
      width={220}
      height={88}
      priority={priority}
      className={cn("h-auto w-auto object-contain", className)}
    />
  );
}