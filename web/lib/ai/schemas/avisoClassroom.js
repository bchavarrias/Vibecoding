import { z } from "zod"

// Schema para extraer una tarea estructurada de un aviso de Classroom.
export const avisoClassroomSchema = z.object({
  titulo: z.string().describe("Título corto de la tarea o entrega"),
  materia: z.string().describe("Nombre de la materia o curso"),
  fecha_entrega: z
    .string()
    .describe("Fecha límite en formato ISO YYYY-MM-DD"),
  hora_limite: z
    .string()
    .describe("Hora límite en formato 24h HH:MM; usar 23:59 si no se menciona"),
  tipo_entrega: z
    .enum(["archivo", "link", "texto", "examen", "otro"])
    .describe("Tipo de entrega solicitada"),
  prioridad: z
    .enum(["baja", "media", "alta"])
    .describe("Prioridad según proximidad y peso de la entrega"),
  descripcion: z
    .string()
    .describe("Instrucciones breves de entrega; cadena vacía si no hay"),
  dias_antes_recordatorio: z
    .array(z.number())
    .describe("Días antes de la entrega para recordar, ej. [3, 1]"),
})

export function buildAvisoClassroomPrompt(texto, anio = new Date().getFullYear()) {
  return `Extrae los datos de esta tarea universitaria a partir del aviso (Google Classroom, correo del profesor o mensaje de grupo).
Reglas:
- Año actual: ${anio}. Si el aviso no dice año, usa ${anio}.
- Si no hay hora explícita, usa 23:59.
- dias_antes_recordatorio: usa [3, 1] por defecto salvo que el texto indique otro plazo.
- descripcion: resume en una frase cómo entregar; "" si no hay detalle.

Aviso:
"""
${texto.trim()}
"""`
}
