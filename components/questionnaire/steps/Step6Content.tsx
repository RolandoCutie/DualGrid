'use client';

import { Textarea } from '@/components/ui/Textarea';
import { cn } from '@/lib/utils';
import type { QuestionnaireAnswers } from '@/types';

interface Step6Props {
  answers: QuestionnaireAnswers;
  onChange: (partial: Partial<QuestionnaireAnswers>) => void;
}

export default function Step6Content({ answers, onChange }: Step6Props) {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-xl font-bold text-card-foreground">Contenido disponible</h3>
        <p className="text-sm text-muted-foreground mt-1">¿Qué materiales tienes listos?</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Photos */}
        <div>
          <p className="text-sm font-medium text-card-foreground mb-3">
            ¿Tienes fotos profesionales?
          </p>
          <div className="flex gap-3">
            {['Sí', 'No'].map((opt, i) => (
              <button
                key={opt}
                type="button"
                onClick={() => onChange({ hasPhotos: i === 0 })}
                className={cn(
                  'flex-1 py-2.5 rounded-xl border-2 text-sm font-medium transition-all cursor-pointer',
                  answers.hasPhotos === (i === 0)
                    ? 'border-primary bg-primary/5 text-primary'
                    : 'border-border text-card-foreground hover:border-primary/50',
                )}
              >
                {opt}
              </button>
            ))}
          </div>
        </div>

        {/* Texts */}
        <div>
          <p className="text-sm font-medium text-card-foreground mb-3">
            ¿Tienes textos redactados?
          </p>
          <div className="flex gap-3">
            {['Sí', 'No'].map((opt, i) => (
              <button
                key={opt}
                type="button"
                onClick={() => onChange({ hasTexts: i === 0 })}
                className={cn(
                  'flex-1 py-2.5 rounded-xl border-2 text-sm font-medium transition-all cursor-pointer',
                  answers.hasTexts === (i === 0)
                    ? 'border-primary bg-primary/5 text-primary'
                    : 'border-border text-card-foreground hover:border-primary/50',
                )}
              >
                {opt}
              </button>
            ))}
          </div>
        </div>
      </div>

      <Textarea
        label="¿Algo más que debamos saber?"
        placeholder="Cualquier detalle adicional sobre tu proyecto, plazos especiales, o preguntas que tengas..."
        value={answers.extraNotes}
        onChange={(e) => onChange({ extraNotes: e.target.value })}
        rows={4}
      />
    </div>
  );
}
