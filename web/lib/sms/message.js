import config from "@/config"
import { toWhatsAppDigits } from "@/lib/sms/formatCelular"

const dateFmt = new Intl.DateTimeFormat("es-MX", {
  day: "numeric",
  month: "short",
  year: "numeric",
  hour: "2-digit",
  minute: "2-digit",
})

export function buildRecordatorioBody({ alumnoNombre, titulo, materiaNombre, fechaEntrega }) {
  const tpl = config.sms.recordatorioTemplate
  const fecha = dateFmt.format(new Date(fechaEntrega))
  const materia = materiaNombre || config.sms.sinMateria
  return tpl
    .replace("{app}", config.app.name)
    .replace("{alumno}", alumnoNombre)
    .replace("{titulo}", titulo)
    .replace("{materia}", materia)
    .replace("{fecha}", fecha)
}

export function buildWhatsAppUrl(celular, body) {
  const wa = toWhatsAppDigits(celular)
  if (!wa) return null
  return `https://wa.me/${wa}?text=${encodeURIComponent(body)}`
}
