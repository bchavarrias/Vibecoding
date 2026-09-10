// ============================================================
// Vibecoding · config.js
// ------------------------------------------------------------
// Chavarría's Org — recordatorios de tareas vía Google Classroom
// Publicación producción: 2026-09-10
// ============================================================

const config = {
  app: {
    name: "Chavarría's Org",
    description:
      "Gestiona recordatorios de tareas pendientes al celular de los alumnos, vinculados con Google Classroom.",
    domain: "chavarrias-org.com",
    locale: "es",
    defaultUrl: "http://localhost:3000",
  },

  brand: {
    primary: "#10B981",
    logoText: "Chavarría's Org",
    logoSrc: null,
    utchLogoSrc: "/utch-logo.svg",
    tagline: "Recordatorios inteligentes · UTCH",
    radius: "1rem",
  },

  academico: {
    cuatrimestresTotal: 10,
    maxMateriasPorCuatrimestre: 5,
    periodos: [
      { id: 1, label: "Ene–Abr", meses: "enero a abril" },
      { id: 2, label: "May–Ago", meses: "mayo a agosto" },
      { id: 3, label: "Sep–Dic", meses: "septiembre a diciembre" },
    ],
  },

  features: {
    waitlist: true,
    googleAuth: true,
    emailLogin: false,
    aiChat: false,
    toolUse: false,
    agents: false,
    resend: true,
    pricing: false,
    paypal: false,
    adminPanel: true,
    classroom: true,
    structuredTareas: true,
  },

  payment: {
    paypalMeUsername: "",
    defaultAmount: 0,
    currency: "USD",
    buttonText: "Pagar con PayPal",
  },

  ai: {
    chatModel: "gpt-4o-mini",
    structuredModel: "gpt-4o-mini",
    agentModel: "gpt-4o",
    maxTokens: 1500,
    temperature: 0.4,
  },

  email: {
    from: "Chavarría's Org <onboarding@resend.dev>",
    replyTo: "hola@chavarrias-org.com",
    supportEmail: "soporte@chavarrias-org.com",
  },

  auth: {
    loginUrl: "/login",
    afterLoginUrl: "/dashboard",
    afterLogoutUrl: "/",
    providers: ["google"],
  },

  dashboard: {
    nav: {
      inicio: "Inicio",
      alumnos: "Alumnos",
      materias: "Materias",
      inscripciones: "Inscripciones",
      tareas: "Tareas",
      classroom: "Classroom",
    },
    inicio: {
      pageTitle: "Panel principal",
      subtitle:
        "Administra alumnos, materias e inscripciones. Los recordatorios llegan al celular vinculados con Google Classroom.",
    },
    alumnos: {
      navLabel: "Alumnos",
      pageTitle: "Registro de alumnos",
      subtitle:
        "Captura nombre, correo y celular para enviar recordatorios de tareas pendientes.",
      form: {
        title: "Nuevo alumno",
        nombre: { label: "Nombre del alumno", placeholder: "Ej. Ana García López" },
        celular: { label: "Celular", placeholder: "Ej. 6141234567" },
        correo: { label: "Correo", placeholder: "Ej. ana@uni.edu.mx" },
        submit: "Registrar alumno",
      },
      list: {
        title: "Alumnos registrados",
        empty: "Aún no hay alumnos. Registra el primero arriba.",
        error: "No pudimos cargar los alumnos",
        columns: {
          nombre: "Nombre",
          celular: "Celular",
          correo: "Correo",
        },
        edit: "Editar",
        save: "Guardar",
        cancel: "Cancelar",
        delete: "Eliminar",
      },
    },
    materias: {
      pageTitle: "Materias",
      subtitle: "Registra las materias de la carrera (10 cuatrimestres · máx. 5 por periodo).",
      form: {
        title: "Nueva materia",
        nombre: { label: "Nombre de la materia", placeholder: "Ej. Programación Web" },
        codigo: { label: "Código (opcional)", placeholder: "Ej. PW-401" },
        submit: "Registrar materia",
      },
      list: {
        title: "Materias registradas",
        empty: "No hay materias registradas.",
        error: "No pudimos cargar las materias",
        columns: {
          nombre: "Materia",
          codigo: "Código",
          classroom: "Google Classroom",
        },
        edit: "Editar",
        save: "Guardar",
        cancel: "Cancelar",
        delete: "Eliminar",
        sinClassroom: "Sin vincular",
      },
    },
    inscripciones: {
      pageTitle: "Inscripciones",
      subtitle:
        "Asigna materias a cada alumno por cuatrimestre (máximo 5 materias por cuatrimestre).",
      form: {
        title: "Inscribir alumno en materia",
        alumno: { label: "Alumno" },
        materia: { label: "Materia" },
        cuatrimestre: { label: "Cuatrimestre (1–10)" },
        anio: { label: "Año" },
        periodo: { label: "Periodo" },
        submit: "Inscribir",
      },
      list: {
        title: "Inscripciones activas",
        empty: "No hay inscripciones. Asigna materias a tus alumnos.",
        error: "No pudimos cargar las inscripciones",
        maxError: "Este alumno ya tiene 5 materias en ese cuatrimestre.",
        columns: {
          alumno: "Alumno",
          materia: "Materia",
          cuatrimestre: "Cuatrimestre",
          periodo: "Periodo",
        },
        delete: "Quitar inscripción",
      },
    },
    tareas: {
      pageTitle: "Tareas y recordatorios",
      subtitle:
        "Tareas pendientes vinculadas a Google Classroom. Se envían avisos al celular del alumno.",
      form: {
        title: "Nueva tarea",
        alumno: { label: "Alumno" },
        materia: { label: "Materia (opcional)" },
        titulo: { label: "Título de la tarea", placeholder: "Ej. Entrega proyecto final" },
        descripcion: { label: "Descripción (opcional)", placeholder: "Detalles de la entrega" },
        fecha: { label: "Fecha límite" },
        submit: "Agregar tarea",
      },
      list: {
        title: "Tareas pendientes",
        empty: "No hay tareas registradas. Sincroniza Classroom o agrega una manualmente.",
        error: "No pudimos cargar las tareas",
        columns: {
          titulo: "Tarea",
          alumno: "Alumno",
          materia: "Materia",
          fecha: "Entrega",
          recordatorio: "Recordatorio",
        },
        enviado: "Enviado",
        pendiente: "Pendiente",
        delete: "Eliminar",
        sync: "Sincronizar Classroom",
      },
      parseAviso: {
        title: "Pegar aviso de Classroom",
        placeholder:
          "Copia aquí el aviso de Classroom, correo del profesor o mensaje del grupo…",
        button: "Extraer con IA",
        loading: "Analizando aviso…",
        success: "Campos listos — revisa y guarda.",
        error: "No pudimos leer el aviso.",
        noKey: "Agrega OPENAI_API_KEY en .env.local para usar la extracción con IA.",
      },
    },
    classroom: {
      pageTitle: "Google Classroom",
      subtitle:
        "Conecta tu cuenta de Google para importar cursos y tareas automáticamente.",
      connect: "Conectar Google Classroom",
      sync: "Sincronizar ahora",
      connected: "Classroom conectado",
      disconnected: "Classroom no conectado",
      syncHint:
        "Importa cursos activos como materias y tareas con fecha límite como recordatorios al celular de alumnos inscritos.",
    },
  },

  landing: {
    nav: [
      { label: "Características", href: "#features" },
      { label: "Cómo funciona", href: "#how" },
      { label: "Preguntas", href: "#faq" },
    ],
    hero: {
      eyebrow: "UTCH · Estudiantes universitarios",
      title: "Tus tareas de Classroom, directo a tu celular",
      subtitle:
        "Chavarría's Org te avisa antes de cada entrega para que nunca se te pase una tarea pendiente.",
      cta: { label: "Empezar gratis", href: "/login" },
      ctaSecondary: { label: "Ver cómo funciona", href: "#how" },
    },
    problem: {
      eyebrow: "El problema",
      title: "Entre clases, trabajos y redes, las fechas límite se pierden.",
      subtitle:
        "Google Classroom tiene las tareas, pero nadie te recuerda a tiempo en el canal que sí revisas: tu celular.",
      items: [
        {
          icon: "Clock",
          title: "Entregas de último minuto",
          body: "Te enteras del examen o proyecto el día anterior — o peor, cuando ya cerró la entrega.",
        },
        {
          icon: "Smartphone",
          title: "El celular manda",
          body: "Revisas WhatsApp todo el día, pero Classroom queda enterrado entre correos y notificaciones.",
        },
        {
          icon: "BookOpen",
          title: "Demasiadas materias",
          body: "Hasta 5 materias por cuatrimestre, 10 cuatrimestres de carrera — imposible llevarlo en la cabeza.",
        },
      ],
    },
    features: {
      eyebrow: "Características",
      title: "Todo lo que necesitas para no olvidar una entrega.",
      subtitle: "Diseñado para alumnos de la UTCH y cualquier universidad con Google Classroom.",
      items: [
        {
          icon: "BellRing",
          title: "Recordatorios al celular",
          body: "Avisos automáticos días antes de cada fecha límite, al número que registres.",
        },
        {
          icon: "GraduationCap",
          title: "Vinculado con Classroom",
          body: "Importa cursos y tareas desde Google Classroom sin copiar fechas a mano.",
        },
        {
          icon: "Layers",
          title: "Materias por cuatrimestre",
          body: "Organiza hasta 5 materias por cuatrimestre en los 10 cuatrimestres de tu carrera.",
        },
      ],
    },
    faq: {
      eyebrow: "Preguntas frecuentes",
      title: "Lo que preguntan antes de registrarse.",
      items: [
        {
          q: "¿Cuántas materias puedo registrar por cuatrimestre?",
          a: "Máximo 5 materias por cuatrimestre, alineado con la carga académica típica de la carrera.",
        },
        {
          q: "¿Cómo se vincula con Google Classroom?",
          a: "Conectas tu cuenta de Google y sincronizamos los cursos y tareas. Los recordatorios se programan al celular del alumno.",
        },
        {
          q: "¿Cuánto dura un cuatrimestre?",
          a: "4 meses: enero–abril (1°), mayo–agosto (2°) o septiembre–diciembre (3°). La carrera completa son 10 cuatrimestres.",
        },
        {
          q: "¿Es gratis?",
          a: "Sí, puedes registrar alumnos, materias e inscripciones sin costo. Los recordatorios al celular están incluidos.",
        },
      ],
    },
    finalCta: {
      eyebrow: "Empieza hoy",
      title: "Organiza tu cuatrimestre sin estrés.",
      subtitle: "Regístrate con Google, agrega tus materias y deja que los recordatorios trabajen por ti.",
      cta: { label: "Entrar con Google", href: "/login" },
      ctaSecondary: { label: "Unirme a la lista", href: "#waitlist" },
    },
    waitlist: {
      eyebrow: "Lista de espera",
      title: "Sé de los primeros en probarlo.",
      subtitle: "Déjanos tu correo y te avisamos cuando abramos nuevas plazas.",
      successMessage: "¡Listo! Te contactamos pronto.",
      buttonLabel: "Quiero acceso",
      placeholder: "tu@email.com",
    },
    footer: {
      tagline: "Chavarría's Org · Recordatorios académicos en alianza con la UTCH.",
      columns: [
        {
          title: "Producto",
          links: [
            { label: "Características", href: "#features" },
            { label: "Cómo funciona", href: "#how" },
            { label: "Preguntas", href: "#faq" },
          ],
        },
        {
          title: "Plataforma",
          links: [
            { label: "Entrar", href: "/login" },
            { label: "Panel", href: "/dashboard" },
          ],
        },
        {
          title: "Universidad",
          links: [
            { label: "UTCH", href: "https://utch.edu.mx", external: true },
          ],
        },
      ],
      links: [
        { label: "Entrar", href: "/login" },
        { label: "UTCH", href: "https://utch.edu.mx", external: true },
      ],
    },
  },

  pricing: {
    eyebrow: "Precios",
    title: "Gratis para estudiantes.",
    subtitle: "Sin planes de pago por ahora.",
    plans: [],
  },
}

export default config
