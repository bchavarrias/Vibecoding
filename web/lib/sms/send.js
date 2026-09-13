import { getSmsConfig } from "@/lib/sms/client"
import { toE164Mx } from "@/lib/sms/formatCelular"
import { buildRecordatorioBody, buildWhatsAppUrl } from "@/lib/sms/message"

export async function sendRecordatorioTarea({
  celular,
  alumnoNombre,
  titulo,
  materiaNombre,
  fechaEntrega,
}) {
  const body = buildRecordatorioBody({
    alumnoNombre,
    titulo,
    materiaNombre,
    fechaEntrega,
  })

  const whatsappUrl = buildWhatsAppUrl(celular, body)
  const to = toE164Mx(celular)
  if (!to) {
    return { ok: false, error: "invalid_phone", whatsappUrl }
  }

  const sms = getSmsConfig()
  if (!sms) {
    return { ok: false, skipped: true, whatsappUrl, body }
  }

  const auth = Buffer.from(`${sms.accountSid}:${sms.authToken}`).toString("base64")
  const params = new URLSearchParams({
    To: to,
    From: sms.from,
    Body: body,
  })

  const res = await fetch(
    `https://api.twilio.com/2010-04-01/Accounts/${sms.accountSid}/Messages.json`,
    {
      method: "POST",
      headers: {
        Authorization: `Basic ${auth}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: params.toString(),
    }
  )

  const data = await res.json().catch(() => ({}))
  if (!res.ok) {
    console.error("[sms] Twilio:", data.message || res.status)
    return {
      ok: false,
      error: data.message || "twilio_error",
      whatsappUrl,
    }
  }

  return { ok: true, sid: data.sid, whatsappUrl }
}
