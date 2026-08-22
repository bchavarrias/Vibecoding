// ============================================================
// Académico · cuatrimestres y periodos (Chavarría's Org)
// ------------------------------------------------------------
// Carrera de 10 cuatrimestres. Cada periodo calendario dura 4 meses:
//   1 → Ene–Abr | 2 → May–Ago | 3 → Sep–Dic
// ============================================================

export const CUATRIMESTRES_TOTAL = 10
export const MAX_MATERIAS_POR_CUATRIMESTRE = 5

export const PERIODOS = [
  { id: 1, label: "Ene–Abr", meses: [1, 2, 3, 4] },
  { id: 2, label: "May–Ago", meses: [5, 6, 7, 8] },
  { id: 3, label: "Sep–Dic", meses: [9, 10, 11, 12] },
]

export function getPeriodoFromDate(date = new Date()) {
  const mes = date.getMonth() + 1
  if (mes <= 4) return PERIODOS[0]
  if (mes <= 8) return PERIODOS[1]
  return PERIODOS[2]
}

export function periodoLabel(anio, periodoId) {
  const p = PERIODOS.find((x) => x.id === Number(periodoId))
  return p ? `${p.label} ${anio}` : `Periodo ${periodoId} ${anio}`
}

export function cuatrimestreOptions(total = CUATRIMESTRES_TOTAL) {
  return Array.from({ length: total }, (_, i) => ({
    value: i + 1,
    label: `${i + 1}° cuatrimestre`,
  }))
}

export function periodoOptions() {
  return PERIODOS.map((p) => ({ value: p.id, label: p.label }))
}
