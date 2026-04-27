'use client';

import { cn } from '@/lib/utils';
import type { BudgetRange, QuestionnaireAnswers } from '@/types';

interface Step4Props {
  answers: QuestionnaireAnswers;
  onChange: (partial: Partial<QuestionnaireAnswers>) => void;
}

const BUDGETS: Array<{ id: BudgetRange; label: string; range: string }> = [
  { id: 'under_150', label: 'Económico', range: 'Menos de $150 USD' },
  { id: '150_300', label: 'Básico', range: '$150 – $300 USD' },
  { id: '300_500', label: 'Estándar', range: '$300 – $500 USD' },
  { id: '500_800', label: 'Profesional', range: '$500 – $800 USD' },
  { id: '800_1500', label: 'Avanzado', range: '$800 – $1,500 USD' },
  { id: 'over_1500', label: 'Premium', range: 'Más de $1,500 USD' },
];

const DEADLINES: Array<{ id: string; label: string }> = [
  { id: 'urgent', label: 'Lo antes posible' },
  { id: '2_weeks', label: 'En 2 semanas' },
  { id: '1_month', label: 'En 1 mes' },
  { id: '2_3_months', label: 'En 2-3 meses' },
  { id: 'no_rush', label: 'Sin prisa' },
];

export default function Step4Budget({ answers, onChange }: Step4Props) {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-xl font-bold text-card-foreground">Presupuesto y plazos</h3>
        <p className="text-sm text-muted-foreground mt-1">
          Esto nos ayuda a ofrecerte la mejor solución.
        </p>
      </div>

      {/* Budget */}
      <div>
        <p className="text-sm font-medium text-card-foreground mb-3">
          Presupuesto aproximado <span className="text-destructive">*</span>
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {BUDGETS.map((b) => (
            <button
              key={b.id}
              type="button"
              onClick={() => onChange({ budget: b.id })}
              className={cn(
                'flex flex-col items-start p-3 rounded-xl border-2 text-left transition-all duration-200 cursor-pointer',
                answers.budget === b.id
                  ? 'border-primary bg-primary/5'
                  : 'border-border hover:border-primary/50',
              )}
            >
              <span className="text-sm font-semibold text-card-foreground">{b.label}</span>
              <span className="text-xs text-muted-foreground">{b.range}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Deadline */}
      <div>
        <p className="text-sm font-medium text-card-foreground mb-3">¿Para cuándo lo necesitas?</p>
        <div className="flex flex-wrap gap-2">
          {DEADLINES.map((d) => (
            <button
              key={d.id}
              type="button"
              onClick={() => onChange({ deadline: d.id })}
              className={cn(
                'px-4 py-2 rounded-full text-sm font-medium border-2 transition-all duration-200 cursor-pointer',
                answers.deadline === d.id
                  ? 'border-primary bg-primary text-primary-foreground'
                  : 'border-border text-card-foreground hover:border-primary/50',
              )}
            >
              {d.label}
            </button>
          ))}
        </div>
      </div>

      {/* Domain */}
      <div>
        <p className="text-sm font-medium text-card-foreground mb-3">
          ¿Ya tienes dominio (dirección web)?
        </p>
        <div className="flex gap-3">
          {['Sí, ya tengo', 'No, necesito uno'].map((opt, i) => (
            <button
              key={opt}
              type="button"
              onClick={() => onChange({ hasDomain: i === 0 })}
              className={cn(
                'flex-1 py-2.5 rounded-xl border-2 text-sm font-medium transition-all duration-200 cursor-pointer',
                answers.hasDomain === (i === 0)
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
  );
}
