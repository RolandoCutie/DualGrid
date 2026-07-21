import PublicQuestionnairePageClient from '@/components/questionnaire/PublicQuestionnairePageClient';
import { getBaseUrl } from '@/lib/base-url';
import type { Metadata } from 'next';

const baseUrl = getBaseUrl();

export const metadata: Metadata = {
  title: 'Cuéntanos sobre tu proyecto',
  description:
    'Completa el formulario en 6 pasos para que podamos entender tu proyecto y recomendarte el plan ideal para tu sitio web.',
  alternates: { canonical: `${baseUrl}/questionnaire` },
  robots: { index: false, follow: false },
};

export default function QuestionnairePage() {
  return <PublicQuestionnairePageClient />;
}
