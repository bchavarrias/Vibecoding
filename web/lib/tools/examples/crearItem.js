import { createClient } from "@/lib/supabase/server"

// Tool de ejemplo: registra un alumno en core_items del usuario autenticado.
export const crearItem = {
  name: "crear_alumno",
  description: "Registra un nuevo alumno con nombre, teléfono y correo.",
  parameters: {
    type: "object",
    properties: {
      nombre: { type: "string", description: "Nombre completo del alumno." },
      celular: { type: "string", description: "Celular para recordatorios." },
      correo: { type: "string", description: "Correo del alumno." },
    },
    required: ["nombre", "celular", "correo"],
    additionalProperties: false,
  },
  async execute({ nombre, celular, correo }) {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) throw new Error("No autenticado")

    const { data, error } = await supabase
      .from("core_items")
      .insert({ user_id: user.id, nombre, celular, correo: correo.toLowerCase() })
      .select()
      .single()
    if (error) throw new Error(error.message)
    return { ok: true, alumno: data }
  },
}
