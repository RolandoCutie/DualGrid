'use client';

import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { cn } from '@/lib/utils';
import type { QuestionnaireAnswers, VisualStyle } from '@/types';

interface Step5Props {
  answers: QuestionnaireAnswers;
  onChange: (partial: Partial<QuestionnaireAnswers>) => void;
}

const STYLES: Array<{ id: VisualStyle; label: string; desc: string }> = [
  { id: 'minimal', label: 'Minimalista', desc: 'Limpio, espaciado, simple' },
  { id: 'modern', label: 'Moderno', desc: 'Actual, tecnológico' },
  { id: 'elegant', label: 'Elegante', desc: 'Sofisticado, premium' },
  { id: 'colorful', label: 'Colorido', desc: 'Vibrante, llamativo' },
  { id: 'rustic', label: 'Rústico', desc: 'Artesanal, natural' },
  { id: 'corporate', label: 'Corporativo', desc: 'Profesional, serio' },
  { id: 'creative', label: 'Creativo', desc: 'Artístico, único' },
  { id: 'vintage', label: 'Vintage', desc: 'Retro, nostálgico' },
  { id: 'fun', label: 'Divertido', desc: 'Juvenil, dinámico' },
];

export default function Step5Style({ answers, onChange }: Step5Props) {
  const toggleStyle = (id: VisualStyle) => {
    const current = answers.visualStyle;
    if (current.includes(id)) {
      onChange({ visualStyle: current.filter((s) => s !== id) });
    } else if (current.length < 3) {
      onChange({ visualStyle: [...current, id] });
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-xl font-bold text-card-foreground">Estilo visual</h3>
        <p className="text-sm text-muted-foreground mt-1">
          Selecciona hasta 3 estilos que representen tu marca.
        </p>
      </div>

      <div className="grid grid-cols-3 gap-2">
        {STYLES.map((s) => {
          const selected = answers.visualStyle.includes(s.id);
          const maxReached = answers.visualStyle.length >= 3;
          return (
            <button
              key={s.id}
              type="button"
              onClick={() => toggleStyle(s.id)}
              disabled={!selected && maxReached}
              className={cn(
                'flex flex-col items-start p-3 rounded-xl border-2 text-left transition-all duration-200 cursor-pointer',
                selected ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50',
                !selected && maxReached && 'opacity-40 cursor-not-allowed',
              )}
            >
              <span className="text-sm font-semibold text-card-foreground">{s.label}</span>
              <span className="text-xs text-muted-foreground">{s.desc}</span>
            </button>
          );
        })}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="flex flex-col gap-2">
          <p className="text-sm font-medium text-card-foreground">¿Tienes logo?</p>
          <div className="flex gap-3">
            {['Sí', 'No'].map((opt, i) => (
              <button
                key={opt}
                type="button"
                onClick={() => onChange({ hasLogo: i === 0 })}
                className={cn(
                  'flex-1 py-2 rounded-xl border-2 text-sm font-medium transition-all cursor-pointer',
                  answers.hasLogo === (i === 0)
                    ? 'border-primary bg-primary/5 text-primary'
                    : 'border-border text-card-foreground hover:border-primary/50',
                )}
              >
                {opt}
              </button>
            ))}
          </div>
        </div>
        <Input
          label="Colores de marca (opcional)"
          placeholder="Ej: azul marino, dorado..."
          value={answers.brandColors}
          onChange={(e) => onChange({ brandColors: e.target.value })}
        />
      </div>

      <Textarea
        label="Sitios web que te gusten (referencias)"
        placeholder="Comparte 1-3 URLs de sitios que admires..."
        value={answers.referenceWebsites}
        onChange={(e) => onChange({ referenceWebsites: e.target.value })}
        rows={2}
      />
    </div>
  );
}
