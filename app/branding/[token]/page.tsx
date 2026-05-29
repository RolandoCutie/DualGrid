import BrandingWizard from '@/components/branding/BrandingWizard';
import BrandingQuestionnaire from '@/database/branding-questionnaire.model';
import connectDB from '@/lib/mongodb';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

export const metadata: Metadata = {
  title: 'Test de Identidad Visual | DualGrid Studio',
  description: 'Descubre el plan de branding ideal para tu proyecto en 4 preguntas.',
  robots: { index: false, follow: false },
};

interface Props {
  params: Promise<{ token: string }>;
}

export default async function BrandingPage({ params }: Props) {
  const { token } = await params;

  await connectDB();
  const doc = await BrandingQuestionnaire.findOne({ token }).lean();

  if (!doc) return notFound();

  if (doc.status === 'completed') {
    return (
      <div className="flex-1 flex items-center justify-center px-4 py-20 text-center">
        <div className="space-y-4 max-w-md">
          <div className="text-5xl">✅</div>
          <h1 className="text-2xl font-bold text-foreground">¡Ya completaste este cuestionario!</h1>
          <p className="text-muted-foreground">
            Tus respuestas han sido recibidas. DualGrid Studio se pondrá en contacto contigo pronto.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col">
      {/* Header intro */}
      <div className="text-center px-4 pt-8 pb-4 max-w-2xl mx-auto w-full">
        <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-2">
          🧭 Test de Identidad Visual
        </p>
        <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-2">
          Descubre tu Plan de Branding Ideal
        </h1>
        <p className="text-muted-foreground text-sm">
          Responde 4 preguntas rápidas y te diremos exactamente qué plan de identidad visual
          necesita tu negocio.
        </p>
      </div>

      <BrandingWizard token={token} />
    </div>
  );
}
