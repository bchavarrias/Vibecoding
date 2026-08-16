import { createClient } from "@/lib/supabase/server"

// Tool de ejemplo: busca alumnos del usuario por nombre o correo.
export const buscarItems = {
  name: "buscar_alumnos",
  description: "Busca alumnos registrados por coincidencia en nombre o correo.",
  parameters: {
    type: "object",
    properties: {
      query: { type: "string", description: "Texto a buscar en nombre o correo." },
    },
    required: ["query"],
    additionalProperties: false,
  },
  async execute({ query }) {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) throw new Error("No autenticado")

    const { data, error } = await supabase
      .from("core_items")
      .select("id, nombre, telefono, correo")
      .eq("user_id", user.id)
      .or(`nombre.ilike.%${query}%,correo.ilike.%${query}%`)
    if (error) throw new Error(error.message)
    return { ok: true, alumnos: data }
  },
}
