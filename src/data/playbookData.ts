export interface BundlePackage {
  id: string;
  name: string;
  modules: string[];
  idealProfile: string;
  individualPrice: number;
  bundlePrice: number;
  discountPct: number;
  bonus?: string;
}

export interface ModularService {
  name: string;
  capacity: string;
  monthlyPrice: number;
}

export interface CommissionSchema {
  code: string;
  name: string;
  contractTerms: string;
  commissionStructure: string;
}

export interface ColdEmailTemplate {
  id: string;
  module: string;
  subject: string;
  body: string;
}

export interface ObjectionItem {
  id: string;
  module: string;
  question: string;
  answer: string;
  criterion?: string;
}

export interface ModuleDetail {
  id: string;
  number: number;
  title: string;
  gancho: string;
  problema: string;
  solucion: string;
  pruebaSocial?: string;
  cta: string;
  emailTemplate: ColdEmailTemplate;
  objections: ObjectionItem[];
}

export interface AgencyService {
  name: string;
  setupCOP: number;
  feeCOP?: number;
  description: string;
}

export const BUNDLE_PACKAGES: BundlePackage[] = [
  {
    id: 'esencial',
    name: 'Paquete Esencial',
    modules: ['Levanna Vault', 'Levanna Meetings'],
    idealProfile: 'Arquitectos, ingenieros y directores de proyectos pequeños.',
    individualPrice: 372000,
    bundlePrice: 357120,
    discountPct: 4,
  },
  {
    id: 'pro',
    name: 'Paquete PRO',
    modules: ['Levanna Vault', 'Levanna Meetings', 'Levanna Access OR Expenses'],
    idealProfile: 'Proyectos de mediana escala buscando control puntual.',
    individualPrice: 572000,
    bundlePrice: 537680,
    discountPct: 6,
  },
  {
    id: 'pro_plus',
    name: 'Paquete PRO+',
    modules: ['Levanna Vault', 'Levanna Meetings', 'Levanna Access', 'Levanna Expenses'],
    idealProfile: 'Proyectos de mediana escala integrales operativamente.',
    individualPrice: 636000,
    bundlePrice: 585120,
    discountPct: 8,
  },
  {
    id: 'digital_control',
    name: 'Paquete Digital Control',
    modules: ['Levanna Vault', 'Levanna Meetings', 'Levanna Access', 'Levanna Expenses', 'Levanna Budget'],
    idealProfile: 'Medianas empresas enfocadas en control total operativo y financiero.',
    individualPrice: 900000,
    bundlePrice: 810000,
    discountPct: 10,
    bonus: '6 Meses Gratis Agente IA Levanna',
  },
  {
    id: 'integral',
    name: 'Paquete Integral',
    modules: ['Levanna Vault', 'Levanna Meetings', 'Levanna Access', 'Levanna Expenses', 'Levanna Budget', 'Levanna Tender'],
    idealProfile: 'Medianas y grandes empresas con múltiples frentes de trabajo y licitaciones.',
    individualPrice: 1308000,
    bundlePrice: 1151040,
    discountPct: 12,
    bonus: '1 Año Gratis Agente IA Levanna',
  },
];

export const MODULAR_PRICES: ModularService[] = [
  { name: 'Hub Web de Integración (Base)', capacity: 'Ilimitadas Consultas', monthlyPrice: 252000 },
  { name: 'Levanna Budget (Control Presupuestal)', capacity: 'Hasta 3 Proyectos Simultáneos', monthlyPrice: 264000 },
  { name: 'Levanna Vault (Bóveda Documental)', capacity: '250 GB de Almacenamiento Base', monthlyPrice: 224000 },
  { name: 'Levanna Access (Control de Accesos QR)', capacity: 'Hasta 1.500 Usuarios Activos', monthlyPrice: 200000 },
  { name: 'Levanna Tender (Módulo Licitaciones IA)', capacity: '15 Licitaciones / 2.000 Páginas al mes', monthlyPrice: 408000 },
  { name: 'Levanna Meetings (Asistente Reuniones IA)', capacity: '30 Horas de Procesamiento al mes', monthlyPrice: 148000 },
  { name: 'Levanna Expenses (Bot de Caja Menor)', capacity: '5 Usuarios / 500 Transacciones al mes', monthlyPrice: 64000 },
];

export const COMMISSION_SCHEMAS: CommissionSchema[] = [
  {
    code: 'LIQ-TRAD-01',
    name: 'Tradicional (Mes a Mes)',
    contractTerms: 'Sin permanencia obligatoria. Pago mensual recurrente.',
    commissionStructure: '20% en el Mes 1 + 10% mensual vitalicio mientras la cuenta continúe activa.',
  },
  {
    code: 'LIQ-ACEL-12',
    name: 'Acelerador (Anualizado)',
    contractTerms: 'Permanencia garantizada de 12 meses (facturación mensual).',
    commissionStructure: '50% en el Mes 1 + 10% mensual recurrente.',
  },
  {
    code: 'LIQ-PREP-15',
    name: 'Prepagado (Upfront)',
    contractTerms: 'Contrato anual cerrado con pago total anticipado (se puede ofrecer 2 meses gratis).',
    commissionStructure: '15% de Pago Único sobre el valor total cobrado (sin recurrencia).',
  },
  {
    code: 'LIQ-AGEN-UNI',
    name: 'Agencia / Setup',
    contractTerms: 'Servicios de desarrollo a medida o setup inicial de software.',
    commissionStructure: '15% de Comisión Única sobre el valor del setup cobrado.',
  },
  {
    code: 'LIQ-ACEL-12-MULTI',
    name: 'Bono Multiplicador (Ecosistema)',
    contractTerms: 'Cierre de cliente con 2 o más módulos bajo el escenario Acelerador (LIQ-ACEL-12).',
    commissionStructure: 'La comisión del Mes 1 sube al 60% (en lugar del 50%).',
  },
];

export const FATHOM_COMPARISON: ObjectionItem[] = [
  {
    id: 'fathom-1',
    module: 'Levanna Meetings',
    criterion: 'Modelo de Costos / Precio',
    question: 'Ya uso Fathom o Otter y es gratis / más barato.',
    answer: 'Costos por Bloque Corporativo vs Cobro en USD por Usuario: Fathom es excelente para uso personal. Sin embargo, al implementarlo en un equipo de 10 o 20 ingenieros, te cobrarán una licencia individual en dólares por cada usuario (aprox. $600.000 COP/mes). Levanna no cobra por usuario; entregamos bloques de horas compartidas para toda la empresa a una fracción del costo.',
  },
  {
    id: 'fathom-2',
    module: 'Levanna Meetings',
    criterion: 'Seguridad y Hábeas Data (Soberanía)',
    question: 'Prefiero pagar la licencia en dólares de Fathom o Otter.',
    answer: 'Soberanía de Datos vs Entrenamiento de Modelos Públicos: El verdadero riesgo no es la tarifa, sino la privacidad. Las aplicaciones gratuitas o extranjeras almacenan tus audios y actas estratégicas en servidores públicos para entrenar sus modelos de IA. En Levanna garantizamos Soberanía de Datos: los audios son strictly volátiles (se eliminan tras procesarse) y las actas quedan custodiadas en tu Bóveda Documental privada.',
  },
  {
    id: 'fathom-3',
    module: 'Levanna Meetings',
    criterion: 'Diferenciador Operativo',
    question: 'Fathom me envía el resumen de la reunión al correo.',
    answer: 'Panel de Seguimiento Operativo vs Correo Estático: Un resumen que llega al correo se pierde en la bandeja de entrada. Levanna extrae las tareas del comité y las inyecta en un Panel de Seguimiento Operativo interactivo con responsables y fechas límite. Transformamos una conversación en un flujo de trabajo ejecutable.',
  },
  {
    id: 'fathom-4',
    module: 'Levanna Meetings',
    criterion: 'Almacenamiento de Audios',
    question: '¿El asistente guarda las grabaciones de audio para siempre?',
    answer: 'Política de Audios Volátiles: Por privacidad y eficiencia, el audio se elimina permanentemente una vez procesado por la IA. El acta ejecutiva resultante se transfiere automáticamente a Levanna Vault para su consulta legal a largo plazo.',
  },
  {
    id: 'fathom-5',
    module: 'Levanna Meetings',
    criterion: 'Gestión de Agendas',
    question: '¿El asistente puede reservarme salas o enviar invitaciones de Calendar?',
    answer: 'Enfoque en Productividad: No es un gestor de agendas ni reserva salas físicas. Su propósito exclusivo es la captura de información, transcripción precisa, generación de actas y trazabilidad de compromisos.',
  },
];

export const MODULE_DETAILS: ModuleDetail[] = [
  {
    id: 'levanna-access',
    number: 1,
    title: 'Levanna Access (Control de Accesos QR)',
    gancho: '¿Tu obra se detiene cuando la señal de celular falla o los sistemas biométricos tradicionales se dañan? ¿Sabías que no justificar por escrito el exceso de horas extras te expone a sanciones de la Ley 2101 frente al Ministerio de Trabajo?',
    problema: 'Las bitácoras en papel y la biometría por huella en obra son lentas, fallan con el polvo/lluvia y no auditan el cumplimiento de ARL ni los recargos de horas extras.',
    solucion: 'Levanna Access utiliza lectura de QR dinámicos realizada estrictamente por el supervisor (in-situ geolocalizado), con arquitectura Offline-First. Además, incluye firma digital de Hábeas Data previa al código y un panel exclusivo de aprobación y justificación escrita obligatoria de Horas Extras (Ley 2101).',
    pruebaSocial: 'Eliminamos el descontrol del Excel en proyectos de alta rotación, blindando a la constructora frente a demandas laborales.',
    cta: 'Agenda 10 minutos para una demostración técnica y digitaliza el acceso de tu obra hoy.',
    emailTemplate: {
      id: 'email-access',
      module: 'Levanna Access',
      subject: 'Elimina los cuellos de botella y blindate en la entrada de {{Nombre_Empresa}}',
      body: `Hola {{Nombre_Prospecto}},

Noté que en el sector de la construcción, empresas como {{Nombre_Empresa}} sufren retrasos en puerta y riesgos legales severos por el uso de bitácoras físicas o biometría tradicional que falla en campo.

En Levanna DC, implementamos Levanna Access: un sistema de control de ingresos sin contacto mediante códigos QR dinámicos leídos por el supervisor con arquitectura Offline-First (opera 100% sin internet). Además, audita el vencimiento de ARL e incorpora la justificación escrita obligatoria de horas extras exigida por la Ley 2101.

Elige un espacio de 10 minutos en mi agenda para mostrarte la plataforma en vivo: {{Tu_Link_de_Cal.com}}

Saludos,

{{Tu_Nombre}}
Equipo Comercial | Levanna DC`,
    },
    objections: [
      {
        id: 'access-1',
        module: 'Levanna Access',
        question: '¿Qué pasa si la obra está en una zona rural sin internet?',
        answer: 'El sistema está diseñado para la realidad de campo con arquitectura Offline-First. El celular del supervisor guarda los registros con sello de tiempo inmutable y los sincroniza automáticamente en cuanto detecta cualquier red.',
      },
      {
        id: 'access-2',
        module: 'Levanna Access',
        question: '¿Tengo que comprar torniquetes o sensores biométricos?',
        answer: 'En absoluto. El sistema funciona con lectura de QR dinámicos desde cualquier smartphone económico del supervisor. Esto elimina costos de infraestructura, cableado y mantenimiento.',
      },
      {
        id: 'access-3',
        module: 'Levanna Access',
        question: '¿Me cobran por cada empleado registrado?',
        answer: 'No cobramos por cabeza individual. Vendemos bloques de capacidad (ej. hasta 1.500 usuarios activos), lo que optimiza tus costos fijos.',
      },
      {
        id: 'access-4',
        module: 'Levanna Access',
        question: '¿Cómo me ayuda con la Ley 2101 de reducción de jornada y horas extras?',
        answer: 'Calcula automáticamente horas ordinarias y suplementarias según la jornada configurada. Si se supera el tope, el sistema obliga al director de obra a redactar una justificación por escrito, generando el soporte legal probatorio para cualquier auditoría del Ministerio de Trabajo.',
      },
    ],
  },
  {
    id: 'levanna-budget',
    number: 2,
    title: 'Levanna Budget (Control Presupuestal y Alertas - EVM + IA)',
    gancho: '¿Te enteras de que tu proyecto se desfasó en presupuesto cuando ya es demasiado tarde para corregir?',
    problema: 'El control financiero tradicional en Excel muestra datos del pasado. No calcula el valor ganado ni prevé cómo las horas extras en obra destruyen el margen del proyecto.',
    solucion: 'Levanna Budget aplica la metodología EVM (Earned Value Management) calculando en tiempo real el CPI (Índice de Desempeño de Costo) y SPI (Cronograma). Su Motor Predictivo con IA se conecta a Levanna Access: al detectar picos de horas extras en campo, penaliza automáticamente la proyección del costo final (EAC) por recargos y fatiga laboral, disparando alertas tempranas.',
    pruebaSocial: 'Permitimos a directores financieros tomar decisiones preventivas semanas antes de la liquidación de corte.',
    cta: 'Agenda 10 minutos y conoce el motor predictivo que protege la rentabilidad de tus proyectos.',
    emailTemplate: {
      id: 'email-budget',
      module: 'Levanna Budget',
      subject: 'Alertas tempranas de sobrecosto y EVM para los proyectos de {{Nombre_Empresa}}',
      body: `Hola {{Nombre_Prospecto}},

La mayoría de constructoras descubren los sobrecostos financieros cuando los cortes de nómina y proveedores ya se han ejecutado.

En Levanna DC, desarrollamos Levanna Budget: un módulo de control presupuestal basado en Valor Ganado (EVM) con un Motor Predictivo impulsado por IA. Nuestro algoritmo se conecta con el Control de Accesos en obra y, al detectar sobrecargas de horas extras, recalcula inmediatamente la proyección de costo al finalizar (EAC), alertándote antes de que el margen se destruya.

Elige un espacio de 10 minutos en mi agenda para ver una simulación predictiva: {{Tu_Link_de_Cal.com}}

Saludos,

{{Tu_Nombre}}
Equipo Comercial | Levanna DC`,
    },
    objections: [
      {
        id: 'budget-1',
        module: 'Levanna Budget',
        question: '¿Esto reemplaza a un ERP contable complejo como SAP o Siigo?',
        answer: 'No es un ERP contable ni tributario. Es una herramienta ágil de control operativo y financiero de proyectos basada en metodología EVM, pensada para que los directores de obra y finanzas tengan visibilidad del margen real en tiempo real.',
      },
      {
        id: 'budget-2',
        module: 'Levanna Budget',
        question: '¿Cómo funciona la integración con el Control de Accesos?',
        answer: 'Es una sinergia nativa del ecosistema Levanna. Levanna Access reporta las horas laboradas en campo. Si el algoritmo detecta un incremento inusual de horas extras, Levanna Budget proyecta el sobrecosto por recargos y penaliza el indicador EAC de inmediato.',
      },
    ],
  },
  {
    id: 'levanna-expenses',
    number: 3,
    title: 'Levanna Expenses (Bot de Caja Menor con IA)',
    gancho: '¿Cuántas horas a la semana pierde tu equipo contable persiguiendo recibos arrugados o digitando facturas manualmente?',
    problema: 'La pérdida de soportes físicos de caja menor causa desajustes contables y fricción con el personal operativo.',
    solucion: 'Levanna Expenses es un Bot con Inteligencia Artificial. El empleado toma una foto del recibo desde su celular; la IA extrae proveedor, fecha, monto exacto y NIT, enviando la legalización al dashboard de tesorería y archivando el respaldo automáticamente en Levanna Vault.',
    pruebaSocial: 'Automatizamos la auditoría de caja menor eliminando el 100% de la digitación manual.',
    cta: 'Agenda 10 minutos y te muestro cómo auditar tus gastos de campo en tiempo real.',
    emailTemplate: {
      id: 'email-expenses',
      module: 'Levanna Expenses',
      subject: 'Cero digitación manual en la caja menor de {{Nombre_Empresa}}',
      body: `Hola {{Nombre_Prospecto}},

¿Cuántas facturas arrugadas y recibos de campo pierde mensualmente el equipo de {{Nombre_Empresa}}?

En Levanna DC, implementamos Levanna Expenses: un Bot con Inteligencia Artificial que lee facturas mediante OCR instantáneo. Tus empleados envían una foto del recibo, la IA extrae los datos clave (NIT, fecha, monto) y los envía al panel de tesorería, guardando la imagen en la Bóveda Documental.

Agendemos 10 minutos para mostrarte cómo funciona: {{Tu_Link_de_Cal.com}}

Saludos,

{{Tu_Nombre}}
Equipo Comercial | Levanna DC`,
    },
    objections: [
      {
        id: 'expenses-1',
        module: 'Levanna Expenses',
        question: '¿Se conecta directamente con mi banco para hacer giros automáticos?',
        answer: 'No realiza dispersión bancaria ni transferencias directas. Su enfoque es el control interno, la auditoría mediante OCR, la inmutabilidad de los soportes y el archivo automático en la Bóveda Documental.',
      },
    ],
  },
  {
    id: 'levanna-vault',
    number: 4,
    title: 'Levanna Vault (Bóveda Documental)',
    gancho: '¿Tu empresa pierde tiempo valioso buscando contratos, actas o soportes contables en carpetas locales desorganizadas?',
    problema: 'La dispersión de documentos en correos y computadores expone a la empresa a pérdidas de información y sanciones en auditorías.',
    solucion: 'Levanna Vault es el receptáculo inteligente centralizado de Levanna DC. Recibe automáticamente las actas de Levanna Meetings, los soportes de Levanna Expenses, los reportes de nómina de Levanna Access y los consentimientos de Hábeas Data. Cuenta con un buscador avanzado por palabras clave.',
    cta: 'Agenda 10 minutos y centraliza la memoria documental de tu empresa.',
    emailTemplate: {
      id: 'email-vault',
      module: 'Levanna Vault',
      subject: 'Centraliza y protege la documentación crítica de {{Nombre_Empresa}}',
      body: `Hola {{Nombre_Prospecto}},

El desorden documental en carpetas locales o correos es una bomba de tiempo ante auditorías o requerimientos legales.

En Levanna DC, creamos Levanna Vault: un repositorio inteligente que centraliza automáticamente los documentos generados por la operación (actas, facturas, contratos y registros de nómina), permitiéndote encontrar cualquier soporte en segundos gracias a su buscador por palabras clave.

Agenda un espacio de 10 minutos para conocer la Bóveda: {{Tu_Link_de_Cal.com}}

Saludos,

{{Tu_Nombre}}
Equipo Comercial | Levanna DC`,
    },
    objections: [
      {
        id: 'vault-1',
        module: 'Levanna Vault',
        question: '¿Es como Google Docs o Word Online para editar documentos?',
        answer: 'No es un editor colaborativo. Su núcleo es la custodia probatoria, la categorización estructurada y la disponibilidad inmediata para auditorías.',
      },
      {
        id: 'vault-2',
        module: 'Levanna Vault',
        question: '¿Qué pasa si superamos los 250 GB base?',
        answer: 'El sistema incluye un termómetro de consumo en tiempo real. Si requieres más almacenamiento, puedes adquirir bloques adicionales de expansión sin interrumpir la operación.',
      },
    ],
  },
  {
    id: 'levanna-meetings',
    number: 5,
    title: 'Levanna Meetings (Asistente de Reuniones con IA)',
    gancho: '¿Tus comités de obra o reuniones directivas terminan sin compromisos claros ni responsables asignados?',
    problema: 'Las actas redactadas a mano son imprecisas, toman horas y las tareas se olvidan a los pocos días.',
    solucion: 'Levanna Meetings graba y transcribe el audio con IA de alta precisión, genera actas ejecutivas automáticas y extrae los compromisos en un Panel de Seguimiento Operativo con fechas y responsables, transfiriendo el acta final a Levanna Vault.',
    cta: 'Agenda 10 minutos para automatizar tus actas de reunión hoy.',
    emailTemplate: {
      id: 'email-meetings',
      module: 'Levanna Meetings',
      subject: 'Actas ejecutivas y seguimiento de compromisos automático para {{Nombre_Empresa}}',
      body: `Hola {{Nombre_Prospecto}},

Las reuniones sin seguimiento representan una fuga silenciosa de dinero y tiempo operativo en empresas como {{Nombre_Empresa}}.

En Levanna DC, implementamos Levanna Meetings: nuestro asistente de Inteligencia Artificial que procesa el audio de tus comités, genera el acta ejecutiva estructurada y crea un panel interactivo con las tareas y responsables asignados. Además, el acta se archiva automáticamente en tu Bóveda Documental.

Reserva 10 minutos aquí y te muestro un ejemplo en vivo: {{Tu_Link_de_Cal.com}}

Saludos,

{{Tu_Nombre}}
Equipo Comercial | Levanna DC`,
    },
    objections: FATHOM_COMPARISON,
  },
  {
    id: 'levanna-tender',
    number: 6,
    title: 'Levanna Tender (Módulo de Licitaciones con IA)',
    gancho: '¿Tu equipo invierte semanas enteras leyendo pliegos de licitación de cientos de páginas para saber si cumplen o no?',
    problema: 'El análisis manual de pliegos de condiciones consume tiempo valioso y corren el riesgo de pasar por alto requisitos habilitantes o cláusulas penales.',
    solucion: 'Levanna Tender procesa documentos extensos en PDF (hasta 2.000 páginas/mes en plan estándar), analizando pliegos y extrayendo en minutos los requisitos habilitantes, fechas límite, garantías y riesgos contractuales.',
    cta: 'Agenda 10 minutos y analiza licitaciones en minutos, no en días.',
    emailTemplate: {
      id: 'email-tender',
      module: 'Levanna Tender',
      subject: 'Análisis automático de pliegos de licitación para {{Nombre_Empresa}}',
      body: `Hola {{Nombre_Prospecto}},

Analizar pliegos de condiciones de más de 300 páginas es uno de los procesos más desgastantes para el equipo de licitaciones de {{Nombre_Empresa}}.

En Levanna DC, desarrollamos Levanna Tender: una herramienta de IA especializada en licitaciones que lee pliegos en PDF y extrae instantáneamente los requisitos técnicos, financieros, jurídicos y fechas clave en un resumen ejecutivo.

Elige 10 minutos en mi agenda para probarlo con uno de tus pliegos actuales: {{Tu_Link_de_Cal.com}}

Saludos,

{{Tu_Nombre}}
Equipo Comercial | Levanna DC`,
    },
    objections: [
      {
        id: 'tender-1',
        module: 'Levanna Tender',
        question: '¿El módulo redacta la propuesta técnica final o sube la propuesta al SECOP?',
        answer: 'No redacta la propuesta ni realiza la postulación en plataformas gubernamentales. Su función es el análisis ultrarrápido del pliego para identificar viabilidad, riesgos y requisitos habilitantes.',
      },
    ],
  },
];

export const AGENCY_SERVICES: AgencyService[] = [
  {
    name: 'Landing Page de Alta Conversión',
    setupCOP: 999000,
    description: 'Páginas web corporativas One-Page ultra-optimizadas para móviles. Captan leads 24/7 e incluyen Políticas de Privacidad y Hábeas Data integradas nativamente para evitar multas.',
  },
  {
    name: 'Asistente Virtual por WhatsApp 24/7',
    setupCOP: 590000,
    feeCOP: 59000,
    description: 'Bot inteligente conectado a la API Oficial de WhatsApp. Responde preguntas frecuentes, captura datos de prospectos 24/7 y deriva a asesores humanos ante intenciones de compra.',
  },
  {
    name: 'Automatización a Medida (n8n)',
    setupCOP: 2350000,
    description: 'Creación de flujos de trabajo automatizados (ej. generación automática de cotizaciones en PDF, sincronización de bases de datos y conexión a la Bóveda Documental).',
  },
];
