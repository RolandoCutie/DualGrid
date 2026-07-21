'use client';

import { useState } from 'react';

interface QuestionnaireExportData {
  answers: Record<string, unknown>;
  recommendedPlan: string;
  score?: Record<string, number>;
  status: string;
  createdAt?: string;
}

interface Props {
  questionnaire: QuestionnaireExportData;
  clientName: string;
  planName: string;
  questionnaireId: string;
}

function buildMarkdown(q: QuestionnaireExportData, planName: string, clientName: string): string {
  const a = q.answers;
  const str = (v: unknown) => (v ? String(v) : '—');
  const arr = (v: unknown) => (Array.isArray(v) ? (v as string[]).join(', ') : str(v));
  const bool = (v: unknown) => (v ? 'Sí' : 'No');

  const lines = [
    `# Cuestionario Web — ${clientName}`,
    `**Plan recomendado:** ${planName}`,
    `**Estado:** ${q.status}`,
    `**Fecha:** ${q.createdAt ? new Date(q.createdAt).toLocaleDateString('es-ES') : '—'}`,
    '',
    '## Datos de contacto',
    `- **Nombre:** ${str(a.fullName)}`,
    `- **Negocio:** ${str(a.businessName)}`,
    `- **Email:** ${str(a.email)}`,
    `- **Teléfono:** ${str(a.phone)}`,
    `- **¿Cómo nos encontró?** ${str(a.referralSource)}`,
    '',
    '## Negocio',
    `- **Tipo:** ${str(a.businessType)}`,
    `- **Antigüedad:** ${str(a.businessAge)}`,
    `- **Descripción:** ${str(a.businessDescription)}`,
    `- **Servicios:** ${str(a.mainServices)}`,
    `- **Público objetivo:** ${str(a.targetAudience)}`,
    `- **Presencia online:** ${str(a.onlinePresence)}`,
    '',
    '## Objetivos',
    `- **Objetivo(s):** ${arr(a.primaryGoal)}`,
    `- **Acción principal:** ${arr(a.primaryAction)}`,
    `- **Páginas deseadas:** ${arr(a.desiredPages)}`,
    `- **Funcionalidades:** ${arr(a.specialFeatures)}`,
    `- **Diferenciación:** ${str(a.differentiation)}`,
    `- **Definición de éxito:** ${str(a.successDefinition)}`,
    '',
    '## Presupuesto y Plazos',
    `- **Presupuesto:** ${str(a.budget)}`,
    `- **Plazo:** ${str(a.deadline)}`,
    `- **¿Tiene dominio?** ${bool(a.hasDomain)}`,
    `- **¿Necesita CMS?** ${str(a.needsCMS)}`,
    '',
    '## Estilo Visual y Marca',
    `- **Estilo visual:** ${arr(a.visualStyle)}`,
    `- **Sensación deseada:** ${str(a.visualFeeling)}`,
    `- **Esencia de marca:** ${str(a.brandEssence)}`,
    `- **Valores de marca:** ${str(a.brandValues)}`,
    `- **Lo que NO quiere:** ${str(a.brandNoDos)}`,
    `- **¿Tiene logo?** ${bool(a.hasLogo)}`,
    `- **Colores de marca:** ${str(a.brandColors)}`,
    `- **Referencia de sitios:** ${str(a.referenceWebsites)}`,
    '',
    '## Contenido',
    `- **¿Tiene fotos?** ${bool(a.hasPhotos)}`,
    `- **¿Tiene textos?** ${bool(a.hasTexts)}`,
    `- **Contenido disponible:** ${str(a.clientContentDeadline)}`,
    `- **Redes sociales:** ${str(a.socialMedia)}`,
    `- **Idioma(s) del sitio:** ${str(a.siteLanguages)}`,
    '',
    '## Notas Adicionales',
    `${str(a.concerns) !== '—' ? `**Preocupaciones:** ${str(a.concerns)}` : ''}`,
    `${str(a.extraNotes) !== '—' ? `**Notas extra:** ${str(a.extraNotes)}` : ''}`,
  ];

  return lines.join('\n');
}

function buildTxt(q: QuestionnaireExportData, planName: string, clientName: string): string {
  return buildMarkdown(q, planName, clientName)
    .replace(/\*\*/g, '')
    .replace(/^#+\s/gm, '=== ')
    .replace(/^-\s/gm, '  • ');
}

export default function QuestionnaireExportButtons({
  questionnaire,
  clientName,
  planName,
  questionnaireId,
}: Props) {
  const [copied, setCopied] = useState(false);

  const download = (content: string, ext: string, mime: string) => {
    const blob = new Blob([content], { type: mime });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `DualGrid_Cuestionario_${clientName.replace(/\s+/g, '_')}.${ext}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleCopyClipboard = async () => {
    const md = buildMarkdown(questionnaire, planName, clientName);
    try {
      await navigator.clipboard.writeText(md);
    } catch {
      const ta = document.createElement('textarea');
      ta.value = md;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const exportJSON = () => {
    const data = JSON.stringify(
      {
        clientName,
        planName,
        status: questionnaire.status,
        createdAt: questionnaire.createdAt,
        answers: questionnaire.answers,
        score: questionnaire.score,
      },
      null,
      2,
    );
    download(data, 'json', 'application/json');
  };

  const exportMarkdown = () => {
    download(buildMarkdown(questionnaire, planName, clientName), 'md', 'text/markdown');
  };

  const exportTxt = () => {
    download(buildTxt(questionnaire, planName, clientName), 'txt', 'text/plain');
  };

  const buttonClass =
    'inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg border border-border text-muted-foreground bg-card hover:bg-muted hover:text-card-foreground transition-colors';

  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="text-xs text-muted-foreground">Exportar:</span>
      <a href={`/api/questionnaires/${questionnaireId}/pdf`} className={buttonClass}>
        📄 PDF
      </a>
      <button type="button" onClick={exportMarkdown} className={buttonClass}>
        📝 Markdown
      </button>
      <button type="button" onClick={exportTxt} className={buttonClass}>
        📃 TXT
      </button>
      <button type="button" onClick={exportJSON} className={buttonClass}>
        {'{ }'} JSON
      </button>
      <button type="button" onClick={handleCopyClipboard} className={buttonClass}>
        {copied ? '✅ Copiado' : '📋 Copiar'}
      </button>
    </div>
  );
}
