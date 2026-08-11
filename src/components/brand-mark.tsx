import { Dumbbell } from "lucide-react";

export function BrandMark({ compact = false }: { compact?: boolean }) {
  return (
    <div className={`flex items-center ${compact ? "gap-2.5" : "flex-col gap-3"}`}>
      <span className={`flex items-center justify-center rounded-2xl bg-[#0d2342] ${compact ? "h-10 w-10" : "h-12 w-12"}`}>
        <Dumbbell className={`${compact ? "h-5 w-5" : "h-7 w-7"} -rotate-45 text-white`} strokeWidth={2.4} aria-hidden="true" />
      </span>
      <p className={`${compact ? "text-lg" : "text-xl"} font-black tracking-tight text-[#0d2342]`}>ApexFit</p>
    </div>
  );
}
