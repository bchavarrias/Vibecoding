"use client"

import { useRouter } from "next/navigation"
import { useState } from "react"

export default function EnviarRecordatorioButton({ tareaId, labels }) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [hint, setHint] = useState(null)
  const [showMarkManual, setShowMarkManual] = useState(false)

  async function enviar() {
    setLoading(true)
    setHint(null)
    try {
      const res = await fetch("/api/recordatorios/enviar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tareaId }),
      })
      const data = await res.json()

      if (res.ok && data.ok) {
        setHint({ type: "success", text: labels.smsOk })
        router.refresh()
        return
      }

      if (data.skipped && data.whatsappUrl) {
        window.open(data.whatsappUrl, "_blank", "noopener,noreferrer")
        setHint({ type: "info", text: labels.smsWhatsAppFallback })
        setShowMarkManual(true)
        return
      }

      if (data.whatsappUrl && (data.error === "invalid_phone" || data.error === "twilio_error")) {
        setHint({
          type: "warning",
          text:
            data.error === "invalid_phone"
              ? labels.smsInvalidPhone
              : `${labels.smsError} ${labels.smsWhatsAppHint}`,
        })
        return
      }

      if (data.error === "no_phone") {
        setHint({ type: "error", text: labels.smsNoPhone })
        return
      }

      setHint({ type: "error", text: labels.smsError })
    } catch {
      setHint({ type: "error", text: labels.smsError })
    } finally {
      setLoading(false)
    }
  }

  async function marcarManual() {
    setLoading(true)
    try {
      const res = await fetch("/api/recordatorios/marcar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tareaId }),
      })
      if (res.ok) {
        setShowMarkManual(false)
        setHint({ type: "success", text: labels.smsOk })
        router.refresh()
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex flex-col items-end gap-1">
      <button
        type="button"
        onClick={enviar}
        disabled={loading}
        className="btn btn-ghost btn-xs btn-interactive"
      >
        {loading && <span className="loading loading-spinner loading-xs" />}
        {loading ? labels.smsSending : labels.sendCelular}
      </button>
      {showMarkManual && (
        <button
          type="button"
          onClick={marcarManual}
          disabled={loading}
          className="btn btn-ghost btn-xs text-primary"
        >
          {labels.smsMarkManual}
        </button>
      )}
      {hint && (
        <p
          role="status"
          className={`max-w-[12rem] text-right text-[10px] leading-snug ${
            hint.type === "success"
              ? "text-success"
              : hint.type === "error"
                ? "text-error"
                : hint.type === "warning"
                  ? "text-warning"
                  : "text-base-content/60"
          }`}
        >
          {hint.text}
        </p>
      )}
    </div>
  )
}
