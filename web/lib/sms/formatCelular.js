/** Normaliza celular MX a E.164 (+52 + 10 dígitos). */
export function toE164Mx(celular) {
  if (!celular) return null
  const digits = celular.replace(/\D/g, "")
  if (digits.length === 10) return `+52${digits}`
  if (digits.length === 12 && digits.startsWith("52")) return `+${digits}`
  if (digits.length === 13 && digits.startsWith("521")) return `+${digits}`
  return null
}

/** Dígitos para wa.me (52 + número de 10 dígitos, sin +). */
export function toWhatsAppDigits(celular) {
  const e164 = toE164Mx(celular)
  if (!e164) return null
  return e164.replace(/\D/g, "")
}
