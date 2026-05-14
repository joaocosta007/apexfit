import Link from "next/link";
import { Plus } from "lucide-react";

export function FAB({ href, label }: { href: string; label: string }) {
  return (
    <Link
      href={href}
      className="safe-bottom fixed bottom-5 right-5 z-30 inline-flex h-16 w-16 items-center justify-center rounded-full bg-primary text-white shadow-md transition-transform active:scale-95"
      aria-label={label}
      title={label}
    >
      <Plus className="h-8 w-8" />
      <span className="sr-only">{label}</span>
    </Link>
  );
}