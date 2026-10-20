'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function AdminExitButton() {
  const router = useRouter();
  const [armed, setArmed] = useState(false);

  useEffect(() => {
    if (!armed) return;
    const timer = window.setTimeout(() => setArmed(false), 3200);
    return () => window.clearTimeout(timer);
  }, [armed]);

  const handleExit = () => {
    if (!armed) {
      setArmed(true);
      return;
    }
    router.push('/');
  };

  return (
    <div className="fixed top-4 right-4 z-50">
      <button
        onClick={handleExit}
        className="rounded-xl border px-4 py-2 text-sm font-semibold transition-all duration-200 shadow-lg cursor-pointer border-border bg-card text-card-foreground hover:border-primary/40 hover:text-primary"
        aria-live="polite"
      >
        {armed ? 'Pulsa otra vez para volver al sitio' : 'Volver al sitio'}
      </button>
    </div>
  );
}
