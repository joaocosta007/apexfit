import { cn } from "@/lib/utils";

type UnaspLogoProps = {
  className?: string;
};

export function UnaspLogo({ className }: UnaspLogoProps) {
  return (
    <span
      aria-label="Logo CENAPE"
      className={cn(
        "inline-block whitespace-nowrap text-[44px] font-black uppercase leading-none tracking-[0.06em] text-primary",
        className,
      )}
    >
      CENAPE
    </span>
  );
}