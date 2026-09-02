import ThemeProvider from '@/components/ui/ThemeProvider';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Test de Identidad Visual | DualGrid',
  description: 'Descubre qué nivel de identidad visual necesita tu marca en 4 preguntas.',
  robots: { index: false, follow: false },
};

export default function BrandingLayout({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <div className="min-h-screen bg-background text-foreground flex flex-col">
        {/* Minimal header */}
        <header className="w-full border-b border-border py-4 px-6 flex items-center justify-center">
          <span className="font-bold text-xl tracking-tight text-foreground">DualGrid</span>
        </header>
        <main className="flex-1 flex flex-col">{children}</main>
      </div>
    </ThemeProvider>
  );
}
