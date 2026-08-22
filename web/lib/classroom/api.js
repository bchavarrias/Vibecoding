// ============================================================
// Google Classroom · cliente HTTP
// ============================================================

const BASE = "https://classroom.googleapis.com/v1"

async function classroomFetch(path, accessToken) {
  const res = await fetch(`${BASE}${path}`, {
    headers: { Authorization: `Bearer ${accessToken}` },
    cache: "no-store",
  })
  const data = await res.json()
  if (!res.ok) {
    throw new Error(data.error?.message || `Classroom API error ${res.status}`)
  }
  return data
}

export async function listActiveCourses(accessToken) {
  const courses = []
  let pageToken = null

  do {
    const qs = new URLSearchParams({ courseStates: "ACTIVE" })
    if (pageToken) qs.set("pageToken", pageToken)
    const data = await classroomFetch(`/courses?${qs.toString()}`, accessToken)
    courses.push(...(data.courses ?? []))
    pageToken = data.nextPageToken ?? null
  } while (pageToken)

  return courses
}

export async function listCourseWork(accessToken, courseId) {
  const items = []
  let pageToken = null

  do {
    const qs = new URLSearchParams()
    if (pageToken) qs.set("pageToken", pageToken)
    const suffix = qs.toString() ? `?${qs.toString()}` : ""
    const data = await classroomFetch(
      `/courses/${courseId}/courseWork${suffix}`,
      accessToken
    )
    items.push(...(data.courseWork ?? []))
    pageToken = data.nextPageToken ?? null
  } while (pageToken)

  return items
}

export function parseClassroomDueDate(dueDate, dueTime) {
  if (!dueDate?.year || !dueDate?.month || !dueDate?.day) return null
  const hours = dueTime?.hours ?? 23
  const minutes = dueTime?.minutes ?? 59
  return new Date(
    dueDate.year,
    dueDate.month - 1,
    dueDate.day,
    hours,
    minutes
  ).toISOString()
}
