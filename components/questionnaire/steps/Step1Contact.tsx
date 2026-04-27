'use client';

import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import type { QuestionnaireAnswers } from '@/types';

interface Step1Props {
  answers: QuestionnaireAnswers;
  onChange: (partial: Partial<QuestionnaireAnswers>) => void;
}

export default function Step1Contact({ answers, onChange }: Step1Props) {
  return (
    <div className="space-y-5">
      <div>
        <h3 className="text-xl font-bold text-card-foreground">Cuéntanos sobre ti</h3>
        <p className="text-sm text-muted-foreground mt-1">
          Esta información nos ayuda a personalizar tu propuesta.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input
          label="Tu nombre completo"
          required
          placeholder="Ej: María García"
          value={answers.fullName}
          onChange={(e) => onChange({ fullName: e.target.value })}
        />
        <Input
          label="Nombre de tu negocio / marca"
          placeholder="Ej: Estudio Creativo XYZ"
          value={answers.businessName}
          onChange={(e) => onChange({ businessName: e.target.value })}
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input
          label="Email de contacto"
          type="email"
          required
          placeholder="tu@email.com"
          value={answers.email}
          onChange={(e) => onChange({ email: e.target.value })}
        />
        <Input
          label="WhatsApp / Teléfono"
          placeholder="+53 5 123 4567"
          value={answers.phone}
          onChange={(e) => onChange({ phone: e.target.value })}
        />
      </div>

      <Textarea
        label="Describe brevemente tu negocio"
        placeholder="¿Qué haces? ¿Qué vendes o qué servicio ofreces?"
        value={answers.businessDescription}
        onChange={(e) => onChange({ businessDescription: e.target.value })}
        rows={3}
      />
    </div>
  );
}
