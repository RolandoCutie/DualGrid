'use client';

import { cn } from '@/lib/utils';
import type { BusinessType, QuestionnaireAnswers } from '@/types';

interface Step2Props {
  answers: QuestionnaireAnswers;
  onChange: (partial: Partial<QuestionnaireAnswers>) => void;
}

const BUSINESS_TYPES: Array<{ id: BusinessType; label: string; icon: string; desc: string }> = [
  {
    id: 'creative',
    label: 'Artista / Creativo',
    icon: '🎨',
    desc: 'Fotógrafo, ilustrador, tatuador, diseñador...',
  },
  {
    id: 'restaurant',
    label: 'Restaurante / Bar',
    icon: '🍽️',
    desc: 'Cafetería, food truck, bar, coctelería...',
  },
  {
    id: 'entrepreneur',
    label: 'Emprendedor',
    icon: '🚀',
    desc: 'Freelancer, consultor, coach, servicio...',
  },
  {
    id: 'professional',
    label: 'Profesional',
    icon: '💼',
    desc: 'Médico, abogado, arquitecto, contador...',
  },
  {
    id: 'ecommerce',
    label: 'Tienda / E-commerce',
    icon: '🛍️',
    desc: 'Vendo productos físicos o digitales.',
  },
  { id: 'other', label: 'Otro', icon: '✨', desc: 'Mi negocio es diferente.' },
];

const ONLINE_PRESENCE: Array<{ id: string; label: string; desc: string }> = [
  { id: 'none', label: 'Sin presencia', desc: 'No tengo nada en internet' },
  { id: 'social_only', label: 'Solo redes sociales', desc: 'Instagram, Facebook, TikTok...' },
  { id: 'has_website', label: 'Tengo un sitio web', desc: 'Pero necesito uno nuevo o mejorarlo' },
];

export default function Step2Business({ answers, onChange }: Step2Props) {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-xl font-bold text-card-foreground">Tu tipo de negocio</h3>
        <p className="text-sm text-muted-foreground mt-1">Selecciona el que mejor te describe.</p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {BUSINESS_TYPES.map((bt) => (
          <button
            key={bt.id}
            type="button"
            onClick={() => onChange({ businessType: bt.id })}
            className={cn(
              'flex flex-col items-start p-4 rounded-xl border-2 text-left transition-all duration-200 cursor-pointer',
              answers.businessType === bt.id
                ? 'border-primary bg-primary/5'
                : 'border-border hover:border-primary/50 hover:bg-muted/50',
            )}
          >
            <span className="text-2xl mb-2">{bt.icon}</span>
            <span className="text-sm font-semibold text-card-foreground">{bt.label}</span>
            <span className="text-xs text-muted-foreground mt-0.5 leading-snug">{bt.desc}</span>
          </button>
        ))}
      </div>

      <div>
        <p className="text-sm font-medium text-card-foreground mb-3">
          ¿Tienes presencia en línea actualmente?
        </p>
        <div className="flex flex-col sm:flex-row gap-3">
          {ONLINE_PRESENCE.map((op) => (
            <button
              key={op.id}
              type="button"
              onClick={() =>
                onChange({ onlinePresence: op.id as QuestionnaireAnswers['onlinePresence'] })
              }
              className={cn(
                'flex-1 flex flex-col items-start p-3 rounded-xl border-2 text-left transition-all duration-200 cursor-pointer',
                answers.onlinePresence === op.id
                  ? 'border-primary bg-primary/5'
                  : 'border-border hover:border-primary/50',
              )}
            >
              <span className="text-sm font-semibold text-card-foreground">{op.label}</span>
              <span className="text-xs text-muted-foreground">{op.desc}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
