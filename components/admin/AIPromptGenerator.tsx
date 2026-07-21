'use client';

import { Button } from '@/components/ui/Button';
import { useState } from 'react';

interface QuestionnaireData {
  answers: Record<string, unknown>;
  recommendedPlan: string;
  score?: Record<string, number>;
}

interface Props {
  questionnaire: QuestionnaireData;
  planName: string;
}

function generateSuperPrompt(q: QuestionnaireData, planName: string): string {
  const a = q.answers as Record<string, string | string[] | boolean | undefined>;

  const arr = (val: unknown): string => {
    if (!val) return '';
    if (Array.isArray(val)) return (val as string[]).join(', ');
    return String(val);
  };
  const str = (val: unknown): string => (val ? String(val) : '');
  const bool = (val: unknown): string => (val ? 'Sí' : 'No');

  const lines: string[] = [];

  lines.push(`# SUPER PROMPT — Sitio Web para ${str(a.businessName) || str(a.fullName)}`);
  lines.push(`## Generado por DualGrid Studio`);
  lines.push('');
  lines.push('Eres un experto desarrollador web y diseñador UX/UI. Necesito que me ayudes a crear');
  lines.push(`un sitio web profesional de tipo "${planName}" para el siguiente cliente.`);
  lines.push('Analiza toda la información a continuación y genera:');
  lines.push('1. Estructura completa del sitio (secciones y páginas)');
  lines.push('2. Propuesta de textos para cada sección (hero, servicios, about, CTA)');
  lines.push('3. Recomendaciones de diseño visual específicas');
  lines.push('4. Estrategia de SEO con palabras clave sugeridas');
  lines.push('5. Llamados a la acción optimizados para su objetivo principal');
  lines.push('');
  lines.push('---');
  lines.push('');
  lines.push('## 1. INFORMACIÓN DEL CLIENTE');
  lines.push('');
  if (a.fullName) lines.push(`**Nombre del contacto:** ${str(a.fullName)}`);
  if (a.businessName) lines.push(`**Nombre del negocio:** ${str(a.businessName)}`);
  if (a.businessType) lines.push(`**Tipo de negocio:** ${str(a.businessType)}`);
  if (a.businessAge) lines.push(`**Tiempo en el mercado:** ${str(a.businessAge)}`);
  if (a.businessDescription)
    lines.push(`**Descripción del negocio:** ${str(a.businessDescription)}`);
  if (a.mainServices) lines.push(`**Servicios / productos principales:** ${str(a.mainServices)}`);
  if (a.onlinePresence) lines.push(`**Presencia online actual:** ${str(a.onlinePresence)}`);
  lines.push('');

  lines.push('## 2. PÚBLICO OBJETIVO');
  lines.push('');
  if (a.targetAudience) lines.push(`**Audiencia objetivo:** ${str(a.targetAudience)}`);
  if (a.differentiation)
    lines.push(`**Ventaja competitiva / diferenciación:** ${str(a.differentiation)}`);
  lines.push('');

  lines.push('## 3. OBJETIVOS DEL SITIO WEB');
  lines.push('');
  if (a.primaryGoal) lines.push(`**Objetivo(s) principal(es):** ${arr(a.primaryGoal)}`);
  if (a.primaryAction) lines.push(`**Acción deseada del visitante:** ${arr(a.primaryAction)}`);
  if (a.desiredPages) lines.push(`**Páginas solicitadas:** ${arr(a.desiredPages)}`);
  if (a.specialFeatures) lines.push(`**Funcionalidades especiales:** ${arr(a.specialFeatures)}`);
  if (a.successDefinition)
    lines.push(`**¿Cómo define el éxito del proyecto?** ${str(a.successDefinition)}`);
  lines.push('');

  lines.push('## 4. IDENTIDAD VISUAL Y MARCA');
  lines.push('');
  if (a.visualStyle) lines.push(`**Estilo visual preferido:** ${arr(a.visualStyle)}`);
  if (a.visualFeeling) lines.push(`**Sensación que debe transmitir:** ${str(a.visualFeeling)}`);
  if (a.brandEssence) lines.push(`**Esencia de la marca en 3 palabras:** ${str(a.brandEssence)}`);
  if (a.brandValues) lines.push(`**Valores / emociones de marca:** ${str(a.brandValues)}`);
  if (a.brandNoDos) lines.push(`**Lo que DEFINITIVAMENTE NO quiere:** ${str(a.brandNoDos)}`);
  if (a.brandColors) lines.push(`**Colores de marca actuales:** ${str(a.brandColors)}`);
  lines.push(`**¿Tiene logo?** ${bool(a.hasLogo)}`);
  if (a.referenceWebsites)
    lines.push(`**Sitios de referencia / inspiración:** ${str(a.referenceWebsites)}`);
  if (a.logoWords) lines.push(`**Palabras que debe llevar el logo:** ${str(a.logoWords)}`);
  if (a.logoInspiration) lines.push(`**Logos / marcas de inspiración:** ${str(a.logoInspiration)}`);
  if (a.logoSpecificElements)
    lines.push(`**Elementos específicos para el logo:** ${str(a.logoSpecificElements)}`);
  if (a.priorBrandPresence) lines.push(`**Identidad visual previa:** ${str(a.priorBrandPresence)}`);
  lines.push('');

  lines.push('## 5. CONTENIDO DISPONIBLE');
  lines.push('');
  lines.push(`**¿Tiene fotos profesionales?** ${bool(a.hasPhotos)}`);
  lines.push(`**¿Tiene textos redactados?** ${bool(a.hasTexts)}`);
  if (a.clientContentDeadline)
    lines.push(`**Contenido disponible y cuándo:** ${str(a.clientContentDeadline)}`);
  if (a.socialMedia) lines.push(`**Redes sociales activas:** ${str(a.socialMedia)}`);
  lines.push('');

  lines.push('## 6. PRESUPUESTO Y TIMELINE');
  lines.push('');
  if (a.budget) lines.push(`**Presupuesto:** ${str(a.budget)}`);
  if (a.deadline) lines.push(`**Plazo deseado:** ${str(a.deadline)}`);
  lines.push(`**¿Tiene dominio propio?** ${bool(a.hasDomain)}`);
  if (a.needsCMS) lines.push(`**¿Necesita editar el sitio por su cuenta?** ${str(a.needsCMS)}`);
  if (a.siteLanguages) lines.push(`**Idioma(s) del sitio:** ${str(a.siteLanguages)}`);
  lines.push('');

  lines.push('## 7. PLAN RECOMENDADO');
  lines.push('');
  lines.push(`**Plan:** ${planName}`);
  if (q.score) {
    const sorted = Object.entries(q.score)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 3);
    if (sorted.length) {
      lines.push(`**Puntuaciones (top 3):** ${sorted.map(([k, v]) => `${k}: ${v}`).join(' | ')}`);
    }
  }
  lines.push('');

  if (a.concerns) {
    lines.push('## 8. PREOCUPACIONES / DUDAS DEL CLIENTE');
    lines.push('');
    lines.push(str(a.concerns));
    lines.push('');
  }

  if (a.extraNotes) {
    lines.push('## 9. NOTAS ADICIONALES');
    lines.push('');
    lines.push(str(a.extraNotes));
    lines.push('');
  }

  lines.push('---');
  lines.push('');
  lines.push('## INSTRUCCIONES PARA LA IA');
  lines.push('');
  lines.push('Con base en toda la información anterior, por favor:');
  lines.push('');
  lines.push('1. **Estructura el sitio:** Define qué secciones tendrá cada página.');
  lines.push(
    '2. **Redacta los textos:** Hero, subtítulo, sección de servicios, about, testimonios, CTA.',
  );
  lines.push('3. **Sugiere paleta de colores** (en hex) que comunique los valores de la marca.');
  lines.push('4. **Propón tipografías** (Google Fonts) adecuadas al estilo visual solicitado.');
  lines.push('5. **Crea 5-10 keywords SEO** principales para posicionar este negocio.');
  lines.push('6. **Define el tono de comunicación** (formal, casual, técnico, empático, etc.).');
  lines.push('7. **Sugiere el CTA principal** de cada sección.');
  lines.push('8. **Lista las imágenes** que se necesitarían para completar el sitio.');
  lines.push('');
  lines.push(
    'Genera un resultado organizado, profesional y listo para usar en el desarrollo del proyecto.',
  );

  return lines.join('\n');
}

export default function AIPromptGenerator({ questionnaire, planName }: Props) {
  const [copied, setCopied] = useState(false);
  const [showPrompt, setShowPrompt] = useState(false);

  const prompt = generateSuperPrompt(questionnaire, planName);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(prompt);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // fallback for older browsers
      const textarea = document.createElement('textarea');
      textarea.value = prompt;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const handleDownload = () => {
    const blob = new Blob([prompt], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `DualGrid_SuperPrompt_${Date.now()}.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="bg-card border border-[#a594f9]/20 rounded-xl p-6 space-y-4">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-[#a594f9]/10 border border-[#a594f9]/20 flex items-center justify-center">
          <svg
            className="w-5 h-5 text-[#a594f9]"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17H3a2 2 0 01-2-2V5a2 2 0 012-2h16a2 2 0 012 2v10a2 2 0 01-2 2h-2"
            />
          </svg>
        </div>
        <div>
          <h3 className="font-semibold text-card-foreground">Super Prompt para IA</h3>
          <p className="text-xs text-muted-foreground">
            Genera un prompt completo listo para ChatGPT u otra IA para crear el sitio web
          </p>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        <Button size="sm" onClick={handleCopy} className="gap-2">
          {copied ? (
            <>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
              ¡Copiado!
            </>
          ) : (
            <>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                />
              </svg>
              Copiar al portapapeles
            </>
          )}
        </Button>
        <Button size="sm" variant="outline" onClick={handleDownload} className="gap-2">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
            />
          </svg>
          Descargar .md
        </Button>
        <Button
          size="sm"
          variant="ghost"
          onClick={() => setShowPrompt((v) => !v)}
          className="gap-2"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d={showPrompt ? 'M19 9l-7 7-7-7' : 'M9 5l7 7-7 7'}
            />
          </svg>
          {showPrompt ? 'Ocultar' : 'Vista previa'}
        </Button>
      </div>

      {showPrompt && (
        <div className="mt-2 rounded-xl bg-muted/50 border border-border overflow-auto max-h-96 p-4">
          <pre className="text-xs text-muted-foreground whitespace-pre-wrap font-mono leading-relaxed">
            {prompt}
          </pre>
        </div>
      )}
    </div>
  );
}
