export default function AuroraBackground() {
  return (
    <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none" aria-hidden="true">
      {/* Cyan glow — top, drifting */}
      <div
        className="absolute left-0 right-0"
        style={{ top: '-14%', height: '58vh' }}
      >
        <div
          className="aurora-blob mx-auto"
          style={{
            width: 'min(1100px, 92vw)',
            height: '100%',
            background:
              'radial-gradient(ellipse at center, rgba(0,217,255,0.17) 0%, transparent 65%)',
            animationDuration: '34s',
          }}
        />
      </div>

      {/* Green glow — bottom right, drifting */}
      <div
        className="absolute right-[-10%]"
        style={{ bottom: '-16%', width: 'min(900px, 82vw)', height: '52vh' }}
      >
        <div
          className="aurora-blob"
          style={{
            width: '100%',
            height: '100%',
            background:
              'radial-gradient(ellipse at center, rgba(0,255,157,0.15) 0%, transparent 65%)',
            animationDuration: '44s',
            animationDelay: '-14s',
          }}
        />
      </div>

      {/* Purple glow — mid left, drifting */}
      <div
        className="absolute left-[-12%]"
        style={{ top: '34%', width: 'min(720px, 74vw)', height: '46vh' }}
      >
        <div
          className="aurora-blob"
          style={{
            width: '100%',
            height: '100%',
            background:
              'radial-gradient(ellipse at center, rgba(165,148,249,0.13) 0%, transparent 65%)',
            animationDuration: '40s',
            animationDelay: '-22s',
          }}
        />
      </div>

      {/* Global blueprint grid — fades at edges */}
      <div
        className="absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage:
            'linear-gradient(var(--color-card-foreground) 1px, transparent 1px), linear-gradient(90deg, var(--color-card-foreground) 1px, transparent 1px)',
          backgroundSize: '56px 56px',
          maskImage:
            'radial-gradient(ellipse 120% 90% at 50% 40%, black 40%, transparent 82%)',
        }}
      />
    </div>
  );
}
