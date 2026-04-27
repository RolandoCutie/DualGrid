const STEPS = [
  {
    number: '01',
    title: 'Descubrimiento',
    desc: 'Reunión inicial para entender tus objetivos, estilo y público objetivo.',
    icon: '🔍',
  },
  {
    number: '02',
    title: 'Propuesta',
    desc: 'Enviamos una propuesta detallada con alcance, precio y cronograma.',
    icon: '📋',
  },
  {
    number: '03',
    title: 'Diseño',
    desc: 'Creamos wireframes y mockups para tu aprobación. 2 rondas de revisión.',
    icon: '🎨',
  },
  {
    number: '04',
    title: 'Desarrollo',
    desc: 'Programamos el sitio con código limpio, responsive y optimizado.',
    icon: '⚙️',
  },
  {
    number: '05',
    title: 'Lanzamiento',
    desc: 'Configuramos dominio, hosting y publicamos. Entregamos todos los accesos.',
    icon: '🚀',
  },
  {
    number: '06',
    title: 'Soporte',
    desc: '30 días de garantía para corrección de errores técnicos.',
    icon: '🛡️',
  },
];

export default function ProcessSection() {
  return (
    <section className="py-24 bg-muted/30">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-14">
          <span className="text-xs font-semibold text-primary uppercase tracking-wider">
            Cómo trabajamos
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-card-foreground mt-2 mb-4">
            Proceso claro, resultados predecibles
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Seguimos un flujo de trabajo probado que garantiza calidad y transparencia en cada
            etapa.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {STEPS.map((step) => (
            <div
              key={step.number}
              className="relative bg-card border border-border rounded-2xl p-6 hover:shadow-md transition-shadow duration-200"
            >
              <div className="flex items-start gap-4">
                <span className="text-3xl">{step.icon}</span>
                <div>
                  <span className="text-xs font-bold text-primary">{step.number}</span>
                  <h3 className="text-base font-bold text-card-foreground mt-0.5">{step.title}</h3>
                  <p className="text-sm text-muted-foreground mt-2 leading-relaxed">{step.desc}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
