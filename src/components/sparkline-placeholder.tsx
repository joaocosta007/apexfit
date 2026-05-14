export function SparklinePlaceholder() {
  return (
    <div className="relative h-20 overflow-hidden rounded-xl border border-blue-100 bg-blue-50">
      <svg viewBox="0 0 240 80" className="h-full w-full" role="img" aria-label="Gráfico de evolução física">
        <defs>
          <linearGradient id="sparkline" x1="0" x2="1" y1="0" y2="0">
            <stop offset="0%" stopColor="#002B5E" />
            <stop offset="100%" stopColor="#1E40AF" />
          </linearGradient>
        </defs>
        <path
          d="M8 64 C 34 58, 42 32, 68 40 S 102 68, 128 38 S 170 18, 198 26 S 224 40, 232 16"
          fill="none"
          stroke="url(#sparkline)"
          strokeLinecap="round"
          strokeWidth="5"
        />
        <path
          d="M8 64 C 34 58, 42 32, 68 40 S 102 68, 128 38 S 170 18, 198 26 S 224 40, 232 16 L 232 80 L 8 80 Z"
          fill="url(#sparkline)"
          opacity="0.12"
        />
      </svg>
      <div className="absolute bottom-2 left-3 text-[10px] font-bold uppercase tracking-[0.18em] text-primary">
        Evolução física
      </div>
    </div>
  );
}