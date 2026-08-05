import LogoDualGrid from '@/components/ui/LogoDualGrid';
import BackHomeLink from '@/components/questionnaire/BackHomeLink';
import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Cuéntanos sobre tu proyecto | DualGrid',
  description:
    'Completa el formulario para que podamos entender tu proyecto y recomendarte el plan ideal.',
  robots: { index: false, follow: false },
};

export default function QuestionnaireLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Minimal top bar */}
      <header className="fixed top-0 left-0 right-0 z-40 bg-card/80 backdrop-blur-xl border-b border-border/60">
        <div className="max-w-4xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center" aria-label="DualGrid Studio">
            <LogoDualGrid width={130} />
          </Link>
          <BackHomeLink />
        </div>
      </header>

      <main className="flex-1 pt-16">{children}</main>
    </div>
  );
}
