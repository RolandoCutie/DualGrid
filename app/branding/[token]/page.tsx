import BrandingPageContent from '@/components/branding/BrandingPageContent';
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
    return <BrandingPageContent completed />;
  }

  return (
    <div className="flex-1 flex flex-col">
      {/* Header intro */}
      <BrandingPageContent />

      <BrandingWizard token={token} />
    </div>
  );
}
