/**
 * Contract templates for every web and branding plan.
 *
 * Each template defines:
 *  - revisionsIncluded  : hard limit on revision rounds
 *  - services           : deliverables to pre-fill the services table
 *  - excludedItems      : explicit list of what is NOT covered
 *  - contractTerms      : full legal text rendered in the PDF
 */

export type ContractPlanId =
  | 'menu_qr'
  | 'landing'
  | 'blog'
  | 'portfolio'
  | 'restaurant'
  | 'wp_business'
  | 'ecommerce_store'
  | 'custom'
  | 'essential'
  | 'corporate'
  | 'global';

export interface ContractServiceRow {
  name: string;
  description: string;
  price: number;
}

export interface ContractTemplate {
  planId: ContractPlanId;
  revisionsIncluded: number;
  services: ContractServiceRow[];
  excludedItems: string[];
  contractTerms: string;
}

// ─── Shared legal clauses ─────────────────────────────────────────────────────

const COMMON_PAYMENT_CLAUSE = `CONDICIONES DE PAGO:
(a) ANTICIPO: El anticipo acordado en este contrato es exigible antes del inicio de cualquier trabajo. Se entiende por "inicio del trabajo" la primera acción técnica realizada por DualGrid (investigación, diseño, configuración o desarrollo), lo cual ocurrirá dentro de los 3 días hábiles siguientes a la recepción del anticipo.
(b) SALDO FINAL: El saldo restante se abonará en su totalidad dentro de los 3 días hábiles siguientes a la notificación de entrega por parte de DualGrid. Se entiende por "entrega" el envío por escrito (correo electrónico o plataforma acordada) del enlace o archivos del proyecto terminado, acompañado de la notificación formal de finalización.
(c) APROBACIÓN TÁCITA: Si transcurridos 5 días hábiles desde la notificación de entrega el Cliente no ha emitido observaciones por escrito, el proyecto se considerará aprobado y aceptado en su totalidad, generando la obligación inmediata de pago del saldo pendiente.
(d) MORA: Los pagos no recibidos en el plazo establecido generarán un recargo del 2 % mensual sobre el saldo pendiente. DualGrid podrá suspender el acceso al proyecto, retener archivos o desactivar el sitio hasta la recepción del pago total, sin que esto constituya incumplimiento contractual por parte de DualGrid.
(e) NO REEMBOLSABILIDAD: Ningún pago recibido es reembolsable una vez iniciado el trabajo correspondiente a esa etapa, dado que representa la compensación por el trabajo ya ejecutado.`;

const COMMON_REVISION_INTRO = (n: number) =>
  `POLÍTICA DE REVISIONES:
(a) DEFINICIÓN DE REVISIÓN: Se entiende por "ronda de revisión" el conjunto de ajustes estéticos, textuales o funcionales menores solicitados por el Cliente sobre trabajo ya entregado, siempre que dichos ajustes no alteren el alcance, la estructura, las funcionalidades ni los objetivos originalmente acordados en este contrato.
(b) CANAL OBLIGATORIO: Todas las solicitudes de revisión deberán enviarse por escrito al correo electrónico oficial de DualGrid en un único mensaje consolidado. Los comentarios enviados por WhatsApp, llamada telefónica u otros canales informales no serán considerados válidos ni computados como rondas formales de revisión hasta que sean confirmados por escrito.
(c) PLAZO PARA REVISIONES: Cada ronda de revisión debe enviarse dentro de los 5 días hábiles siguientes a la recepción de la entrega parcial o final correspondiente. Si el Cliente no envía su revisión en dicho plazo, la entrega se considerará aprobada y se avanzará a la siguiente etapa o se dará por finalizado el proyecto.
(d) QUÉ INCLUYE UNA REVISIÓN: Se consideran correcciones incluidas en una ronda de revisión: (i) errores de funcionamiento sobre lo ya entregado; (ii) ajustes de estilo, color, tipografía, alineación, espaciado o disposición visual sobre secciones ya aprobadas; y (iii) ajustes de texto o imágenes sobre contenidos que el propio Cliente haya entregado. Una ronda puede agrupar tantas correcciones como el Cliente consolide en un único envío, siempre que todas se refieran a la misma entrega y no alteren el alcance.
(e) QUÉ NO INCLUYE UNA REVISIÓN (NUEVO REQUERIMIENTO): No se considerará corrección, sino nuevo requerimiento (cambio de alcance), cualquier solicitud que implique: agregar páginas, secciones o funcionalidades no acordadas originalmente; agregar o rediseñar portadas, mapas, formularios, botones o componentes no previstos en este contrato; cambiar la estructura o arquitectura del sitio después de aprobada; rediseñar desde cero una sección ya aprobada; modificar el concepto visual general una vez aprobada la propuesta de diseño; integrar servicios de terceros no mencionados en este contrato; o cualquier trabajo que requiera más de 2 horas adicionales de desarrollo. El hecho de que el Cliente considere que una solicitud "forma parte del trabajo terminado" no la convierte en corrección: solo lo expresamente incluido en este contrato forma parte del trabajo terminado.
(f) RONDAS INCLUIDAS: Este contrato incluye un máximo de ${n} ronda${n === 1 ? '' : 's'} de revisión${n === 1 ? '' : 'es'}. Las rondas no utilizadas no se acumulan, no se transfieren a otros proyectos ni generan derecho a compensación económica.
(g) RONDAS ADICIONALES: Cada ronda de revisión adicional fuera de las incluidas tiene un costo de USD $50, pagaderos antes de que DualGrid comience a trabajar en dicha ronda. La no recepción del pago suspende la obligación de DualGrid de procesar la revisión.
(h) RESOLUCIÓN DE DISPUTAS SOBRE ALCANCE: En caso de discrepancia sobre si una solicitud constituye una revisión o un cambio de alcance, la decisión corresponde a DualGrid. En ningún caso DualGrid estará obligado a realizar trabajo en disputa antes de acordar su naturaleza y precio por escrito.`;

const COMMON_DELIVERY_CLAUSE = `PLAZOS DE ENTREGA:
(a) Los plazos indicados en este contrato son estimados y comienzan a contarse desde la fecha de recepción simultánea de: (i) el anticipo acordado y (ii) el 100 % de los materiales necesarios (textos, imágenes, logotipos, credenciales de acceso, referencias visuales y cualquier otro insumo requerido).
(b) OBLIGACIÓN DE MATERIALES: El Cliente deberá entregar todos los materiales necesarios dentro de los 7 días hábiles siguientes a la firma de este contrato o a la fecha de inicio acordada. El incumplimiento de este plazo pospone automáticamente la fecha de entrega por el número de días de retraso en que incurra el Cliente, más 2 días hábiles adicionales de reorganización.
(c) PARALIZACIÓN DEL PROYECTO: Si el Cliente no entrega los materiales solicitados o no responde comunicaciones de DualGrid durante más de 15 días hábiles consecutivos, el proyecto se considerará pausado. Para reactivarlo, el Cliente deberá abonar una tarifa de reactivación de USD $50, y los plazos se reiniciarán desde la fecha de reactivación.
(d) DualGrid comunicará por escrito cualquier retraso en la entrega causado por circunstancias de su propia responsabilidad.`;

const COMMON_CONTENT_CLAUSE = `MATERIALES Y CONTENIDOS: El Cliente es responsable de proveer todos los textos, imágenes, logotipos, credenciales de acceso y cualquier otro material necesario para la ejecución del proyecto en el plazo acordado y con los derechos de uso correspondientes. DualGrid no se hace responsable por la calidad visual o el rendimiento del proyecto si los materiales provistos son de baja calidad, resolución insuficiente o no aptos para uso web. DualGrid tampoco se hace responsable por el uso de materiales provistos por el Cliente que infrinjan derechos de terceros.`;

const COMMON_INTELLECTUAL_PROPERTY = `PROPIEDAD INTELECTUAL:
(a) DURANTE EL PROYECTO: Hasta la recepción del pago total acordado, todos los diseños, código, archivos y entregables son propiedad exclusiva de DualGrid. El Cliente no tiene derecho de uso, copia, distribución ni modificación de los mismos hasta completar el pago.
(b) TRANSFERENCIA: Una vez liquidado el 100 % del monto acordado, DualGrid transfiere al Cliente la titularidad de los diseños y desarrollos específicamente creados para este proyecto.
(c) CÓDIGO BASE Y COMPONENTES REUTILIZABLES: DualGrid retiene la propiedad intelectual de su código base, frameworks propietarios, componentes genéricos y metodologías de desarrollo. El Cliente recibe una licencia de uso irrevocable y no exclusiva sobre dichos componentes tal como están integrados en el proyecto entregado.
(d) HERRAMIENTAS Y LIBRERÍAS DE TERCEROS: El código, plugins, temas, librerías y herramientas de terceros utilizados conservan sus licencias originales. DualGrid garantiza usar únicamente herramientas con licencias compatibles con uso comercial, pero las condiciones de dichas licencias son responsabilidad del proveedor original.
(e) IMPAGO: Si el Cliente no completa el pago total acordado, DualGrid conserva todos los derechos sobre el trabajo realizado y podrá, a su criterio: (i) no entregar los archivos finales, (ii) desactivar el sitio web, (iii) retener el código fuente, y (iv) reutilizar o reproponer los diseños para otros clientes.
(f) PORTAFOLIO: DualGrid se reserva el derecho de exhibir capturas y descripciones del proyecto terminado en su portafolio y materiales de marketing. El Cliente puede solicitar por escrito, dentro de los 30 días siguientes a la entrega final, que el proyecto sea marcado como confidencial y no exhibido públicamente.`;

const COMMON_CONFIDENTIALITY = `CONFIDENCIALIDAD: Ambas partes se comprometen a tratar como información confidencial cualquier dato, estrategia de negocio o información sensible compartida durante el desarrollo del proyecto, y a no divulgarla a terceros sin autorización escrita expresa. Esta obligación se extiende por un período de 2 años tras la finalización del contrato.`;

const COMMON_CANCELLATION = `CANCELACIÓN Y TERMINACIÓN:
(a) CANCELACIÓN POR EL CLIENTE: El Cliente puede cancelar el contrato en cualquier momento notificando por escrito a DualGrid. En tal caso: el anticipo no es reembolsable en ningún caso; si el trabajo realizado excede el valor del anticipo, el Cliente deberá abonar la diferencia proporcional (calculada en función del porcentaje de trabajo completado al momento de la cancelación, según evaluación de DualGrid comunicada al Cliente dentro de los 3 días hábiles); si el trabajo realizado es inferior al valor del anticipo, DualGrid retiene el anticipo íntegro como compensación por los costos de oportunidad y trabajo ejecutado.
(b) CANCELACIÓN POR DUALGRID: DualGrid podrá cancelar el contrato si: el Cliente incumple el pago del saldo acordado tras 10 días hábiles de mora; el Cliente incumple obligaciones esenciales del contrato (entrega de materiales, aprobaciones, etc.) durante más de 20 días hábiles consecutivos; o el Cliente solicita trabajo ilegal, contrario a la ética o que viola derechos de terceros. En estos casos, DualGrid retendrá los pagos recibidos como compensación y no estará obligado a entregar los archivos del proyecto.
(c) ABANDONO DEL CLIENTE: Si el Cliente no responde comunicaciones de DualGrid ni entrega materiales solicitados durante más de 30 días hábiles consecutivos, el proyecto se considerará cancelado por abandono. DualGrid retendrá todos los pagos recibidos y el proyecto podrá archivarse sin obligación de aviso adicional.
(d) SUSPENSIÓN POR IMPAGO: DualGrid podrá suspender inmediatamente el acceso al proyecto, desactivar el sitio o retener archivos ante incumplimiento de pago, sin que esto constituya incumplimiento contractual de DualGrid ni genere derecho a compensación del Cliente.`;

const COMMON_LIMITATION_LIABILITY = `LIMITACIÓN DE RESPONSABILIDAD: DualGrid no será responsable por pérdidas de datos, pérdida de ingresos, daños indirectos ni perjuicios derivados de interrupciones del servicio de terceros (hosting, proveedores de dominio, pasarelas de pago, etc.). DualGrid tampoco será responsable por el uso indebido que el Cliente haga del sitio o sistema entregado, por contenidos publicados por el Cliente, ni por daños derivados de modificaciones realizadas por el Cliente o terceros sobre el proyecto entregado. La responsabilidad máxima de DualGrid en cualquier circunstancia se limita al monto total cobrado por este contrato.`;

const COMMON_JURISDICTION = `LEY APLICABLE Y JURISDICCIÓN: Este contrato se regirá e interpretará de conformidad con los principios del comercio internacional de servicios digitales y los usos y costumbres del sector, siendo la legislación de la República de Cuba el marco de referencia principal para las partes. Cualquier disputa que surja de o en relación con este contrato y que no pueda resolverse de manera amistosa dentro de los 15 días hábiles siguientes a la notificación escrita de la disputa, será sometida a mediación ante un mediador profesional designado de mutuo acuerdo. Los costos de mediación se dividirán en partes iguales entre ambas partes. Este contrato puede ejecutarse en formato digital. La aceptación mediante correo electrónico de confirmación o pago del anticipo tiene la misma validez que la firma física, conforme a los usos del comercio electrónico internacional.`;

const COMMON_SCOPE_CHANGES = `CAMBIOS DE ALCANCE (SCOPE CREEP):
(a) DEFINICIÓN: Se entiende por cambio de alcance cualquier solicitud del Cliente que modifique, amplíe o altere el alcance original definido en este contrato, incluyendo pero no limitado a: nuevas páginas o secciones, nuevas funcionalidades, nuevas integraciones, cambios de estructura o cambios de concepto.
(b) PROCESO OBLIGATORIO: Todo cambio de alcance deberá seguir el siguiente proceso: (1) El Cliente solicita el cambio por escrito. (2) DualGrid emite una "Orden de Cambio" (cotización escrita) con el nuevo precio y el impacto en el cronograma, dentro de los 3 días hábiles. (3) El Cliente aprueba la Orden de Cambio por escrito y abona el anticipo correspondiente. (4) Solo entonces DualGrid incorpora el cambio al proyecto.
(c) OBLIGATORIEDAD: Los cambios de alcance SIEMPRE implican un ajuste en el precio y/o los plazos. DualGrid no está obligado a ejecutar ningún cambio de alcance sin haber recibido la aprobación escrita y el pago correspondiente.
(d) BUENA VOLUNTAD: La ejecución de un cambio de alcance sin haber formalizado la Orden de Cambio en ningún caso se entenderá como renuncia a cobrar por dicho trabajo ni como precedente para cambios futuros. DualGrid podrá reclamar retroactivamente el trabajo realizado de buena fe si el Cliente no formaliza el pago en un plazo de 5 días hábiles.`;

const COMMON_OFFICIAL_COMMUNICATIONS = `COMUNICACIONES OFICIALES: Toda comunicación relevante (aprobaciones, solicitudes de revisión, cambios de alcance, reclamaciones, cancelaciones) debe realizarse por correo electrónico al canal oficial de DualGrid. Las comunicaciones por WhatsApp, llamada telefónica u otros canales informales no tendrán validez contractual a menos que sean confirmadas posteriormente por correo electrónico por ambas partes. DualGrid considerará la dirección de correo electrónico indicada al inicio del proyecto como el canal oficial del Cliente durante toda la vigencia del contrato.`;

const COMMON_WARRANTY = `GARANTÍA POST-ENTREGA: DualGrid garantiza el correcto funcionamiento de todas las funcionalidades entregadas durante un período de 30 días calendario contados desde la fecha de entrega final aceptada. Durante este período, DualGrid corregirá sin cargo adicional cualquier comportamiento que no funcione según lo especificado en el contrato (bug). Transcurrido este período, cualquier corrección o ajuste estará sujeto a las tarifas de mantenimiento vigentes. Esta garantía no cubre fallos causados por: modificaciones realizadas por el Cliente o terceros, actualizaciones de software externo realizadas sin coordinación con DualGrid, ni cambios en el entorno de hosting no comunicados a DualGrid.`;

const COMMON_PROJECT_SPECIFICATION = `ESPECIFICACIÓN DEL PROYECTO: El alcance exacto del proyecto está definido por los servicios y elementos explícitamente enumerados en este contrato. Cualquier característica, sección, integración o funcionalidad no mencionada explícitamente en este documento no está incluida en el precio acordado y constituirá un cambio de alcance sujeto al proceso descrito en la cláusula correspondiente. En caso de duda sobre si algo está incluido, prevalece lo escrito en este contrato.`;

const COMMON_CONTENT_SEPARATION = `ALCANCE: DISEÑO WEB VERSUS CONTENIDOS:
(a) Este contrato cubre el diseño y desarrollo web (estructura, programación, interfaz, estética y funcionalidad). No incluye la producción de contenidos: redacción o reescritura de textos, traducciones, corrección ortotipográfica profunda, fotografía, ilustración, búsqueda o selección de imágenes, ni el diseño de material gráfico (portadas, mapas, banners, flyers, etc.).
(b) EL CLIENTE PROVEE LOS CONTENIDOS DEFINITIVOS: El Cliente entregará los textos finales, las imágenes en alta resolución y el resto de materiales, organizados y listos para uso web, conforme a la cláusula de materiales. DualGrid integra esos materiales tal como se le entregan y no asume la corrección de ortografía de los textos, la búsqueda de fotografías "adecuadas" ni la creación de contenido faltante.
(c) TRABAJO TERMINADO: Un proyecto no puede considerarse "trabajo terminado" en tanto el Cliente no haya provisto los contenidos definitivos. Sin embargo, la demora del Cliente en entregarlos no amplía el alcance del contrato ni convierte en correcciones las solicitudes de contenidos que debió proveer.
(d) EXCEPCIÓN (SERVICIOS ADICIONALES): Si el Cliente desea contratar servicios de redacción, corrección, traducción, fotografía o diseño de material gráfico, se acordarán por escrito como servicios adicionales y se cotizarán por separado. Sin ese acuerdo escrito, no están incluidos en el precio.
(e) CALIDAD DE MATERIALES: La calidad visual final del sitio depende directamente de la calidad de los materiales provistos. DualGrid no responde por un resultado inferior si los materiales entregados son de baja resolución, desorganizados o no aptos para uso web.`;

const COMMON_CHANGE_REQUEST = `PROCESO FORMAL DE SOLICITUDES DE CAMBIO:
(a) FORMULARIO DE SOLICITUDES: Toda solicitud de revisión o de cambio se canalizará mediante el Formulario de Solicitud de Cambios anexo a este contrato (o, en su defecto, un correo electrónico que cumpla sus mismos requisitos), indicando: la entrega a la que se refiere, la sección afectada, la descripción precisa del cambio y si, a juicio del Cliente, se trata de una corrección o de un nuevo requerimiento.
(b) CONSOLIDACIÓN OBLIGATORIA: El Cliente consolidará todos sus comentarios sobre una entrega en un único envío por ronda. Los comentarios parciales o fragmentados no se procesarán de forma aislada: se computarán dentro de la misma ronda contando desde el primer envío y solo se atenderán una vez consolidados.
(c) CIERRE DE RONDA: Cada ronda de revisión se cierra con la entrega de los ajustes por parte de DualGrid. La siguiente ronda exige un nuevo envío consolidado. No existe revisión indefinida, acumulativa ni automática.
(d) DISCREPANCIAS: Si el Cliente clasifica como corrección una solicitud que DualGrid considere nuevo requerimiento, se seguirá el procedimiento previsto en la cláusula de resolución de disputas sobre alcance.`;

const COMMON_ACCEPTANCE = `FASE DE PRUEBAS Y ACEPTACIÓN FINAL:
(a) FASE DE PRUEBAS: Antes de la entrega final, el Cliente dispondrá de un período de pruebas para verificar que el sitio funciona según lo especificado en este contrato y que la última ronda de revisiones fue implementada correctamente.
(b) ACEPTACIÓN: El proyecto se entenderá terminado y aceptado cuando el Cliente lo apruebe por escrito (correo de aceptación) o, en ausencia de observaciones, conforme a la cláusula de aprobación tácita. A partir de la aceptación cesa la fase de desarrollo.
(c) POST-LANZAMIENTO: Cualquier modificación, añadido o ajuste solicitado después de la aceptación final —incluso los aparentemente menores— se considerará mantenimiento post-lanzamiento y se cotizará y facturará por hora según la tarifa vigente de DualGrid o bajo la tarifa pactada por escrito, salvo que se trate de un bug cubierto por la garantía post-entrega.
(d) La garantía post-entrega cubre exclusivamente el correcto funcionamiento de lo entregado, y no la implementación de cambios ni nuevas peticiones, aunque estas deriven de preferencias o contenidos que el Cliente no definió durante el desarrollo.`;

const COMMON_GOOD_FAITH = `PRIORIDAD DE TRABAJO Y BUENA FE SIN PRECEDENTE:
(a) PRIORIDAD: DualGrid se reserva el derecho de organizar su propia carga de trabajo y de priorizar proyectos, hitos y clientes según su planificación interna. Los trabajos adicionales o cambios de alcance se atenderán conforme a disponibilidad y únicamente tras la formalización del encargo y el pago correspondiente.
(b) BUENA FE SIN PRECEDENTE: La realización ocasional de trabajos adicionales de buena fe (por ejemplo, una portada o un mapa no pactados) es una cortesía excepcional. No sienta precedente, no amplía el alcance de este contrato, no obliga a DualGrid a repetirla, no constituye renuncia al cobro de servicios futuros ni modifica esta cláusula.
(c) La inclusión de un trabajo de buena fe en la entrega no obliga a DualGrid a mantenerlo, actualizarlo ni darle soporte más allá del plazo o alcance acordados.`;

const COMMON_SELF_MANAGEMENT = `AUTOGESTIÓN, MANUALES Y CONTENIDOS DINÁMICOS:
(a) CAPACITACIÓN BÁSICA: DualGrid entregará al Cliente un manual de uso básico y/o una sesión de capacitación (según lo indicado en el plan contratado) para que gestione de forma autónoma las secciones autoadministrables del sitio (panel de administración, galerías, publicaciones, productos, menú, etc.).
(b) ACTUALIZACIÓN DE CONTENIDOS DINÁMICOS: Una vez entregado el proyecto, la actualización de contenidos dinámicos (publicaciones, productos, precios, platos, imágenes, promociones, etc.) es responsabilidad exclusiva del Cliente, quien dispone de las herramientas necesarias para realizarla sin asistencia técnica.
(c) EDICIONES SIMPLES: Las ediciones que el Cliente pueda realizar por sí mismo según el manual (agregar imágenes a la galería, publicar, modificar precios) no serán realizadas por DualGrid. Si el Cliente solicita que DualGrid las ejecute de todos modos, se facturarán como trabajo adicional conforme a las tarifas vigentes.
(d) MANTENIMIENTO CONTRATADO: Si el Cliente desea que DualGrid gestione o actualice contenidos por su cuenta, podrá contratar un plan de mantenimiento mensual, cuyas condiciones y tarifas se pactarán por escrito en un documento aparte.`;

function buildTerms(planName: string, revisions: number, extra: string[] = []): string {
  return [
    `CONTRATO DE PRESTACIÓN DE SERVICIOS DIGITALES — ${planName.toUpperCase()}`,
    '',
    `Este documento constituye el acuerdo formal entre DualGrid (en adelante "el Prestador") y el Cliente identificado en la sección de partes, para la prestación de los servicios descritos en el presente contrato bajo el plan "${planName}".`,
    '',
    COMMON_PROJECT_SPECIFICATION,
    '',
    COMMON_CONTENT_SEPARATION,
    '',
    COMMON_PAYMENT_CLAUSE,
    '',
    COMMON_REVISION_INTRO(revisions),
    '',
    COMMON_CHANGE_REQUEST,
    '',
    COMMON_DELIVERY_CLAUSE,
    '',
    COMMON_CONTENT_CLAUSE,
    '',
    COMMON_SCOPE_CHANGES,
    '',
    COMMON_GOOD_FAITH,
    '',
    COMMON_ACCEPTANCE,
    '',
    COMMON_SELF_MANAGEMENT,
    '',
    COMMON_OFFICIAL_COMMUNICATIONS,
    '',
    COMMON_WARRANTY,
    '',
    ...extra.flatMap((c) => [c, '']),
    COMMON_INTELLECTUAL_PROPERTY,
    '',
    COMMON_CONFIDENTIALITY,
    '',
    COMMON_CANCELLATION,
    '',
    COMMON_LIMITATION_LIABILITY,
    '',
    COMMON_JURISDICTION,
    '',
    `ACEPTACIÓN: La firma de este contrato implica la aceptación plena y sin reservas de todas las condiciones aquí establecidas por ambas partes.`,
  ].join('\n');
}

// ─── WEB PLAN TEMPLATES ──────────────────────────────────────────────────────

const MENU_QR_TEMPLATE: ContractTemplate = {
  planId: 'menu_qr',
  revisionsIncluded: 2,
  services: [
    {
      name: 'Diseño visual del menú digital',
      description:
        'Diseño personalizado acorde a la identidad de la marca, colores y estilo del restaurante.',
      price: 0,
    },
    {
      name: 'Carga de hasta 50 platos',
      description:
        'Inclusión de nombre, foto, descripción y precio por cada plato. Las fotografías deben ser provistas por el Cliente.',
      price: 0,
    },
    {
      name: 'Código QR personalizado',
      description:
        'Generación del código QR con diseño de marca, listo para imprimir en mesas, cartas y material físico.',
      price: 0,
    },
    {
      name: 'Panel de administración',
      description:
        'Acceso a panel sencillo para que el Cliente pueda actualizar platos y precios de forma autónoma.',
      price: 0,
    },
    {
      name: 'Botón de pedido por WhatsApp',
      description:
        'Integración de botón directo para que los comensales realicen pedidos vía WhatsApp.',
      price: 0,
    },
    {
      name: 'Adaptación móvil',
      description:
        'Sitio 100 % compatible con smartphones y tablets. No requiere descarga de aplicación.',
      price: 0,
    },
  ],
  excludedItems: [
    'Hosting / alojamiento web (no incluido en este plan — DualGrid también lo ofrece como servicio aparte)',
    'Dominio / nombre de la página web (no incluido en este plan — DualGrid también lo ofrece como servicio aparte)',
    'Fotografía profesional de platos y ambiente',
    'Redacción de textos, descripciones y copys',
    'Más de 50 platos (cada bloque adicional de 10 platos: USD $20)',
    'Integración con sistemas de punto de venta (POS) de terceros',
    'Mantenimiento mensual posterior a la entrega (cotizable por separado)',
    'Rondas de revisión adicionales a las incluidas (USD $50 c/u)',
  ],
  contractTerms: buildTerms('Menú Digital QR', 2, [
    `PLATOS ADICIONALES: El plan incluye hasta 50 platos. La carga de platos adicionales (en bloques de 10) tiene un costo de USD $20 por bloque, pagadero antes de realizar el trabajo.`,
    `ACTUALIZACIONES POST-ENTREGA: Una vez entregado el proyecto, el Cliente puede actualizar platos y precios de forma autónoma desde el panel. Si el Cliente solicita cambios de diseño o estructura después de la entrega, estos se cotizarán como un nuevo servicio.`,
  ]),
};

const LANDING_TEMPLATE: ContractTemplate = {
  planId: 'landing',
  revisionsIncluded: 2,
  services: [
    {
      name: 'Diseño de landing page (1 página)',
      description:
        'Diseño profesional a medida en una sola página web, adaptado a la identidad de la marca.',
      price: 0,
    },
    {
      name: 'Diseño responsivo',
      description: 'Adaptación completa para móvil, tablet y computadora de escritorio.',
      price: 0,
    },
    {
      name: 'Formulario de contacto',
      description:
        'Formulario funcional para recibir consultas de clientes, con notificaciones al correo electrónico del Cliente.',
      price: 0,
    },
    {
      name: 'Integración de redes sociales y WhatsApp',
      description:
        'Botones de acceso directo a WhatsApp, llamada telefónica y perfiles en redes sociales.',
      price: 0,
    },
    {
      name: 'Optimización de velocidad de carga',
      description: 'Configuración técnica para asegurar tiempos de carga rápidos.',
      price: 0,
    },
    {
      name: 'Google Analytics',
      description:
        'Integración con Google Analytics para seguimiento de visitas y comportamiento de usuarios.',
      price: 0,
    },
  ],
  excludedItems: [
    'Hosting / alojamiento web (no incluido en este plan — DualGrid también lo ofrece como servicio aparte)',
    'Dominio / nombre de la página web (no incluido en este plan — DualGrid también lo ofrece como servicio aparte)',
    'Redacción de textos y copys de la página',
    'Fotografía o imágenes de stock premium',
    'Páginas adicionales más allá de la landing (cotizables por separado)',
    'Campaña de publicidad pagada (Google Ads, Meta Ads, etc.)',
    'Posicionamiento SEO avanzado o estrategia de contenido',
    'Mantenimiento mensual posterior a la entrega (cotizable por separado)',
    'Rondas de revisión adicionales a las incluidas (USD $50 c/u)',
  ],
  contractTerms: buildTerms('Landing Express', 2, [
    `ALCANCE DE LA PÁGINA: Este plan contempla el diseño y desarrollo de una única página web (landing page). La solicitud de páginas adicionales (blog, tienda, etc.) constituye un cambio de alcance y se cotizará por separado.`,
  ]),
};

const BLOG_TEMPLATE: ContractTemplate = {
  planId: 'blog',
  revisionsIncluded: 2,
  services: [
    {
      name: 'Diseño del blog',
      description:
        'Diseño enfocado en legibilidad y navegación intuitiva, con identidad visual acorde a la marca del Cliente.',
      price: 0,
    },
    {
      name: 'Sistema de categorías, etiquetas y buscador',
      description:
        'Organización de contenidos con categorías, etiquetas, archivo de artículos y buscador interno.',
      price: 0,
    },
    {
      name: 'Sistema de newsletter',
      description:
        'Integración de formulario de suscripción para captar lectores y enviarles notificaciones de nuevos artículos.',
      price: 0,
    },
    {
      name: 'Sección de comentarios moderados',
      description:
        'Sistema de comentarios en artículos con moderación y botones para compartir en redes sociales.',
      price: 0,
    },
    {
      name: 'SEO técnico base',
      description:
        'Configuración de metadatos, URLs amigables y estructura para que Google indexe y posicione los artículos.',
      price: 0,
    },
    {
      name: 'Editor de contenido',
      description:
        'Panel sencillo para que el Cliente publique nuevos artículos sin conocimientos técnicos.',
      price: 0,
    },
  ],
  excludedItems: [
    'Hosting / alojamiento web (no incluido en este plan — DualGrid también lo ofrece como servicio aparte)',
    'Dominio / nombre de la página web (no incluido en este plan — DualGrid también lo ofrece como servicio aparte)',
    'Redacción de artículos o contenidos',
    'Fotografía o imágenes de stock premium',
    'Servicio de envío de emails/newsletter (Mailchimp, etc. — cuentas y tarifas propias del Cliente)',
    'Migración de contenidos existentes desde otra plataforma',
    'Estrategia de contenido o SEO avanzado',
    'Campañas de publicidad pagada',
    'Mantenimiento mensual posterior a la entrega (cotizable por separado)',
    'Rondas de revisión adicionales a las incluidas (USD $50 c/u)',
  ],
  contractTerms: buildTerms('Blog Profesional', 2, [
    `CONTENIDOS INICIALES: La entrega contempla el blog configurado con una estructura de muestra. La publicación de contenidos reales es responsabilidad exclusiva del Cliente. Si el Cliente desea que DualGrid redacte artículos, esto se cotizará como servicio separado.`,
    `SERVICIO DE NEWSLETTER: La integración incluye el formulario de suscripción y la conexión con la plataforma de email marketing que el Cliente designe. Las tarifas de dicha plataforma son a cargo del Cliente.`,
  ]),
};

const PORTFOLIO_TEMPLATE: ContractTemplate = {
  planId: 'portfolio',
  revisionsIncluded: 3,
  services: [
    {
      name: 'Diseño elegante con animaciones',
      description: 'Diseño visual de alto impacto con animaciones suaves y carga ultrarrápida.',
      price: 0,
    },
    {
      name: 'Galería de proyectos con filtros',
      description:
        'Sección de portafolio con categorías, filtros interactivos y presentación visual de trabajos.',
      price: 0,
    },
    {
      name: 'Página "Sobre mí"',
      description: 'Sección de presentación personal con opción de descarga de CV en formato PDF.',
      price: 0,
    },
    {
      name: 'SEO por especialidad',
      description:
        'Configuración de metadatos y estructura para posicionar el portafolio en búsquedas de Google relacionadas con la especialidad del Cliente.',
      price: 0,
    },
    {
      name: 'Formulario de contacto',
      description: 'Formulario funcional con notificaciones directas al email del Cliente.',
      price: 0,
    },
    {
      name: 'Integración para redes sociales',
      description:
        'Configuración de Open Graph para compartir el portafolio correctamente en redes con imagen y descripción personalizada.',
      price: 0,
    },
  ],
  excludedItems: [
    'Hosting / alojamiento web (no incluido en este plan — DualGrid también lo ofrece como servicio aparte)',
    'Dominio / nombre de la página web (no incluido en este plan — DualGrid también lo ofrece como servicio aparte)',
    'Fotografía profesional de proyectos o retratos',
    'Redacción de textos y descripciones de proyectos',
    'Carga de más de 15 proyectos iniciales (adicional: USD $10 por bloque de 5)',
    'Tienda online o funcionalidades de e-commerce',
    'Diseño de logotipo o identidad de marca',
    'Mantenimiento mensual posterior a la entrega (cotizable por separado)',
    'Rondas de revisión adicionales a las incluidas (USD $50 c/u)',
  ],
  contractTerms: buildTerms('Portafolio Pro', 3, [
    `PROYECTOS INICIALES: La entrega contempla la carga de hasta 15 proyectos provistos por el Cliente. La carga de proyectos adicionales (en bloques de 5) tiene un costo de USD $10 por bloque.`,
  ]),
};

const RESTAURANT_TEMPLATE: ContractTemplate = {
  planId: 'restaurant',
  revisionsIncluded: 3,
  services: [
    {
      name: 'Sitio web completo (6 secciones)',
      description:
        'Diseño y desarrollo de las secciones: Inicio, Menú, Reservas, Galería, Ubicación y Contacto.',
      price: 0,
    },
    {
      name: 'Menú digital con QR',
      description:
        'Menú digital online con código QR personalizado y panel de actualización autónoma por parte del Cliente.',
      price: 0,
    },
    {
      name: 'Sistema de reservas online',
      description: 'Formulario de reservas con confirmación automática al cliente por email.',
      price: 0,
    },
    {
      name: 'Galería de fotos',
      description:
        'Galería para fotos de ambiente, platos y eventos. Las imágenes deben ser provistas por el Cliente.',
      price: 0,
    },
    {
      name: 'SEO local y mapa de Google Maps',
      description:
        'Configuración de SEO local para aparecer en búsquedas de zona y mapa de ubicación integrado.',
      price: 0,
    },
    {
      name: 'Notificaciones de reservas',
      description:
        'Alertas de nuevas reservas enviadas por email y/o WhatsApp al administrador del restaurante.',
      price: 0,
    },
  ],
  excludedItems: [
    'Hosting / alojamiento web (no incluido en este plan — DualGrid también lo ofrece como servicio aparte)',
    'Dominio / nombre de la página web (no incluido en este plan — DualGrid también lo ofrece como servicio aparte)',
    'Fotografía profesional de platos, ambiente y equipo',
    'Redacción de textos del menú, historia y secciones',
    'Servicio externo de email transaccional (Resend, SendGrid, etc. — puede implicar costos)',
    'Sistema de pago de reservas / depósitos anticipados',
    'Integración con sistemas de punto de venta (POS)',
    'App móvil nativa',
    'Mantenimiento mensual posterior a la entrega (cotizable por separado)',
    'Rondas de revisión adicionales a las incluidas (USD $50 c/u)',
  ],
  contractTerms: buildTerms('Restaurante Pro', 3, [
    `SISTEMA DE RESERVAS: El sistema de reservas incluido es un formulario web con notificación por email/WhatsApp. No incluye integración con sistemas de gestión de mesas de terceros ni cobro de depósitos en línea. Si se requiere cobro anticipado, esto deberá cotizarse como servicio adicional.`,
    `FOTOGRAFÍAS: El Cliente deberá proveer imágenes de alta resolución del local, platos y eventos. DualGrid no se responsabiliza por la calidad visual del sitio si las imágenes provistas son de baja calidad o resolución insuficiente.`,
  ]),
};

const WP_BUSINESS_TEMPLATE: ContractTemplate = {
  planId: 'wp_business',
  revisionsIncluded: 3,
  services: [
    {
      name: 'Sitio empresarial de hasta 8 páginas',
      description:
        'Diseño y desarrollo de hasta 8 páginas a medida: Inicio, Servicios, Nosotros, Equipo, Blog, Proyectos, Contacto y una página adicional a definir.',
      price: 0,
    },
    {
      name: 'Panel de administración de contenidos',
      description:
        'Sistema de gestión de contenidos (CMS) para que el Cliente actualice textos e imágenes sin asistencia técnica.',
      price: 0,
    },
    {
      name: 'Sección de noticias / blog',
      description:
        'Blog integrado con editor para publicar noticias y actualizaciones de la empresa.',
      price: 0,
    },
    {
      name: 'Formularios de contacto y cotización',
      description: 'Formularios funcionales con notificaciones al equipo de la empresa.',
      price: 0,
    },
    {
      name: 'SEO técnico',
      description:
        'Configuración de metadatos, sitemap, robots.txt y estructura técnica para posicionamiento en Google.',
      price: 0,
    },
    {
      name: 'Google Analytics e integración de redes sociales',
      description: 'Configuración de Analytics y botones/íconos de redes sociales.',
      price: 0,
    },
  ],
  excludedItems: [
    'Hosting / alojamiento web (no incluido en este plan — DualGrid también lo ofrece como servicio aparte)',
    'Dominio / nombre de la página web (no incluido en este plan — DualGrid también lo ofrece como servicio aparte)',
    'Fotografía profesional del equipo, oficinas o productos',
    'Redacción de textos, copys y contenidos de las páginas',
    'Páginas adicionales más allá de las 8 incluidas (USD $80 c/u)',
    'Estrategia SEO avanzada o campañas de posicionamiento',
    'Campañas de publicidad pagada (Google Ads, Meta Ads)',
    'Integración con CRM, ERP u otros sistemas internos de la empresa',
    'Mantenimiento mensual posterior a la entrega (cotizable por separado)',
    'Rondas de revisión adicionales a las incluidas (USD $50 c/u)',
  ],
  contractTerms: buildTerms('Sitio Empresarial', 3, [
    `PÁGINAS ADICIONALES: El plan contempla hasta 8 páginas. Cada página adicional solicitada durante el desarrollo tiene un costo de USD $80. Las páginas se definen al inicio del proyecto; cambios de estructura solicitados después de la aprobación del diseño se considerarán cambios de alcance.`,
    `PANEL DE ADMINISTRACIÓN: El Client recibirá una sesión de capacitación (hasta 1 hora vía videollamada) para aprender a usar el panel de administración. Sesiones adicionales de capacitación se cobrarán a USD $30/hora.`,
  ]),
};

const ECOMMERCE_TEMPLATE: ContractTemplate = {
  planId: 'ecommerce_store',
  revisionsIncluded: 3,
  services: [
    {
      name: 'Tienda online completa',
      description:
        'Diseño y desarrollo de tienda e-commerce lista para vender desde el primer día.',
      price: 0,
    },
    {
      name: 'Carrito de compras y checkout',
      description: 'Flujo completo de selección de productos, carrito y proceso de pago.',
      price: 0,
    },
    {
      name: 'Integración de pasarela de pago',
      description:
        'Configuración de la pasarela de pago seleccionada por el Cliente (Stripe, PayPal u otra compatible). Las comisiones de la pasarela son a cargo del Cliente.',
      price: 0,
    },
    {
      name: 'Panel de gestión de pedidos e inventario',
      description: 'Panel para gestionar pedidos, stock, clientes y reportes básicos de ventas.',
      price: 0,
    },
    {
      name: 'Sistema de cupones y promociones',
      description:
        'Funcionalidad para crear y gestionar cupones de descuento y promociones especiales.',
      price: 0,
    },
    {
      name: 'Emails automáticos transaccionales',
      description:
        'Emails automáticos de confirmación de pedido, pago recibido y actualizaciones de estado.',
      price: 0,
    },
    {
      name: 'SEO de productos',
      description:
        'Configuración de metadatos por producto, URLs amigables y estructura para posicionamiento en Google Shopping.',
      price: 0,
    },
  ],
  excludedItems: [
    'Hosting / alojamiento web (no incluido en este plan — DualGrid también lo ofrece como servicio aparte)',
    'Dominio / nombre de la página web (no incluido en este plan — DualGrid también lo ofrece como servicio aparte)',
    'Comisiones de pasarela de pago (Stripe, PayPal, etc.)',
    'Fotografía profesional de productos',
    'Redacción de descripciones y fichas de productos',
    'Carga de más de 20 productos iniciales (adicional: USD $5 por producto)',
    'Envío e integración con operadores logísticos (DHL, FedEx, etc.)',
    'App móvil nativa para la tienda',
    'Facturación electrónica o integración con sistemas contables',
    'Estrategia de marketing digital o publicidad pagada',
    'Mantenimiento mensual posterior a la entrega (cotizable por separado)',
    'Rondas de revisión adicionales a las incluidas (USD $50 c/u)',
  ],
  contractTerms: buildTerms('Tienda Online', 3, [
    `PRODUCTOS INICIALES: La entrega contempla la carga de hasta 20 productos con información y fotos provistas por el Cliente. La carga de productos adicionales tiene un costo de USD $5 por producto.`,
    `PASARELA DE PAGO: DualGrid configura la integración técnica con la pasarela de pago seleccionada. El Cliente es responsable de abrir y verificar su propia cuenta en dicha plataforma, así como de asumir las comisiones por transacción que ésta cobre.`,
    `PRUEBAS DE PAGO: Se realizarán pruebas con tarjeta de prueba antes de la entrega. El Cliente deberá verificar el flujo completo antes de firmar la aceptación final.`,
  ]),
};

const CUSTOM_TEMPLATE: ContractTemplate = {
  planId: 'custom',
  revisionsIncluded: 5,
  services: [
    {
      name: 'Análisis de requerimientos',
      description:
        'Sesiones de relevamiento para definir el alcance técnico, funcional y visual del sistema.',
      price: 0,
    },
    {
      name: 'Desarrollo de funcionalidades personalizadas',
      description:
        'Desarrollo a medida de las funcionalidades especificadas en el documento de requerimientos.',
      price: 0,
    },
    {
      name: 'Panel de administración propio',
      description:
        'Dashboard de administración adaptado a las necesidades específicas del negocio del Cliente.',
      price: 0,
    },
    {
      name: 'Integraciones con servicios de terceros',
      description:
        'Conexión con los servicios externos especificados (pagos, reservas, CRM, redes sociales, APIs, etc.).',
      price: 0,
    },
    {
      name: 'Sistema de usuarios con roles y permisos',
      description:
        'Gestión de accesos diferenciados según roles definidos durante la etapa de análisis.',
      price: 0,
    },
    {
      name: 'Capacitación del equipo del Cliente',
      description: 'Sesiones de capacitación para el equipo del Cliente (hasta 3 horas en total).',
      price: 0,
    },
    {
      name: 'Soporte post-lanzamiento (60 días)',
      description:
        'Período de soporte técnico de 60 días corridos después de la puesta en producción, para corrección de bugs y ajustes menores.',
      price: 0,
    },
  ],
  excludedItems: [
    'Hosting / alojamiento web (no incluido en este plan — DualGrid también lo ofrece como servicio aparte)',
    'Dominio / nombre de la página web (no incluido en este plan — DualGrid también lo ofrece como servicio aparte)',
    'Tarifas y comisiones de servicios de terceros integrados',
    'Fotografía profesional y producción de contenidos',
    'Funcionalidades no especificadas en el documento de requerimientos aprobado',
    'Mantenimiento mensual tras los 60 días de soporte incluidos (cotizable por separado)',
    'Sesiones de capacitación adicionales a las 3 horas incluidas (USD $30/hora)',
    'Rondas de revisión adicionales a las incluidas (USD $50 c/u)',
  ],
  contractTerms: buildTerms('Sistema Personalizado', 5, [
    `DOCUMENTO DE REQUERIMIENTOS: Antes del inicio del desarrollo, ambas partes aprobarán por escrito un documento de requerimientos que define el alcance exacto del proyecto. Cualquier funcionalidad no contemplada en dicho documento constituye un cambio de alcance y será cotizada por separado.`,
    `ENTREGABLES POR ETAPAS: El desarrollo se estructurará en hitos acordados. Cada hito requiere aprobación escrita del Cliente antes de proceder al siguiente. Los pagos podrán vincularse a hitos específicos según lo acordado.`,
    `SOPORTE POST-LANZAMIENTO: Los 60 días de soporte cubren la corrección de bugs y ajustes menores sobre las funcionalidades entregadas. No incluye nuevas funcionalidades ni cambios de diseño significativos.`,
    `BUGS VS. CAMBIOS: Se entiende por bug cualquier comportamiento que no funcione según lo especificado en el documento de requerimientos. Los cambios de diseño o lógica solicitados después de la aprobación del hito correspondiente se considerarán cambios de alcance.`,
  ]),
};

// ─── BRANDING PLAN TEMPLATES ─────────────────────────────────────────────────

const BRANDING_PAYMENT_CLAUSE = `CONDICIONES DE PAGO — BRANDING:
(a) ANTICIPO: El anticipo acordado en este contrato es exigible antes del inicio de cualquier trabajo de diseño. Se entiende por "inicio del trabajo" la primera sesión de investigación, análisis de brief o bocetado, lo cual ocurrirá dentro de los 3 días hábiles siguientes a la recepción del anticipo.
(b) SALDO FINAL: El saldo restante se abonará en su totalidad dentro de los 3 días hábiles siguientes a la notificación de aprobación de la entrega final por parte del Cliente, y antes de recibir los archivos finales de alta resolución. Ningún archivo fuente editable (AI, EPS, PSD, FIGMA, etc.) será entregado hasta la recepción del pago total.
(c) APROBACIÓN TÁCITA: Si transcurridos 5 días hábiles desde la notificación de entrega final el Cliente no ha emitido observaciones por escrito, el proyecto se considerará aprobado y aceptado, generando la obligación inmediata de pago del saldo pendiente.
(d) MORA: Los pagos no recibidos en el plazo establecido generarán un recargo del 2 % mensual sobre el saldo pendiente. DualGrid podrá retener todos los archivos hasta la recepción del pago total, sin que esto constituya incumplimiento contractual.
(e) NO REEMBOLSABILIDAD: Ningún pago recibido es reembolsable una vez iniciado el trabajo correspondiente a esa etapa.`;

const ESSENTIAL_TEMPLATE: ContractTemplate = {
  planId: 'essential',
  revisionsIncluded: 1,
  services: [
    {
      name: 'Propuestas de logotipo (2–3 conceptos)',
      description: 'Presentación de 2 a 3 propuestas de logotipo distintas en concepto y estilo.',
      price: 0,
    },
    {
      name: 'Logotipo finalizado en todos los formatos',
      description:
        'Entrega del logotipo seleccionado en PNG (fondo transparente), SVG, PDF y JPG, en versiones horizontal, vertical e ícono.',
      price: 0,
    },
    {
      name: 'Paleta de colores corporativa',
      description:
        'Definición de paleta de colores con todos los códigos técnicos necesarios (HEX, RGB, CMYK, Pantone referencial).',
      price: 0,
    },
    {
      name: 'Guía de uso básica (PDF)',
      description:
        'Manual básico con normas esenciales: usos correctos del logotipo, fondos permitidos, errores de uso a evitar y espacio de protección.',
      price: 0,
    },
  ],
  excludedItems: [
    'Estrategia de marca o naming',
    'Múltiples versiones del logotipo para aplicaciones específicas (papelería, uniformes, vehículos, etc.)',
    'Sistema tipográfico corporativo avanzado (tipografías con licencia)',
    'Papelería corporativa (tarjetas, carpetas, presentaciones)',
    'Diseño de plantillas para redes sociales',
    'Diseño web',
    'Animación del logotipo',
    'Materiales impresos o producción física',
    'Registro de marca ante organismos oficiales',
    'Rondas de revisión adicionales a la incluida (USD $40 c/u)',
  ],
  contractTerms: [
    `CONTRATO DE DISEÑO DE IDENTIDAD DE MARCA — PLAN ESSENTIAL`,
    '',
    `Este documento constituye el acuerdo formal entre DualGrid (en adelante "el Prestador") y el Cliente identificado en la sección de partes, para la prestación de los servicios de diseño de identidad visual bajo el plan "Essential".`,
    '',
    COMMON_PROJECT_SPECIFICATION,
    '',
    BRANDING_PAYMENT_CLAUSE,
    '',
    COMMON_REVISION_INTRO(1),
    `IMPORTANTE SOBRE REVISIONES: Este plan incluye UNA (1) sola ronda de revisión sobre los conceptos presentados. La selección del concepto a desarrollar y los ajustes finales deben comunicarse en un solo envío escrito y detallado. Revisiones adicionales tienen un costo de USD $40 por ronda.`,
    '',
    COMMON_DELIVERY_CLAUSE,
    '',
    `BRIEF DE DISEÑO: El Cliente deberá completar el cuestionario de branding provisto por DualGrid antes del inicio del trabajo. La calidad y claridad del brief impacta directamente en la pertinencia de las propuestas. DualGrid no se responsabiliza por propuestas que no se ajusten si el brief fue incompleto o vago.`,
    '',
    `ARCHIVOS FINALES Y FUENTE: Los archivos en formatos de trabajo editables (AI, EPS, Figma, PSD) se entregan únicamente tras la recepción del pago total. Los archivos de uso final (PNG, SVG, PDF, JPG) se entregan con el pago del saldo.`,
    '',
    COMMON_SCOPE_CHANGES,
    '',
    COMMON_OFFICIAL_COMMUNICATIONS,
    '',
    COMMON_WARRANTY,
    '',
    COMMON_INTELLECTUAL_PROPERTY,
    '',
    COMMON_CONFIDENTIALITY,
    '',
    COMMON_CANCELLATION,
    '',
    COMMON_LIMITATION_LIABILITY,
    '',
    COMMON_JURISDICTION,
    '',
    `ACEPTACIÓN: La firma de este contrato implica la aceptación plena y sin reservas de todas las condiciones aquí establecidas por ambas partes.`,
  ].join('\n'),
};

const CORPORATE_TEMPLATE: ContractTemplate = {
  planId: 'corporate',
  revisionsIncluded: 2,
  services: [
    {
      name: 'Logotipo con variaciones completas',
      description:
        'Logotipo principal con versiones: horizontal, vertical, ícono, en positivo y en negativo.',
      price: 0,
    },
    {
      name: 'Sistema de colores y tipografías corporativas',
      description:
        'Paleta de colores completa con códigos técnicos y sistema tipográfico corporativo (fuentes primaria y secundaria).',
      price: 0,
    },
    {
      name: 'Elementos gráficos y patrones de marca',
      description:
        'Diseño de recursos visuales complementarios: íconos, patrones, texturas, formas y elementos de apoyo gráfico.',
      price: 0,
    },
    {
      name: 'Manual de marca (PDF completo)',
      description:
        'Documento de identidad corporativa con todos los lineamientos: uso del logotipo, colores, tipografías, espaciados, aplicaciones correctas e incorrectas.',
      price: 0,
    },
    {
      name: 'Aplicaciones de papelería (mockups)',
      description:
        'Diseño de aplicaciones de papelería: tarjeta de presentación, hoja membretada, carpeta corporativa y sobre (archivos digitales listos para imprimir).',
      price: 0,
    },
    {
      name: 'Aplicaciones corporativas adicionales (3–5)',
      description:
        'Diseño de 3 a 5 piezas corporativas adicionales a elegir: firma de email, plantilla de presentación, perfil de redes sociales, etc.',
      price: 0,
    },
  ],
  excludedItems: [
    'Costos de impresión y producción física de materiales',
    'Fotografía de producto o corporativa',
    'Diseño y desarrollo web',
    'Gestión de redes sociales',
    'Versiones animadas del logotipo o motion graphics',
    'Diseño de packaging o envases',
    'Estrategia de comunicación o plan de marketing',
    'Registro de marca ante organismos oficiales (recomendado al Cliente)',
    'Licencias de tipografías con costo (se usan tipografías libres o el Cliente provee las licencias)',
    'Rondas de revisión adicionales a las incluidas (USD $40 c/u)',
  ],
  contractTerms: [
    `CONTRATO DE DISEÑO DE IDENTIDAD CORPORATIVA — PLAN CORPORATE`,
    '',
    `Este documento constituye el acuerdo formal entre DualGrid (en adelante "el Prestador") y el Cliente identificado en la sección de partes, para la prestación de los servicios de diseño de identidad corporativa bajo el plan "Corporate".`,
    '',
    COMMON_PROJECT_SPECIFICATION,
    '',
    BRANDING_PAYMENT_CLAUSE,
    '',
    COMMON_REVISION_INTRO(2),
    '',
    COMMON_DELIVERY_CLAUSE,
    '',
    `BRIEF Y ESTRATEGIA DE MARCA: Antes del inicio del trabajo de diseño, el Cliente completará el cuestionario de branding. DualGrid realizará además una reunión de kick-off (30 min vía videollamada) para alinear visión, valores de marca, público objetivo y referencias visuales. El Cliente entiende que la claridad del brief es fundamental para el éxito del proyecto.`,
    '',
    `PRESENTACIÓN DE CONCEPTOS: Se presentarán 2 a 3 conceptos de dirección de marca en la primera fase. El Cliente seleccionará uno para desarrollar. La primera ronda de revisiones se aplica al concepto seleccionado; la segunda ronda aplica a los ajustes finales previos a la aprobación definitiva.`,
    '',
    `ARCHIVOS FINALES Y FUENTE: Los archivos en formatos de trabajo editables (AI, EPS, Figma) se entregan únicamente tras la recepción del pago total. Los archivos de uso final se entregan con el pago del saldo.`,
    '',
    `TIPOGRAFÍAS: Se utilizarán exclusivamente tipografías de uso libre (Google Fonts, Adobe Fonts u otras con licencia comercial gratuita) a menos que el Cliente provea licencias de tipografías específicas. DualGrid no se responsabiliza por problemas legales derivados del uso de tipografías sin la licencia correspondiente por parte del Cliente.`,
    '',
    COMMON_SCOPE_CHANGES,
    '',
    COMMON_OFFICIAL_COMMUNICATIONS,
    '',
    COMMON_WARRANTY,
    '',
    COMMON_INTELLECTUAL_PROPERTY,
    '',
    COMMON_CONFIDENTIALITY,
    '',
    COMMON_CANCELLATION,
    '',
    COMMON_LIMITATION_LIABILITY,
    '',
    COMMON_JURISDICTION,
    '',
    `ACEPTACIÓN: La firma de este contrato implica la aceptación plena y sin reservas de todas las condiciones aquí establecidas por ambas partes.`,
  ].join('\n'),
};

const GLOBAL_TEMPLATE: ContractTemplate = {
  planId: 'global',
  revisionsIncluded: 3,
  services: [
    {
      name: 'Arquitectura de marca y estrategia visual',
      description:
        'Documento de posicionamiento y plataforma de marca: propósito, valores, personalidad, voz y posicionamiento diferencial.',
      price: 0,
    },
    {
      name: 'Sistema de logotipo completo',
      description:
        'Logotipo principal con todas las variaciones necesarias para uso en medios digitales, impresos, nacionales e internacionales.',
      price: 0,
    },
    {
      name: 'Sistema de colores, tipografías y elementos gráficos',
      description:
        'Sistema visual completo: paleta primaria y secundaria, tipografías con jerarquía completa, iconografía, texturas y patrones.',
      price: 0,
    },
    {
      name: 'Manual de marca completo y exhaustivo',
      description:
        'Brand book de uso corporativo con todos los lineamientos de aplicación de la identidad en cualquier medio y formato.',
      price: 0,
    },
    {
      name: 'Suite de aplicaciones corporativas avanzadas (hasta 10)',
      description:
        'Diseño de hasta 10 piezas corporativas a seleccionar: papelería completa, señalética, uniformes, vehículos, packaging, presentaciones, stands, etc.',
      price: 0,
    },
    {
      name: 'Revisión y validación de la identidad',
      description:
        'Proceso de revisión cruzada de la identidad aplicada en distintos contextos para garantizar coherencia y funcionalidad a escala global.',
      price: 0,
    },
  ],
  excludedItems: [
    'Costos de impresión y producción física de materiales',
    'Fotografía corporativa o de producto',
    'Diseño y desarrollo web (cotizable como proyecto separado)',
    'Gestión activa de redes sociales',
    'Producción de video o animaciones (motion graphics)',
    'Registro de marca ante organismos oficiales en distintos países (recomendado, cotizable por separado)',
    'Licencias de tipografías con costo (se usan fuentes libres o el Cliente provee licencias)',
    'Más de 10 aplicaciones corporativas (cotizables por separado)',
    'Estrategia de medios pagados o campañas de publicidad',
    'Rondas de revisión adicionales a las incluidas (USD $60 c/u)',
  ],
  contractTerms: [
    `CONTRATO DE ARQUITECTURA DE MARCA E IDENTIDAD GLOBAL — PLAN GLOBAL`,
    '',
    `Este documento constituye el acuerdo formal entre DualGrid (en adelante "el Prestador") y el Cliente identificado en la sección de partes, para la prestación de los servicios de diseño de identidad de marca a escala global bajo el plan "Global".`,
    '',
    COMMON_PROJECT_SPECIFICATION,
    '',
    BRANDING_PAYMENT_CLAUSE,
    '',
    COMMON_REVISION_INTRO(3),
    '',
    COMMON_DELIVERY_CLAUSE,
    '',
    `ESTRUCTURA DEL PROYECTO: El proyecto se desarrollará en 3 fases claramente definidas: (1) Estrategia y diagnóstico de marca, (2) Desarrollo de identidad visual y sistema de diseño, (3) Aplicaciones y entregables finales. Cada fase requiere aprobación escrita del Cliente antes de avanzar a la siguiente.`,
    '',
    `KICK-OFF Y SESIONES DE TRABAJO: El plan incluye hasta 3 sesiones de trabajo colaborativo vía videollamada (1 hora cada una) distribuidas en las 3 fases del proyecto. Sesiones adicionales se cotizarán a USD $50/hora.`,
    '',
    `ARCHIVOS FINALES Y FUENTE: Los archivos en formatos de trabajo editables (AI, EPS, Figma, PSD) se entregan únicamente tras la recepción del pago total. DualGrid entregará los archivos organizados por categoría en una carpeta digital.`,
    '',
    `APLICACIONES CORPORATIVAS: El Cliente deberá indicar al inicio del proyecto las 10 aplicaciones corporativas que desea desarrollar. Cambios en la selección de aplicaciones después de iniciado su diseño se considerarán cambios de alcance.`,
    '',
    `PROPIEDAD EXCLUSIVA: Los diseños creados bajo este contrato son de uso exclusivo del Cliente una vez saldado el pago total. DualGrid garantiza que los entregables no serán vendidos, licenciados ni usados para otros clientes.`,
    '',
    `MARCA REGISTRADA: DualGrid recomienda enfáticamente al Cliente que proceda con el registro de la marca ante las autoridades competentes una vez aprobada la identidad. El proceso de registro no está incluido en este contrato y deberá gestionarse por separado.`,
    '',
    COMMON_SCOPE_CHANGES,
    '',
    COMMON_OFFICIAL_COMMUNICATIONS,
    '',
    COMMON_WARRANTY,
    '',
    COMMON_INTELLECTUAL_PROPERTY,
    '',
    COMMON_CONFIDENTIALITY,
    '',
    COMMON_CANCELLATION,
    '',
    COMMON_LIMITATION_LIABILITY,
    '',
    COMMON_JURISDICTION,
    '',
    `ACEPTACIÓN: La firma de este contrato implica la aceptación plena y sin reservas de todas las condiciones aquí establecidas por ambas partes.`,
  ].join('\n'),
};

// ─── Template map ─────────────────────────────────────────────────────────────

export const CONTRACT_TEMPLATES: Record<ContractPlanId, ContractTemplate> = {
  menu_qr: MENU_QR_TEMPLATE,
  landing: LANDING_TEMPLATE,
  blog: BLOG_TEMPLATE,
  portfolio: PORTFOLIO_TEMPLATE,
  restaurant: RESTAURANT_TEMPLATE,
  wp_business: WP_BUSINESS_TEMPLATE,
  ecommerce_store: ECOMMERCE_TEMPLATE,
  custom: CUSTOM_TEMPLATE,
  essential: ESSENTIAL_TEMPLATE,
  corporate: CORPORATE_TEMPLATE,
  global: GLOBAL_TEMPLATE,
};

export function getContractTemplate(planId: string): ContractTemplate | null {
  return CONTRACT_TEMPLATES[planId as ContractPlanId] ?? null;
}
