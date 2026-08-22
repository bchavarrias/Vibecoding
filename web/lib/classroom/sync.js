import {
  refreshClassroomToken,
  tokenExpiresAt,
} from "@/lib/classroom/oauth"
import { listActiveCourses, listCourseWork, parseClassroomDueDate } from "@/lib/classroom/api"

// Obtiene un access_token válido; refresca si expiró.
export async function getClassroomAccessToken(supabase, userId) {
  const { data: conn, error } = await supabase
    .from("classroom_connections")
    .select("access_token, refresh_token, token_expires_at")
    .eq("user_id", userId)
    .maybeSingle()

  if (error) throw new Error(error.message)
  if (!conn?.refresh_token) return null

  const expires = conn.token_expires_at
    ? new Date(conn.token_expires_at).getTime()
    : 0
  const stillValid = conn.access_token && expires > Date.now() + 60_000

  if (stillValid) return conn.access_token

  const refreshed = await refreshClassroomToken(conn.refresh_token)
  const newExpires = tokenExpiresAt(refreshed.expires_in)

  await supabase
    .from("classroom_connections")
    .update({
      access_token: refreshed.access_token,
      token_expires_at: newExpires,
      connected_at: new Date().toISOString(),
    })
    .eq("user_id", userId)

  return refreshed.access_token
}

// Importa cursos → materias y tareas → recordatorios por alumno inscrito.
export async function syncClassroomData(supabase, userId, accessToken) {
  const courses = await listActiveCourses(accessToken)

  let materiasSync = 0
  let tareasSync = 0
  let tareasSkip = 0

  for (const course of courses) {
    const { data: existingMateria } = await supabase
      .from("materias")
      .select("id")
      .eq("user_id", userId)
      .eq("classroom_course_id", course.id)
      .maybeSingle()

    let materiaId = existingMateria?.id

    if (materiaId) {
      await supabase
        .from("materias")
        .update({
          nombre: course.name,
          classroom_course_name: course.name,
        })
        .eq("id", materiaId)
        .eq("user_id", userId)
    } else {
      const { data: created, error } = await supabase
        .from("materias")
        .insert({
          user_id: userId,
          nombre: course.name,
          classroom_course_id: course.id,
          classroom_course_name: course.name,
        })
        .select("id")
        .single()
      if (error) throw new Error(error.message)
      materiaId = created.id
    }
    materiasSync++

    const { data: inscripciones } = await supabase
      .from("inscripciones")
      .select("alumno_id")
      .eq("user_id", userId)
      .eq("materia_id", materiaId)

    const alumnoIds = [...new Set((inscripciones ?? []).map((i) => i.alumno_id))]
    if (!alumnoIds.length) {
      tareasSkip++
      continue
    }

    const coursework = await listCourseWork(accessToken, course.id)

    for (const work of coursework) {
      const fechaEntrega = parseClassroomDueDate(work.dueDate, work.dueTime)
      if (!fechaEntrega) continue

      for (const alumnoId of alumnoIds) {
        const { data: existingTarea } = await supabase
          .from("tareas")
          .select("id")
          .eq("user_id", userId)
          .eq("classroom_coursework_id", work.id)
          .eq("alumno_id", alumnoId)
          .maybeSingle()

        const payload = {
          titulo: work.title,
          descripcion: work.description || null,
          fecha_entrega: fechaEntrega,
          materia_id: materiaId,
        }

        if (existingTarea) {
          await supabase
            .from("tareas")
            .update(payload)
            .eq("id", existingTarea.id)
            .eq("user_id", userId)
        } else {
          await supabase.from("tareas").insert({
            user_id: userId,
            alumno_id: alumnoId,
            ...payload,
            classroom_coursework_id: work.id,
          })
        }
        tareasSync++
      }
    }
  }

  return {
    courses: courses.length,
    materias: materiasSync,
    tareas: tareasSync,
    cursosSinInscripciones: tareasSkip,
  }
}
