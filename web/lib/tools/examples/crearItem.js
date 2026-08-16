import { createClient } from "@/lib/supabase/server"

// Tool de ejemplo: registra un alumno en core_items del usuario autenticado.
export const crearItem = {
  name: "crear_alumno",
  description: "Registra un nuevo alumno con nombre, teléfono y correo.",
  parameters: {
    type: "object",
    properties: {
      nombre: { type: "string", description: "Nombre completo del alumno." },
      telefono: { type: "string", description: "Teléfono de contacto." },
      correo: { type: "string", description: "Correo para avisos de tareas." },
    },
    required: ["nombre", "telefono", "correo"],
    additionalProperties: false,
  },
  async execute({ nombre, telefono, correo }) {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) throw new Error("No autenticado")

    const { data, error } = await supabase
      .from("core_items")
      .insert({ user_id: user.id, nombre, telefono, correo: correo.toLowerCase() })
      .select()
      .single()
    if (error) throw new Error(error.message)
    return { ok: true, alumno: data }
  },
}
