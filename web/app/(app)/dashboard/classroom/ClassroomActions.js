"use client"

import { useState } from "react"
import config from "@/config"

export default function ClassroomActions({ disabled, isConnected }) {
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState(null)
  const labels = config.dashboard.classroom

  async function sync() {
    setLoading(true)
    setMessage(null)
    try {
      const res = await fetch("/api/classroom/sync", { method: "POST" })
      const body = await res.json()
      if (res.status === 401 && body.connect) {
        window.location.href = body.connect
        return
      }
      if (!res.ok) throw new Error(body.error || "Error al sincronizar")
      setMessage(body.message || "Sincronización completada.")
    } catch (err) {
      setMessage(err.message)
    } finally {
      setLoading(false)
    }
  }

  if (!isConnected) {
    return (
      <div>
        <a
          href={disabled ? undefined : "/api/classroom/connect"}
          className={`btn btn-primary btn-sm ${disabled ? "btn-disabled pointer-events-none" : ""}`}
          aria-disabled={disabled}
        >
          {labels.connect}
        </a>
      </div>
    )
  }

  return (
    <div>
      <button
        type="button"
        onClick={sync}
        disabled={disabled || loading}
        className="btn btn-primary btn-sm"
      >
        {loading && <span className="loading loading-spinner loading-sm" />}
        {labels.sync}
      </button>
      {message && <p className="mt-2 text-sm text-base-content/70">{message}</p>}
    </div>
  )
}
