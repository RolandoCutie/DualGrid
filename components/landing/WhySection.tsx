const DIFFERENTIALS = [
  {
    emoji: '🎨',
    title: 'Diseño 100% personalizado',
    desc: 'No usamos plantillas. Cada sitio es único y diseñado desde cero para tu marca.',
  },
  {
    emoji: '⚡',
    title: 'Servicio completo',
    desc: 'Tú solo apruebas. Nosotros nos encargamos de todo: diseño, código, dominio y hosting.',
  },
  {
    emoji: '🗣️',
    title: 'Atención en español',
    desc: 'Comunicación directa, sin barreras. Soporte vía WhatsApp durante todo el proyecto.',
  },
  {
    emoji: '🔧',
    title: 'Desarrollamos lo que necesites',
    desc: 'Sin límites de funcionalidades. Si lo necesitas, lo construimos.',
  },
  {
    emoji: '📱',
    title: 'Perfecto en todos los dispositivos',
    desc: 'Diseño responsive desde el primer boceto. Funciona en móvil, tablet y escritorio.',
  },
  {
    emoji: '🔒',
    title: 'Código limpio y seguro',
    desc: 'Seguimos mejores prácticas de seguridad y rendimiento en cada proyecto.',
  },
];

export default function WhySection() {
  return (
    <section className="py-24 bg-background">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-14">
          <span className="text-xs font-semibold text-primary uppercase tracking-wider">
            ¿Por qué elegirnos?
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-card-foreground mt-2 mb-4">
            La diferencia DualGrid
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            No somos una agencia masiva. Somos un equipo pequeño que trata cada proyecto como si
            fuera el nuestro.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {DIFFERENTIALS.map((item) => (
            <div
              key={item.title}
              className="flex flex-col gap-3 p-6 rounded-2xl border border-border bg-card hover:border-primary/40 transition-colors duration-200 hover:shadow-sm"
            >
              <span className="text-3xl">{item.emoji}</span>
              <h3 className="font-bold text-card-foreground">{item.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
