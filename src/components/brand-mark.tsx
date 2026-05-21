import Image from "next/image";

export function BrandMark() {
  return (
    <div className="flex items-center gap-3">
      <Image src="/unasp-logo.png" alt="Logo UNASP" width={112} height={40} className="object-contain" />
      <div>
        <p className="text-lg font-black tracking-[0.16em] text-primary">APEXFIT</p>
        <p className="text-xs font-medium text-slate-600">Gestão inteligente de treinos</p>
      </div>
    </div>
  );
}