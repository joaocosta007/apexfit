import Image from "next/image";
import { cn } from "@/lib/utils";

type UnaspLogoProps = {
  className?: string;
  priority?: boolean;
};

export function UnaspLogo({ className, priority }: UnaspLogoProps) {
  return (
    <Image
      src="/cenape.png"
      alt="Logo CENAPE"
      width={256}
      height={96}
      priority={priority}
      className={cn("object-contain", className)}
    />
  );
}
