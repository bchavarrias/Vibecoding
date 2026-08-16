import { createClient } from "@/lib/supabase/server"

// Escapa comodines de ILIKE para que el texto del usuario no altere el patrón.
function escapeIlike(value) {
  return value.replace(/[%_\\]/g, "\\$&")
}

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

    const term = query.trim()
    if (!term) return { ok: true, alumnos: [] }

    const pattern = `%${escapeIlike(term)}%`
    const select = "id, nombre, telefono, correo"

    // Dos consultas .ilike() en lugar de .or() con string crudo: PostgREST
    // interpreta comas en el valor como separadores de filtros (ej. "García, Ana").
    const [byNombre, byCorreo] = await Promise.all([
      supabase
        .from("core_items")
        .select(select)
        .eq("user_id", user.id)
        .ilike("nombre", pattern),
      supabase
        .from("core_items")
        .select(select)
        .eq("user_id", user.id)
        .ilike("correo", pattern),
    ])

    if (byNombre.error) throw new Error(byNombre.error.message)
    if (byCorreo.error) throw new Error(byCorreo.error.message)

    const byId = new Map()
    for (const row of [...(byNombre.data ?? []), ...(byCorreo.data ?? [])]) {
      byId.set(row.id, row)
    }

    return { ok: true, alumnos: [...byId.values()] }
  },
}
