import { UnaspLogo } from "@/components/unasp-logo";

export function BrandMark() {
  return (
    <div className="flex items-center gap-3">
      <UnaspLogo className="max-h-10 max-w-28" />
      <div>
        <p className="text-lg font-black tracking-[0.16em] text-primary">APEXFIT</p>
        <p className="text-xs font-medium text-slate-600">Gestão inteligente de treinos</p>
      </div>
    </div>
  );
}