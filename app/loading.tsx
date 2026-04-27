import Image from 'next/image';

export default function Loading() {
  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center px-4">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 rounded-full bg-primary/10 opacity-50 blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 rounded-full bg-primary/10 opacity-40 blur-3xl" />
      </div>

      <div className="relative z-10 flex flex-col items-center gap-6">
        <div className="relative w-20 h-20">
          <div className="absolute inset-0 rounded-full border-4 border-primary/20" />
          <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-primary animate-spin" />

          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-3 h-3 rounded-full bg-primary animate-pulse" />
          </div>
        </div>



        <div className="mt-6 grid grid-cols-3  gap-4 w-full max-w-2xl opacity-40">
          {[1, 2, 3,].map((i) => (
            <div
              key={i}
              className="bg-card rounded-2xl border border-border shadow-sm overflow-hidden animate-pulse"
              style={{ animationDelay: `${i * 150}ms` }}
            >
              <div className="h-28 bg-gradient-to-br from-surface to-surface-modal" />
              <div className="p-3 flex flex-col gap-2">
                <div className="h-3 bg-surface-modal rounded-full w-3/4" />
                <div className="h-3 bg-surface rounded-full w-1/2" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
