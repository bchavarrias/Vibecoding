// ============================================================
// Vibecoding · config.js
// ------------------------------------------------------------
// ESTE ES EL ARCHIVO MÁS IMPORTANTE DEL BOILERPLATE.
// Todo el branding, copy, features y configuración del producto vive aquí.
// Cambiar este archivo cambia el producto entero — sin abrir JSX.
//
// Estructura:
//   - app:      identidad del producto (nombre, descripción, dominio, color)
//   - features: toggles para encender/apagar funcionalidades
//   - ai:       configuración de OpenAI
//   - email:    configuración de Resend
//   - auth:     providers habilitados
//   - landing:  copy de la página pública
//   - pricing:  planes (si features.pricing está activo; el cobro real es features.paypal)
//
// Tip Sem 1: empieza editando `app` y `landing.hero` con los datos de tu producto.
// ============================================================

const config = {
  // -----------------------------------------------------------
  // Identidad del producto
  // -----------------------------------------------------------
  app: {
    name: "EntregaAlert",
    description:
      "Registra tus cursos de Moodle y recibe avisos antes de cada entrega para que nunca se te pase una tarea.",
    domain: "entregalert.com", // sin https://, sin www
    locale: "es", // "es" | "en"
    // URL pública: usa NEXT_PUBLIC_APP_URL en .env. En este config solo definimos el default.
    defaultUrl: "http://localhost:3000",
  },

  // -----------------------------------------------------------
  // Identidad visual
  // -----------------------------------------------------------
  brand: {
    // Color primario en HEX. DaisyUI lo aplica como --color-primary via theme.
    primary: "#6366F1", // indigo — confianza + energía universitaria
    // Logo: puede ser texto o ruta a /public/logo.svg
    logoText: "Vibecoding - El futuro de la IA",
    logoSrc: null,
    // Estilo del bordeado global (DaisyUI usa esto para botones, cards)
    radius: "1rem",
  },

  // -----------------------------------------------------------
  // Toggles de features — encienden/apagan rutas y componentes
  // -----------------------------------------------------------
  features: {
    waitlist: true, // Captura emails en landing — Sem 1
    googleAuth: true, // Login con Google — Sem 2
    emailLogin: false, // Magic link email — opcional
    aiChat: true, // Chat AI en /chat — Sem 3
    toolUse: true, // Tool use registry — Sem 4
    agents: true, // LangGraph agents — Sem 5 (opcional-avanzado)
    resend: true, // Email — Sem 1+
    pricing: true, // Muestra la sección de precios en la landing (vitrina; el cobro real es `paypal`)
    paypal: false, // Botón PayPal.me en Pricing (configura `payment` abajo)
    adminPanel: true, // Panel /admin de leads (waitlist) — requiere ADMIN_PASSWORD en .env.local
  },

  // -----------------------------------------------------------
  // PayPal.me (si features.paypal está activo)
  // -----------------------------------------------------------
  payment: {
    paypalMeUsername: "", // tu usuario de https://paypal.me (sin @ ni URL)
    defaultAmount: 0, // 0 = el comprador elige el monto
    currency: "USD",
    buttonText: "Pagar con PayPal",
  },

  // -----------------------------------------------------------
  // OpenAI
  // -----------------------------------------------------------
  ai: {
    chatModel: "gpt-4o-mini", // default barato y rápido
    structuredModel: "gpt-4o-mini",
    agentModel: "gpt-4o", // los agentes razonan mejor con full gpt-4o
    maxTokens: 1500,
    temperature: 0.4,
  },

  // -----------------------------------------------------------
  // Resend (email transaccional)
  // -----------------------------------------------------------
  email: {
    // Asegúrate de tener el dominio verificado en Resend antes de cambiar `from`.
    // En desarrollo Resend permite enviar a tu propio correo desde `onboarding@resend.dev`.
    from: "Vibecoding <onboarding@resend.dev>",
    replyTo: "hola@vibecoding.dev",
    supportEmail: "soporte@vibecoding.dev",
  },

  // -----------------------------------------------------------
  // Auth providers
  // -----------------------------------------------------------
  auth: {
    loginUrl: "/login",
    afterLoginUrl: "/dashboard",
    afterLogoutUrl: "/",
    providers: ["google"], // se sincroniza con features.googleAuth / emailLogin
  },

  // -----------------------------------------------------------
  // Dashboard — registro de alumnos (core_items)
  // -----------------------------------------------------------
  dashboard: {
    alumnos: {
      navLabel: "Alumnos",
      pageTitle: "Mis alumnos",
      subtitle:
        "Registra y actualiza los datos de contacto de cada alumno para enviarle avisos de tareas en Moodle.",
      form: {
        title: "Registrar alumno",
        nombre: { label: "Nombre del alumno", placeholder: "Ej. Ana García López" },
        telefono: { label: "Teléfono", placeholder: "Ej. 6141234567" },
        correo: { label: "Correo", placeholder: "Ej. ana@uni.edu.mx" },
        submit: "Registrar alumno",
      },
      list: {
        title: "Alumnos registrados",
        empty: "Aún no hay alumnos registrados. Agrega el primero con el formulario de arriba.",
        error: "No pudimos cargar los alumnos",
        columns: {
          nombre: "Nombre del alumno",
          telefono: "Teléfono",
          correo: "Correo",
        },
        edit: "Editar",
        save: "Guardar cambios",
        cancel: "Cancelar",
        delete: "Eliminar",
      },
    },
  },

  // -----------------------------------------------------------
  // Landing — todo el copy de la página pública
  // -----------------------------------------------------------
  landing: {
    nav: [
      { label: "Características", href: "#features" },
      { label: "Precios", href: "#pricing" },
      { label: "Preguntas", href: "#faq" },
      { label: "Docs", href: "/docs" },
    ],
    hero: {
      eyebrow: "Para estudiantes universitarios",
      title: "Nunca más olvides una entrega de Moodle ni una tarea pendiente",
      subtitle:
        "Conecta tus cursos y recibe recordatorios automáticos días antes de cada fecha límite.",
      cta: { label: "Regístrate gratis", href: "#waitlist" },
      ctaSecondary: { label: "Ver docs", href: "/docs" },
    },
    problem: {
      eyebrow: "El problema",
      title: "Tu negocio necesita presencia digital, no un título en sistemas.",
      subtitle:
        "La mayoría de los emprendedores se quedan fuera de lo digital por creer que es caro o complicado.",
      items: [
        {
          icon: "Timer",
          title: "Meses cotizando",
          body: "Una página 'profesional' te la cotizan cara y tarda meses. Mientras, tus clientes te buscan y no te encuentran.",
        },
        {
          icon: "Puzzle",
          title: "Herramientas que abruman",
          body: "Dominio, hosting, base de datos… cada término suena a otro idioma y nadie te lo explica en simple.",
        },
        {
          icon: "PlugZap",
          title: "La IA cambió las reglas",
          body: "Hoy puedes construirlo tú, describiendo lo que necesitas en español. Solo te falta la base correcta.",
        },
      ],
    },
    features: {
      eyebrow: "Lo que ya viene listo",
      title: "Todo lo del curso, ya cableado.",
      subtitle: "Tú te enfocas en tu negocio; la plantilla pone la parte técnica.",
      items: [
        {
          icon: "BellRing",
          title: "Avisos antes de cada entrega",
          body: "Te notificamos con días de anticipación para que organices tu tiempo sin estrés de último minuto.",
        },
        {
          icon: "GraduationCap",
          title: "Conecta tus cursos de Moodle",
          body: "Registra tus materias una vez y centraliza todas las fechas límite en un solo lugar.",
        },
        {
          icon: "Mail",
          title: "Recordatorios directo a tu bandeja",
          body: "Recibe correos claros con el nombre de la tarea, la materia y cuánto falta para entregar.",
        },
      ],
    },
    faq: {
      eyebrow: "Preguntas frecuentes",
      title: "Lo que todos preguntan antes de arrancar.",
      items: [
        {
          q: "¿Funciona con el Moodle de mi universidad?",
          a: "Sí, si tu escuela usa Moodle estándar. Solo necesitas tu cuenta de alumno para sincronizar tus cursos.",
        },
        {
          q: "¿Tengo que compartir mi contraseña de Moodle?",
          a: "No guardamos tu contraseña. Solo leemos las fechas de entrega de los cursos que tú autorizas.",
        },
        {
          q: "¿Cuánto cuesta usar EntregaAlert?",
          a: "Puedes registrarte gratis y recibir avisos básicos por correo. Los planes de pago desbloquean más materias y recordatorios personalizados.",
        },
        {
          q: "¿Con cuánta anticipación me avisan?",
          a: "Por defecto te escribimos 3 y 1 día antes de cada entrega, y puedes ajustar los plazos desde tu panel.",
        },
      ],
    },
    finalCta: {
      eyebrow: "Tu turno",
      title: "Deja de posponerlo. Publica tu negocio.",
      subtitle:
        "Edita config.js con los datos de tu negocio, describe lo que quieres y ten tu página en línea esta misma semana.",
      cta: { label: "Apúntate a la lista", href: "#waitlist" },
      ctaSecondary: { label: "Leer las docs", href: "/docs" },
    },
    waitlist: {
      eyebrow: "Únete primero",
      title: "Sé de los primeros en saber.",
      subtitle: "Déjanos tu correo y te avisamos cuando esto arranque.",
      successMessage: "¡Listo! Te avisamos en cuanto haya novedades.",
      buttonLabel: "Quiero entrar",
      placeholder: "tu@email.com",
    },
    footer: {
      tagline:
        "Hecho por Pedro Gutiérrez (Roni) para el curso Vibe Code · Change and Code × Startup Chihuahua.",
      columns: [
        {
          title: "Producto",
          links: [
            { label: "Características", href: "#features" },
            { label: "Precios", href: "#pricing" },
            { label: "Preguntas", href: "#faq" },
          ],
        },
        {
          title: "Recursos",
          links: [
            { label: "Docs", href: "/docs" },
            { label: "Quick start", href: "/docs/setup/quick-start" },
            { label: "Troubleshooting", href: "/docs/troubleshooting/errores-comunes" },
          ],
        },
        {
          title: "Comunidad",
          links: [
            { label: "GitHub", href: "https://github.com/RoniHY/Vibecoding", external: true },
            { label: "Change and Code", href: "https://changeandcode.com", external: true },
          ],
        },
      ],
      // Compat: links planos usados en el bar inferior
      links: [
        { label: "Docs", href: "/docs" },
        { label: "GitHub", href: "https://github.com/RoniHY/Vibecoding", external: true },
      ],
    },
  },

  // -----------------------------------------------------------
  // Pricing — vitrina de planes.
  // Se muestra en la landing si features.pricing === true.
  // El cobro real (PayPal.me) depende de features.paypal.
  // -----------------------------------------------------------
  pricing: {
    eyebrow: "Precios",
    title: "Simple y sin sorpresas.",
    subtitle: "Empieza gratis. Sube de plan cuando tu producto crezca.",
    plans: [
      {
        id: "starter",
        name: "Starter",
        price: 0,
        currency: "USD",
        interval: "mes",
        description: "Para probar el producto.",
        features: ["Hasta 100 usuarios", "Soporte por email", "Branding Vibecoding"],
        cta: "Empezar gratis",
      },
      {
        id: "pro",
        name: "Pro",
        price: 29,
        currency: "USD",
        interval: "mes",
        description: "Para founders que ya facturan.",
        features: ["Usuarios ilimitados", "Soporte prioritario", "Sin branding"],
        cta: "Probar Pro",
        highlighted: true,
      },
    ],
  },
}

export default config
