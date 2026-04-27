'use client';

import { cn } from '@/lib/utils';
import type { PrimaryGoal, QuestionnaireAnswers } from '@/types';

interface Step3Props {
  answers: QuestionnaireAnswers;
  onChange: (partial: Partial<QuestionnaireAnswers>) => void;
}

const GOALS: Array<{ id: PrimaryGoal; label: string; icon: string }> = [
  { id: 'more_clients', label: 'Conseguir más clientes', icon: '📈' },
  { id: 'show_work', label: 'Mostrar mi trabajo', icon: '🖼️' },
  { id: 'give_info', label: 'Dar información del negocio', icon: 'ℹ️' },
  { id: 'credibility', label: 'Generar credibilidad', icon: '⭐' },
  { id: 'sell_online', label: 'Vender productos/servicios', icon: '🛒' },
  { id: 'reservations', label: 'Gestionar reservas / citas', icon: '📅' },
];

const PAGES: Array<{ id: string; label: string }> = [
  { id: 'home', label: 'Inicio' },
  { id: 'about', label: 'Sobre mí / Nosotros' },
  { id: 'services', label: 'Servicios' },
  { id: 'portfolio', label: 'Portafolio / Galería' },
  { id: 'pricing', label: 'Precios' },
  { id: 'testimonials', label: 'Testimonios' },
  { id: 'blog', label: 'Blog' },
  { id: 'contact', label: 'Contacto' },
  { id: 'faq', label: 'Preguntas frecuentes' },
  { id: 'menu', label: 'Menú (restaurante)' },
  { id: 'shop', label: 'Tienda online' },
  { id: 'reservations', label: 'Reservas / Citas' },
  { id: 'location', label: 'Ubicación / Mapa' },
];

export default function Step3Goals({ answers, onChange }: Step3Props) {
  const togglePage = (id: string) => {
    const current = answers.desiredPages;
    onChange({
      desiredPages: current.includes(id) ? current.filter((p) => p !== id) : [...current, id],
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-xl font-bold text-card-foreground">Objetivos del sitio web</h3>
        <p className="text-sm text-muted-foreground mt-1">
          ¿Qué quieres lograr con tu presencia online?
        </p>
      </div>

      {/* Primary Goal */}
      <div>
        <p className="text-sm font-medium text-card-foreground mb-3">
          Objetivo principal <span className="text-destructive">*</span>
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {GOALS.map((g) => (
            <button
              key={g.id}
              type="button"
              onClick={() => onChange({ primaryGoal: g.id })}
              className={cn(
                'flex items-center gap-2 p-3 rounded-xl border-2 text-left text-sm transition-all duration-200 cursor-pointer',
                answers.primaryGoal === g.id
                  ? 'border-primary bg-primary/5 font-medium text-primary'
                  : 'border-border text-card-foreground hover:border-primary/50',
              )}
            >
              <span>{g.icon}</span>
              <span className="leading-tight">{g.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Desired Pages */}
      <div>
        <p className="text-sm font-medium text-card-foreground mb-3">
          ¿Qué páginas/secciones necesitas? (selecciona varias)
        </p>
        <div className="flex flex-wrap gap-2">
          {PAGES.map((page) => (
            <button
              key={page.id}
              type="button"
              onClick={() => togglePage(page.id)}
              className={cn(
                'px-3 py-1.5 rounded-full text-xs font-medium border transition-all duration-200 cursor-pointer',
                answers.desiredPages.includes(page.id)
                  ? 'border-primary bg-primary text-primary-foreground'
                  : 'border-border text-muted-foreground hover:border-primary/50 hover:text-card-foreground',
              )}
            >
              {page.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
